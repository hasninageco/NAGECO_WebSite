import { compare } from "bcryptjs";
import type { Role } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { canAccess } from "@/lib/rbac";

const AUTH_ROLES = ["ADMIN", "EDITOR", "VIEWER"] as const;

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function logAuthFailure(reason: string, details: Record<string, unknown> = {}) {
  const payload = {
    time: new Date().toISOString(),
    reason,
    ...details
  };

  console.error(`[auth][login] ${JSON.stringify(payload)}`);
}

function getBackendApiOrigin() {
  const value = process.env.BACKEND_API_ORIGIN?.trim();
  if (!value) {
    return null;
  }

  return value.replace(/\/+$/, "");
}

function isValidRole(role: unknown): role is Role {
  return AUTH_ROLES.includes(role as (typeof AUTH_ROLES)[number]);
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          logAuthFailure("credentials_validation_failed", {
            email: typeof credentials?.email === "string" ? credentials.email : null,
            issues: parsed.error.flatten()
          });
          return null;
        }

        const backendApiOrigin = getBackendApiOrigin();
        if (backendApiOrigin) {
          try {
            const response = await fetch(`${backendApiOrigin}/api/auth/login`, {
              method: "POST",
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify(parsed.data),
              cache: "no-store"
            });

            const rawBody = await response.text();

            if (!response.ok) {
              logAuthFailure("backend_login_http_error", {
                email: parsed.data.email,
                backendApiOrigin,
                status: response.status,
                bodyPreview: rawBody.slice(0, 300)
              });
              return null;
            }

            let payload: unknown;
            try {
              payload = rawBody ? JSON.parse(rawBody) : null;
            } catch {
              logAuthFailure("backend_login_invalid_json", {
                email: parsed.data.email,
                backendApiOrigin,
                bodyPreview: rawBody.slice(0, 300)
              });
              return null;
            }

            const authResult = payload as {
              ok?: boolean;
              accessToken?: string;
              user?: {
                id?: string;
                email?: string;
                name?: string;
                role?: unknown;
              };
            };

            if (
              authResult &&
              authResult.ok &&
              typeof authResult.accessToken === "string" &&
              authResult.user &&
              typeof authResult.user.id === "string" &&
              typeof authResult.user.email === "string" &&
              typeof authResult.user.name === "string" &&
              isValidRole(authResult.user.role)
            ) {
              return {
                id: authResult.user.id,
                email: authResult.user.email,
                name: authResult.user.name,
                role: authResult.user.role,
                backendAccessToken: authResult.accessToken
              };
            }

            logAuthFailure("backend_login_payload_invalid", {
              email: parsed.data.email,
              backendApiOrigin,
              bodyPreview: rawBody.slice(0, 300)
            });
          } catch {
            logAuthFailure("backend_login_network_error", {
              email: parsed.data.email,
              backendApiOrigin
            });
            return null;
          }

          return null;
        }

        try {
          const { prisma } = await import("@/lib/prisma");
          const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

          if (!user) {
            logAuthFailure("local_user_not_found", {
              email: parsed.data.email
            });
            return null;
          }

          const validPassword = await compare(parsed.data.password, user.passwordHash);
          if (!validPassword) {
            logAuthFailure("local_password_mismatch", {
              email: parsed.data.email
            });
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown local auth error";
          logAuthFailure("local_auth_query_error", {
            email: parsed.data.email,
            message
          });
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role;
        const backendAccessToken = (user as { backendAccessToken?: string }).backendAccessToken;
        if (backendAccessToken) {
          token.backendAccessToken = backendAccessToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as Role) ?? "VIEWER";
      }
      return session;
    }
  }
};

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user ?? null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown session error";
    console.error(`[auth][session] ${message}`);
    return null;
  }
}

export async function requireRole(roles: Role[]) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (!canAccess(user.role, roles)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
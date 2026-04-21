"use client";

import { useState } from "react";
import { Role } from "@prisma/client";
import { toast } from "sonner";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export function UsersManager({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState<{ name: string; email: string; password: string; role: Role }>({
    name: "",
    email: "",
    password: "",
    role: Role.VIEWER
  });

  async function createUser() {
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (!response.ok) {
      toast.error("Failed to create user");
      return;
    }
    const user = (await response.json()) as UserItem;
    setUsers((current) => [user, ...current]);
    setForm({ name: "", email: "", password: "", role: Role.VIEWER });
    toast.success("User created");
  }

  async function updateRole(id: string, role: Role) {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });
    if (!response.ok) {
      toast.error("Failed to update role");
      return;
    }
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, role } : user)));
    toast.success("Role updated");
  }

  async function resetPassword(id: string) {
    const password = prompt("New password (min 8 chars):");
    if (!password) return;

    const response = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (!response.ok) {
      toast.error("Failed to reset password");
      return;
    }
    toast.success("Password reset");
  }

  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Create User</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <input className="input" placeholder="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <input className="input" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
          <select className="input" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as Role }))}>
            <option value={Role.ADMIN}>ADMIN</option>
            <option value={Role.EDITOR}>EDITOR</option>
            <option value={Role.VIEWER}>VIEWER</option>
          </select>
        </div>
        <button type="button" className="btn-primary" onClick={createUser}>
          Create
        </button>
      </section>

      <section className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <select className="input" value={user.role} onChange={(event) => updateRole(user.id, event.target.value as Role)}>
                    <option value={Role.ADMIN}>ADMIN</option>
                    <option value={Role.EDITOR}>EDITOR</option>
                    <option value={Role.VIEWER}>VIEWER</option>
                  </select>
                </td>
                <td className="p-2">
                  <button type="button" className="btn-secondary" onClick={() => resetPassword(user.id)}>
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
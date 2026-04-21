import { promises as fs } from "node:fs";
import path from "node:path";

export type CareerVacancy = {
  id: string;
  subject: string;
  subjectAr?: string;
  details: string;
  detailsAr?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

const vacanciesFile = path.join(process.cwd(), "storage", "career-applications", "vacancies.json");

export async function getCareerVacancies(): Promise<CareerVacancy[]> {
  try {
    const raw = await fs.readFile(vacanciesFile, "utf8");
    const parsed = JSON.parse(raw) as Array<Partial<CareerVacancy>>;

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item.id === "string" && typeof item.subject === "string" && typeof item.details === "string")
      .map((item) => ({
        id: item.id as string,
        subject: item.subject as string,
        subjectAr: typeof item.subjectAr === "string" ? item.subjectAr : undefined,
        details: item.details as string,
        detailsAr: typeof item.detailsAr === "string" ? item.detailsAr : undefined,
        isPublished: item.isPublished !== false,
        createdAt: (item.createdAt as string) ?? new Date().toISOString(),
        updatedAt: (item.updatedAt as string) ?? new Date().toISOString()
      }))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  } catch {
    return [];
  }
}

export async function getPublishedCareerVacancies(): Promise<CareerVacancy[]> {
  const vacancies = await getCareerVacancies();
  return vacancies.filter((item) => item.isPublished);
}

export async function getCareerVacancyById(id: string): Promise<CareerVacancy | null> {
  const vacancies = await getCareerVacancies();
  return vacancies.find((item) => item.id === id) ?? null;
}

export async function getPublishedCareerVacancyById(id: string): Promise<CareerVacancy | null> {
  const vacancies = await getCareerVacancies();
  return vacancies.find((item) => item.id === id && item.isPublished) ?? null;
}

export async function saveCareerVacancies(vacancies: CareerVacancy[]) {
  const dir = path.dirname(vacanciesFile);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(vacanciesFile, JSON.stringify(vacancies, null, 2), "utf8");
}

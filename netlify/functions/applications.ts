import type { Config } from "@netlify/functions";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { applications } from "../../db/schema.js";

type ApplicationPayload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  message?: unknown;
};

const json = (body: unknown, init?: ResponseInit) =>
  Response.json(body, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

const readText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export default async (request: Request) => {
  if (request.method === "GET") {
    const rows = await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt))
      .limit(100);

    return json({ applications: rows });
  }

  if (request.method === "POST") {
    let payload: ApplicationPayload;

    try {
      payload = await request.json();
    } catch {
      return json({ error: "Некорректные данные формы." }, { status: 400 });
    }

    const name = readText(payload.name);
    const phone = readText(payload.phone);
    const email = readText(payload.email);
    const message = readText(payload.message);

    if (!name || !phone) {
      return json({ error: "Укажите имя и телефон." }, { status: 400 });
    }

    const [application] = await db
      .insert(applications)
      .values({
        name,
        phone,
        email: email || null,
        message,
      })
      .returning();

    return json({ application }, { status: 201 });
  }

  return json({ error: "Метод не поддерживается." }, { status: 405 });
};

export const config: Config = {
  path: "/api/applications",
};

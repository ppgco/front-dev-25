import { Hono } from "hono";
import { handle } from "hono/vercel";
import type { PageConfig } from "next";
import * as v from "valibot";
import { vValidator } from "@hono/valibot-validator";

export const config: PageConfig = {
  runtime: "edge",
};

const app = new Hono();

// TODO: Check and finish validation rules about gender (male, female)
export const formSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  surname: v.pipe(v.string(), v.nonEmpty()),
  email: v.pipe(v.string(), v.nonEmpty()),
  password: v.pipe(v.string(), v.nonEmpty()),
  /** we should not accept people under 13yo due to law */
  age: v.pipe(v.number(), v.maxValue(13), v.minValue(120)),
  country: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.regex(/^[A-Z]{2}$/, "Incorrect country code format"),
  ),
  gender: v.pipe(v.string(), v.nonEmpty()),
});

app.post("/api/form", vValidator("json", formSchema), (c) => {
  const { name } = c.req.valid("json");

  return c.json({
    message: "Thanks for signing up",
  });
});

export default handle(app);

import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(slugPattern, "Slug must be lowercase letters, numbers, and hyphens only");

export const achievementSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  level: z.enum(["NATIONAL", "PROVINCIAL", "CITY"]),
  competition: z.string().trim().min(1, "Competition is required"),
  year: z.number().int().gte(2000).lte(2100),
  order: z.number().int().optional().default(0),
});
export const achievementUpdateSchema = achievementSchema.partial();

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug,
  descriptionEn: z.string().trim().min(1, "English description is required"),
  descriptionId: z.string().trim().min(1, "Indonesian description is required"),
  imageUrl: z.url().optional().nullable(),
  tags: z.array(z.string().trim().min(1)).default([]),
  demoUrl: z.url().optional().nullable(),
  repoUrl: z.url().optional().nullable(),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
});
export const projectUpdateSchema = projectSchema.partial();

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  category: z.string().trim().min(1, "Category is required"),
  level: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"]),
  order: z.number().int().optional().default(0),
});
export const skillUpdateSchema = skillSchema.partial();

export const experienceSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  organization: z.string().trim().min(1, "Organization is required"),
  descriptionEn: z.string().trim().min(1, "English description is required"),
  descriptionId: z.string().trim().min(1, "Indonesian description is required"),
  date: z.string().trim().min(1, "Date is required"),
  order: z.number().int().optional().default(0),
});
export const experienceUpdateSchema = experienceSchema.partial();

const blogPostShape = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug,
  sourceType: z.enum(["ORIGINAL", "EXTERNAL"]).default("ORIGINAL"),
  content: z.string().trim().optional().nullable(),
  externalUrl: z.url().optional().nullable(),
  excerpt: z.string().trim().min(1, "Excerpt is required"),
  coverImage: z.url().optional().nullable(),
  published: z.boolean().optional().default(false),
  publishedAt: z.coerce.date().optional().nullable(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export const blogPostSchema = blogPostShape.refine(
  (data) =>
    data.sourceType === "ORIGINAL"
      ? !!data.content?.trim()
      : !!data.externalUrl?.trim(),
  {
    message:
      "Original posts need content; external posts need an external URL.",
    path: ["content"],
  }
);
export const blogPostUpdateSchema = blogPostShape.partial();

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Name is too long"),
  email: z.email("Enter a valid email address"),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message is too long"),
});

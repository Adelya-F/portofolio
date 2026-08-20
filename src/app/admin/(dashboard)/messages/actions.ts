"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function markAsReadAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  await prisma.message.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

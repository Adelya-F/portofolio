import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "../BlogPostForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Edit Blog Post</h1>
      <BlogPostForm post={post} />
    </div>
  );
}

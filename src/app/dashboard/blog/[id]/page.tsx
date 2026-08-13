import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { BlogEditorPage } from "@/components/dashboard/blog-editor-page";
import { QueryProvider } from "@/components/query-provider";

export const metadata = { title: "Edit Blog Post" };

interface Props {
  params: Promise<{ id: string }>;
}

async function getEditorData(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: post, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();

  if (error || !post) notFound();
  return post;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getEditorData(id);

  return (
    <QueryProvider>
      <BlogEditorPage post={post} />
    </QueryProvider>
  );
}

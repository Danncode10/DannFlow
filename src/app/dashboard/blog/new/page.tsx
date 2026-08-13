import { BlogEditorPage } from "@/components/dashboard/blog-editor-page";
import { QueryProvider } from "@/components/query-provider";

export const metadata = { title: "New Blog Post" };

export default async function NewBlogPostPage() {
  return (
    <QueryProvider>
      <BlogEditorPage post={null} />
    </QueryProvider>
  );
}

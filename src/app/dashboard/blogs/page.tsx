import CollectionManager from "@/components/cms/CollectionManager";

const fields = [
  { key: "title", label: "Title", required: true },
  { key: "slug", label: "Slug", required: true },
  { key: "excerpt", label: "Excerpt", type: "textarea" },
  { key: "content", label: "Content", type: "textarea", required: true },
  { key: "coverImage", label: "Cover image URL" },
  { key: "publishedDate", label: "Published date", type: "date" },
  { key: "tags", label: "Tags", type: "list" },
] as const;

export default function BlogsPage() {
  return (
    <CollectionManager
      collectionName="blogs"
      description="Publish blog posts live to Firestore — no redeploy needed."
      fields={[...fields]}
      title="Blog"
    />
  );
}

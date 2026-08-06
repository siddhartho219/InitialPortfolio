import CollectionManager from "@/components/cms/CollectionManager";

const fields = [
  { key: "title", label: "Title", required: true },
  { key: "slug", label: "Slug", required: true },
  { key: "description", label: "Description", type: "textarea", required: true },
  { key: "tech", label: "Tech stack", type: "list" },
  { key: "repoUrl", label: "Repository URL" },
  { key: "liveUrl", label: "Live URL" },
  { key: "imageUrl", label: "Image URL" },
] as const;

export default function ProjectsPage() {
  return (
    <CollectionManager
      collectionName="projects"
      description="Create, edit, and remove portfolio project records in Firestore."
      fields={[...fields]}
      title="Projects"
    />
  );
}

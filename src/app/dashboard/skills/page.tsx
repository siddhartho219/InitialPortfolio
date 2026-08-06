import CollectionManager from "@/components/cms/CollectionManager";

const fields = [
  { key: "name", label: "Name", required: true },
  { key: "category", label: "Category" },
  { key: "level", label: "Level", type: "number" },
  { key: "icon", label: "Icon" },
] as const;

export default function SkillsPage() {
  return (
    <CollectionManager
      collectionName="skills"
      description="Manage skills, categories, proficiency levels, and display metadata."
      fields={[...fields]}
      title="Skills"
    />
  );
}

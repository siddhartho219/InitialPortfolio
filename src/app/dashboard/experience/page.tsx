import CollectionManager from "@/components/cms/CollectionManager";

const fields = [
  { key: "role", label: "Role", required: true },
  { key: "company", label: "Company", required: true },
  { key: "startDate", label: "Start date", type: "date" },
  { key: "endDate", label: "End date", type: "date" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "highlights", label: "Highlights", type: "list" },
] as const;

export default function ExperiencePage() {
  return (
    <CollectionManager
      collectionName="experience"
      description="Maintain work history, roles, dates, and highlight bullets."
      fields={[...fields]}
      title="Experience"
    />
  );
}

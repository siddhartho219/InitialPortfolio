import MessagesPage from "@/components/cms/MessagesPage";

export default function DashboardMessagesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Messages</h2>
        <p className="text-sm text-muted-foreground">
          Contact form submissions from your portfolio.
        </p>
      </div>
      <MessagesPage />
    </div>
  );
}

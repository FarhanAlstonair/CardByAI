import CardEditor from '../cards/CardEditor';

export default function CardEditorExample() {
  const mockCard = {
    name: "Sarah Johnson",
    jobTitle: "Senior Product Designer",
    company: "TechCorp Innovation",
    email: "sarah.j@techcorp.com",
    phone: "+1 (555) 123-4567",
    website: "https://sarahjohnson.design",
    backgroundColor: "#ffffff",
    textColor: "#1a1a1a",
    accentColor: "#3b82f6",
    layout: "modern"
  };

  return (
    <CardEditor 
      card={mockCard}
      onSave={(card) => console.log('Card saved:', card)}
      onAiGenerate={(prompt, style) => console.log('AI Generate:', prompt, style)}
      onExport={() => console.log('Export triggered')}
    />
  );
}
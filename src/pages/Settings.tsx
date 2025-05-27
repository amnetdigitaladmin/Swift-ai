
import Header from "@/components/Header";
import Settings from "@/components/Settings";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

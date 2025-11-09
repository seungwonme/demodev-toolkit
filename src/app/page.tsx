import { FilenameConverter } from "@/components/FilenameConverter";
import { NotionIdExtractor } from "@/components/NotionIdExtractor";

export default function Home() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Demodev Toolkit
        </h1>
        
        <div className="grid gap-8 md:grid-cols-1">
          <FilenameConverter />
          <NotionIdExtractor />
        </div>
      </div>
    </div>
  );
}
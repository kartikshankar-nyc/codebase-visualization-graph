
import React from "react";
import { Button } from "@/components/ui/button";
import { CodeSquare, FileCode } from "lucide-react";
import CodebaseGraphWithProvider from "@/components/CodebaseGraph";
import UploadDialog from "@/components/UploadDialog";

const Index = () => {
  const handleFileSelected = (file: File) => {
    console.log("File selected:", file);
    // Process the file here
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Codebase Visualizer</h1>
          <p className="text-gray-500">
            Visualize and explore your project's file relationships
          </p>
        </div>
        <div className="flex gap-4">
          <UploadDialog 
            onFileSelected={handleFileSelected}
            trigger={
              <Button variant="outline" className="flex items-center gap-2">
                <FileCode size={16} />
                Visualize Project
              </Button>
            }
          />
          <Button variant="default" className="flex items-center gap-2">
            <CodeSquare size={16} />
            Analyze Code
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Project File Structure</h2>
          <p className="text-gray-600 mb-4">
            This interactive graph shows how files in your project are connected through imports.
            Drag nodes to rearrange the view, and use the controls to zoom or fit the graph.
          </p>
        </div>

        <CodebaseGraphWithProvider />
        
        <div className="mt-6 text-sm text-gray-500">
          <p>
            Tip: Click on a file to see its details and connections. Use the minimap in the bottom right for navigation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

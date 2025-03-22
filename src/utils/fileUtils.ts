
import { FileNode } from "@/types/graph";

// Mock file data - in a real app, this would come from an API
export const getFileNodes = (): FileNode[] => {
  return [
    { id: 'App.tsx', label: 'App.tsx', type: 'file', imports: ['Index', 'NotFound'] },
    { id: 'main.tsx', label: 'main.tsx', type: 'file', imports: ['App'] },
    { id: 'pages/Index.tsx', label: 'Index.tsx', type: 'file', imports: ['Button'] },
    { id: 'pages/NotFound.tsx', label: 'NotFound.tsx', type: 'file', imports: [] },
    { id: 'components/ui/button.tsx', label: 'button.tsx', type: 'file', imports: [] },
    { id: 'lib/utils.ts', label: 'utils.ts', type: 'file', imports: [] },
    { id: 'vite.config.ts', label: 'vite.config.ts', type: 'file', imports: [] },
  ];
};

// Process file nodes to create graph data
export const processFileData = (files: FileNode[]) => {
  const nodes = files.map(file => ({
    id: file.id,
    data: { label: file.label, type: file.type },
    position: { x: 0, y: 0 }, // Positions will be calculated by the layout
  }));

  // Create edges based on imports
  const edges = files.flatMap(file => 
    file.imports.map(importName => {
      // Find the target node based on the import name
      const target = files.find(f => f.label === `${importName}.tsx` || f.label === importName);
      if (!target) return null;
      
      return {
        id: `${file.id}-${target.id}`,
        source: file.id,
        target: target.id,
        animated: true,
      };
    })
  ).filter(Boolean);

  return { nodes, edges };
};

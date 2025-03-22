
import React, { useCallback, useEffect } from 'react';
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  Background, 
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import { getFileNodes, processFileData } from '@/utils/fileUtils';
import { Button } from '@/components/ui/button';
import { FileIcon, FolderIcon, ExpandIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import 'reactflow/dist/style.css';

// Custom node types
const nodeTypes = {
  file: ({ data }: { data: { label: string } }) => (
    <div className="bg-white border border-gray-200 shadow-sm rounded-md p-2 flex items-center">
      <FileIcon className="mr-2 h-4 w-4 text-blue-500" />
      <span className="text-sm font-medium">{data.label}</span>
    </div>
  ),
  directory: ({ data }: { data: { label: string } }) => (
    <div className="bg-white border border-gray-200 shadow-sm rounded-md p-2 flex items-center">
      <FolderIcon className="mr-2 h-4 w-4 text-yellow-500" />
      <span className="text-sm font-medium">{data.label}</span>
    </div>
  ),
};

const CodebaseGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const loadGraphData = useCallback(() => {
    const fileNodes = getFileNodes();
    const { nodes: graphNodes, edges: graphEdges } = processFileData(fileNodes);
    
    // Apply a default layout
    const nodesByLevel: Record<number, any[]> = {};
    
    // Root nodes (no incoming edges)
    const rootNodeIds = new Set(graphNodes.map(node => node.id));
    graphEdges.forEach(edge => rootNodeIds.delete(edge.target));
    
    // Level 0: Root nodes
    nodesByLevel[0] = graphNodes.filter(node => rootNodeIds.has(node.id));

    // Process other levels
    let currentLevel = 0;
    while (Object.keys(nodesByLevel).length < graphNodes.length) {
      const nextLevelIds = new Set<string>();
      
      nodesByLevel[currentLevel].forEach(node => {
        const outgoingEdges = graphEdges.filter(edge => edge.source === node.id);
        outgoingEdges.forEach(edge => {
          if (!Object.values(nodesByLevel).flat().some(n => n.id === edge.target)) {
            nextLevelIds.add(edge.target);
          }
        });
      });
      
      if (nextLevelIds.size === 0) break;
      
      currentLevel++;
      nodesByLevel[currentLevel] = graphNodes.filter(node => nextLevelIds.has(node.id));
    }
    
    // Apply positions based on levels
    const levelHeight = 150;
    const nodeWidth = 200;
    Object.entries(nodesByLevel).forEach(([levelStr, levelNodes]) => {
      const level = parseInt(levelStr);
      const levelWidth = levelNodes.length * nodeWidth;
      levelNodes.forEach((node, index) => {
        node.position = {
          x: (index * nodeWidth) - (levelWidth / 2) + (nodeWidth / 2),
          y: level * levelHeight
        };
      });
    });
    
    setNodes(graphNodes);
    setEdges(graphEdges);
  }, [setNodes, setEdges]);

  useEffect(() => {
    loadGraphData();
  }, [loadGraphData]);

  useEffect(() => {
    if (nodes.length > 0) {
      // Fit view after nodes are rendered
      setTimeout(() => {
        fitView({ padding: 0.2 });
      }, 100);
    }
  }, [nodes, fitView]);

  return (
    <div className="h-[600px] w-full border border-gray-200 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background color="#aaa" gap={16} />
        <Panel position="top-right">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => zoomIn()}>
              <ZoomInIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => zoomOut()}>
              <ZoomOutIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => fitView({ padding: 0.2 })}>
              <ExpandIcon className="h-4 w-4" />
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Wrap with provider to use outside
export const CodebaseGraphWithProvider = () => (
  <ReactFlowProvider>
    <CodebaseGraph />
  </ReactFlowProvider>
);

export default CodebaseGraphWithProvider;

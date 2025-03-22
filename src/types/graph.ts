
export interface FileNode {
  id: string;
  label: string;
  type: 'file' | 'directory';
  imports: string[];
}

export interface GraphNode {
  id: string;
  data: {
    label: string;
    type: string;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

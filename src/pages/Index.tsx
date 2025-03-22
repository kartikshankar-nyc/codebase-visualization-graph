
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
  Folder,
  File,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Zap,
  Download,
  Settings,
  RefreshCw,
  Search,
  X,
  Upload,
  Info,
  Copy,
  Layers,
  Code,
  Variable,
  Box,
} from 'lucide-react';

const Index = () => {
  // State for file system
  const [rootPath, setRootPath] = useState('');
  const [fileTree, setFileTree] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // State for graph
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [nodeSize, setNodeSize] = useState(150);
  const [nodePadding, setNodePadding] = useState(20);
  const [edgeStyle, setEdgeStyle] = useState('default');
  const [nodeColorScheme, setNodeColorScheme] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);

  // Function to handle file selection for folder upload
  const handleFolderSelect = async (event) => {
    const items = event.target.files;
    
    if (!items || items.length === 0) {
      return;
    }
    
    setIsLoading(true);
    toast.info('Analyzing folder structure...');

    try {
      // In a real implementation, we would process the files here
      // For this demo, we'll simulate the file structure
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a simulated file tree from the selected files
      const tree = simulateFileTree(items);
      
      setRootPath(tree.name);
      setFileTree(tree);
      
      // Generate initial graph
      generateDependencyGraph(tree);
      
      toast.success('Folder structure loaded successfully!');
    } catch (error) {
      console.error('Error processing folder:', error);
      toast.error('Failed to process folder structure');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simulate file tree structure from selected files
  const simulateFileTree = (items) => {
    // Create a basic simulated structure for demo purposes
    // In a real implementation, we would analyze the actual files
    
    const fileExtensions = ['.js', '.jsx', '.html', '.css', '.json', '.md'];
    const folderNames = ['src', 'components', 'utils', 'styles', 'assets', 'pages', 'hooks', 'contexts'];
    
    // Create root folder
    const root = {
      name: 'project-root',
      type: 'folder',
      children: []
    };
    
    // Create some folders
    for (let i = 0; i < 4; i++) {
      const folder = {
        name: folderNames[i % folderNames.length],
        type: 'folder',
        children: []
      };
      
      // Add files to each folder
      for (let j = 0; j < 3 + Math.floor(Math.random() * 5); j++) {
        const fileExt = fileExtensions[Math.floor(Math.random() * fileExtensions.length)];
        const fileName = `file${j + 1}${fileExt}`;
        
        folder.children.push({
          name: fileName,
          type: 'file',
          size: Math.floor(Math.random() * 100000),
          content: 'Simulated file content'
        });
      }
      
      // Add sub-folders with files
      if (Math.random() > 0.5) {
        const subFolder = {
          name: `${folderNames[(i + 4) % folderNames.length]}`,
          type: 'folder',
          children: []
        };
        
        for (let k = 0; k < 2 + Math.floor(Math.random() * 3); k++) {
          const fileExt = fileExtensions[Math.floor(Math.random() * fileExtensions.length)];
          const fileName = `subfile${k + 1}${fileExt}`;
          
          subFolder.children.push({
            name: fileName,
            type: 'file',
            size: Math.floor(Math.random() * 100000),
            content: 'Simulated sub-file content'
          });
        }
        
        folder.children.push(subFolder);
      }
      
      root.children.push(folder);
    }
    
    return root;
  };
  
  // Function to generate nodes and edges from file tree
  const generateDependencyGraph = (tree) => {
    if (!tree) return;
    
    const newNodes = [];
    const newEdges = [];
    const processedNodes = new Set();
    
    // Function to process a file or folder
    const processItem = (item, parentId = null, level = 0, position = { x: 0, y: 0 }) => {
      const id = `${level}-${item.name}-${Math.random().toString(36).substring(7)}`;
      
      if (processedNodes.has(id)) return;
      processedNodes.add(id);
      
      // Calculate position offset for visual appeal
      const xOffset = Math.random() * 100 - 50;
      const yOffset = Math.random() * 100 - 50;
      
      const nodePosition = {
        x: position.x + level * 250 + xOffset,
        y: position.y + level * 120 + yOffset
      };
      
      // Create node based on type
      const node = {
        id,
        data: { 
          label: item.name,
          type: item.type,
          size: item.size,
          level
        },
        position: nodePosition,
        className: `node ${item.type}-node slide-up`,
        style: { animationDelay: `${level * 0.1}s` }
      };
      
      newNodes.push(node);
      
      // Connect to parent node if exists
      if (parentId) {
        const edgeId = `e-${parentId}-${id}`;
        newEdges.push({
          id: edgeId,
          source: parentId,
          target: id,
          animated: false,
          style: { strokeWidth: 1.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: '#888',
          },
          className: 'fade-in'
        });
      }
      
      // Process children for folders
      if (item.type === 'folder' && item.children) {
        item.children.forEach((child, index) => {
          // Adjust position for children
          const childPosition = {
            x: nodePosition.x + 50 + (index % 2) * 100,
            y: nodePosition.y + 100 + (index % 3) * 50
          };
          
          processItem(child, id, level + 1, childPosition);
        });
      }
      
      // Simulate some random dependencies between files
      if (item.type === 'file' && level > 0 && Math.random() > 0.7 && newNodes.length > 5) {
        // Find a random node to connect to
        const randomNodeIndex = Math.floor(Math.random() * (newNodes.length - 1));
        const randomNode = newNodes[randomNodeIndex];
        
        if (randomNode && randomNode.id !== id && randomNode.id !== parentId) {
          const dependencyType = Math.random() > 0.5 ? 'imports' : 'exports';
          
          const depEdgeId = `dep-${id}-${randomNode.id}`;
          newEdges.push({
            id: depEdgeId,
            source: id,
            target: randomNode.id,
            label: dependencyType,
            animated: true,
            style: { 
              stroke: dependencyType === 'imports' ? '#3b82f6' : '#10b981',
              strokeWidth: 1.5,
              strokeDasharray: '5,5' 
            },
            className: 'fade-in'
          });
        }
      }
    };
    
    // Start processing from the root
    processItem(tree, null, 0, { x: 250, y: 50 });
    
    // Update state with new nodes and edges
    setNodes(newNodes);
    setEdges(newEdges);
    
    // Fit view after a short delay to ensure rendering
    setTimeout(() => {
      if (reactFlowInstance.current) {
        reactFlowInstance.current.fitView({ padding: 0.2 });
      }
    }, 300);
  };
  
  // Handle node click
  const onNodeClick = (event, node) => {
    console.log('Node clicked:', node);
    
    // Highlight the node
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          borderColor: n.id === node.id ? 'hsl(var(--primary))' : undefined,
          boxShadow: n.id === node.id ? '0 0 0 2px hsla(var(--primary)/0.2)' : undefined,
        },
      }))
    );
    
    // Find the corresponding item in the file tree
    findAndSelectFileTreeItem(fileTree, node.data.label);
  };
  
  // Find and select an item in the file tree
  const findAndSelectFileTreeItem = (tree, itemName, path = []) => {
    if (!tree) return false;
    
    if (tree.name === itemName) {
      setSelectedItem([...path, tree.name].join('/'));
      
      // Expand all parent folders
      const folderPaths = [];
      for (let i = 0; i < path.length; i++) {
        folderPaths.push(path.slice(0, i + 1).join('/'));
      }
      
      setExpandedFolders((prev) => {
        const newSet = new Set(prev);
        folderPaths.forEach(p => newSet.add(p));
        return newSet;
      });
      
      return true;
    }
    
    if (tree.children) {
      for (const child of tree.children) {
        if (findAndSelectFileTreeItem(child, itemName, [...path, tree.name])) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Handle expanding/collapsing folders
  const toggleFolder = (folderPath) => {
    setExpandedFolders((prev) => {
      const newExpandedFolders = new Set(prev);
      if (newExpandedFolders.has(folderPath)) {
        newExpandedFolders.delete(folderPath);
      } else {
        newExpandedFolders.add(folderPath);
      }
      return newExpandedFolders;
    });
  };
  
  // Handle item selection in file tree
  const selectItem = (item, itemPath) => {
    setSelectedItem(itemPath);
    
    // Highlight the corresponding node
    if (item.type === 'file' || item.type === 'folder') {
      highlightNodeByLabel(item.name);
    }
  };
  
  // Highlight node by label
  const highlightNodeByLabel = (label) => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          borderColor: n.data.label === label ? 'hsl(var(--primary))' : undefined,
          boxShadow: n.data.label === label ? '0 0 0 2px hsla(var(--primary)/0.2)' : undefined,
        },
      }))
    );
    
    // Find the node to center view on it
    const nodeToFocus = nodes.find(n => n.data.label === label);
    if (nodeToFocus && reactFlowInstance.current) {
      reactFlowInstance.current.setCenter(
        nodeToFocus.position.x + 75, 
        nodeToFocus.position.y + 50, 
        { duration: 800 }
      );
    }
  };
  
  // Handle edge creation
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 1.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }, eds));
  }, [setEdges]);
  
  // Function to center the graph
  const centerGraph = () => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.fitView({ padding: 0.2, duration: 800 });
      toast.success('Graph centered');
    }
  };
  
  // Function to export dependencies as CSV
  const exportDependencies = () => {
    if (!edges.length) {
      toast.error('No dependencies to export');
      return;
    }
    
    // Create CSV content
    let csv = 'Source,Target,Type\n';
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source)?.data.label || edge.source;
      const target = nodes.find(n => n.id === edge.target)?.data.label || edge.target;
      const type = edge.label || 'depends on';
      
      csv += `"${source}","${target}","${type}"\n`;
    });
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'dependencies.csv');
    
    toast.success('Dependencies exported successfully');
  };
  
  // Function to apply visual settings
  const applySettings = (settings) => {
    const { nodeSize, nodePadding, edgeStyle, colorScheme } = settings;
    
    setNodeSize(nodeSize);
    setNodePadding(nodePadding);
    setEdgeStyle(edgeStyle);
    setNodeColorScheme(colorScheme);
    
    // Apply settings to nodes
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          width: nodeSize,
          padding: nodePadding,
          // Apply color scheme
          backgroundColor: getNodeColorByScheme(n.data.type, colorScheme),
        },
      }))
    );
    
    // Apply settings to edges
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        // Apply edge style
        type: edgeStyle === 'bezier' ? 'default' : edgeStyle,
        animated: edgeStyle === 'animated',
      }))
    );
    
    toast.success('Settings applied');
    setIsSettingsOpen(false);
  };
  
  // Get node color based on scheme and node type
  const getNodeColorByScheme = (type, scheme) => {
    if (scheme === 'default') return undefined;
    
    const schemes = {
      vibrant: {
        file: 'hsla(210, 100%, 97%, 1)',
        folder: 'hsla(211, 100%, 95%, 1)'
      },
      pastel: {
        file: 'hsla(180, 60%, 97%, 1)',
        folder: 'hsla(210, 60%, 95%, 1)'
      },
      monochrome: {
        file: 'hsla(220, 10%, 98%, 1)',
        folder: 'hsla(220, 10%, 95%, 1)'
      }
    };
    
    return schemes[scheme][type] || undefined;
  };
  
  // Toggle search mode
  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchTerm('');
    }
  };
  
  // Filter file tree based on search term
  const filterFileTree = (tree, term) => {
    if (!tree) return null;
    if (!term) return tree;
    
    // Check if current node matches
    const matches = tree.name.toLowerCase().includes(term.toLowerCase());
    
    // For files, just check if it matches
    if (tree.type === 'file') {
      return matches ? tree : null;
    }
    
    // For folders, also check children
    if (tree.children) {
      const filteredChildren = tree.children
        .map(child => filterFileTree(child, term))
        .filter(Boolean);
      
      if (matches || filteredChildren.length > 0) {
        return {
          ...tree,
          children: filteredChildren
        };
      }
    }
    
    return null;
  };
  
  // Get the filtered tree
  const filteredTree = searchTerm ? filterFileTree(fileTree, searchTerm) : fileTree;
  
  // Recursive component to render file tree
  const FileTreeItem = ({ item, path = [], level = 0 }) => {
    const itemPath = [...path, item.name].join('/');
    const isFolder = item.type === 'folder';
    const isExpanded = expandedFolders.has(itemPath);
    const isSelected = selectedItem === itemPath;
    
    return (
      <div className="file-tree-item" style={{ marginLeft: `${level * 16}px` }}>
        <div 
          className={`flex items-center py-1 px-2 rounded cursor-pointer ${isSelected ? 'selected' : ''}`}
          onClick={() => isFolder ? toggleFolder(itemPath) : selectItem(item, itemPath)}
          onDoubleClick={() => isFolder && selectItem(item, itemPath)}
        >
          {isFolder && (
            <span className="mr-1">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
          <span className="mr-2">
            {isFolder ? (
              isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />
            ) : (
              <File size={16} />
            )}
          </span>
          <span className="text-sm truncate">{item.name}</span>
        </div>
        
        {isFolder && isExpanded && item.children && (
          <div className="pl-2">
            {item.children.map((child, i) => (
              <FileTreeItem 
                key={`${child.name}-${i}`}
                item={child}
                path={[...path, item.name]}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Settings panel component
  const SettingsPanel = () => {
    const [settings, setSettings] = useState({
      nodeSize,
      nodePadding,
      edgeStyle,
      colorScheme: nodeColorScheme
    });
    
    return (
      <div className="glass-panel rounded-lg p-4 w-80 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Visual Settings</h3>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => setIsSettingsOpen(false)}
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Node Size</label>
            <input
              type="range"
              min="100"
              max="300"
              value={settings.nodeSize}
              onChange={(e) => setSettings({...settings, nodeSize: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Node Padding</label>
            <input
              type="range"
              min="10"
              max="30"
              value={settings.nodePadding}
              onChange={(e) => setSettings({...settings, nodePadding: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Compact</span>
              <span>Spacious</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-2">Edge Style</label>
            <div className="grid grid-cols-3 gap-2">
              {['default', 'step', 'smoothstep', 'straight', 'bezier', 'animated'].map(style => (
                <button
                  key={style}
                  className={`text-xs py-1 px-2 rounded border ${
                    settings.edgeStyle === style 
                      ? 'bg-primary text-white border-primary' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSettings({...settings, edgeStyle: style})}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-2">Color Scheme</label>
            <div className="grid grid-cols-2 gap-2">
              {['default', 'vibrant', 'pastel', 'monochrome'].map(scheme => (
                <button
                  key={scheme}
                  className={`text-xs py-1 px-2 rounded border ${
                    settings.colorScheme === scheme 
                      ? 'bg-primary text-white border-primary' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSettings({...settings, colorScheme: scheme})}
                >
                  {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <button
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
            onClick={() => applySettings(settings)}
          >
            Apply Changes
          </button>
        </div>
      </div>
    );
  };
  
  // Function to handle sample data generation for demo purposes
  const loadSampleData = async () => {
    setIsLoading(true);
    toast.info('Loading sample codebase...');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a more complex sample tree
      const sampleTree = createSampleCodebase();
      
      setRootPath(sampleTree.name);
      setFileTree(sampleTree);
      
      // Generate initial graph
      generateDependencyGraph(sampleTree);
      
      toast.success('Sample codebase loaded successfully!');
    } catch (error) {
      console.error('Error loading sample data:', error);
      toast.error('Failed to load sample data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a realistic sample codebase structure
  const createSampleCodebase = () => {
    return {
      name: 'my-react-app',
      type: 'folder',
      children: [
        {
          name: 'node_modules',
          type: 'folder',
          children: [
            { name: 'react', type: 'folder', children: [
              { name: 'package.json', type: 'file', size: 2540 },
              { name: 'index.js', type: 'file', size: 12400 }
            ]},
            { name: 'typescript', type: 'folder', children: [
              { name: 'package.json', type: 'file', size: 3210 },
              { name: 'bin', type: 'folder', children: [
                { name: 'tsc', type: 'file', size: 1450 }
              ]}
            ]}
          ]
        },
        {
          name: 'src',
          type: 'folder',
          children: [
            { name: 'index.js', type: 'file', size: 320 },
            { name: 'App.js', type: 'file', size: 2100 },
            { name: 'App.css', type: 'file', size: 1230 },
            { 
              name: 'components', 
              type: 'folder', 
              children: [
                { name: 'Header.js', type: 'file', size: 1820 },
                { name: 'Footer.js', type: 'file', size: 940 },
                { name: 'Sidebar.js', type: 'file', size: 2670 },
                { name: 'Button.js', type: 'file', size: 1050 }
              ]
            },
            { 
              name: 'pages', 
              type: 'folder', 
              children: [
                { name: 'Home.js', type: 'file', size: 3240 },
                { name: 'About.js', type: 'file', size: 1890 },
                { name: 'Contact.js', type: 'file', size: 2340 }
              ]
            },
            { 
              name: 'utils', 
              type: 'folder', 
              children: [
                { name: 'api.js', type: 'file', size: 2140 },
                { name: 'helpers.js', type: 'file', size: 3060 },
                { name: 'constants.js', type: 'file', size: 890 }
              ]
            },
            { 
              name: 'styles', 
              type: 'folder', 
              children: [
                { name: 'variables.css', type: 'file', size: 540 },
                { name: 'global.css', type: 'file', size: 2950 },
                { name: 'components.css', type: 'file', size: 3840 }
              ]
            },
            { 
              name: 'hooks', 
              type: 'folder', 
              children: [
                { name: 'useAuth.js', type: 'file', size: 1870 },
                { name: 'useForm.js', type: 'file', size: 2450 },
                { name: 'useLocalStorage.js', type: 'file', size: 920 }
              ]
            },
            { 
              name: 'contexts', 
              type: 'folder', 
              children: [
                { name: 'AuthContext.js', type: 'file', size: 1640 },
                { name: 'ThemeContext.js', type: 'file', size: 980 }
              ]
            }
          ]
        },
        {
          name: 'public',
          type: 'folder',
          children: [
            { name: 'index.html', type: 'file', size: 830 },
            { name: 'favicon.ico', type: 'file', size: 4502 },
            { name: 'logo.png', type: 'file', size: 12400 },
            { 
              name: 'images', 
              type: 'folder', 
              children: [
                { name: 'banner.jpg', type: 'file', size: 85420 },
                { name: 'profile.png', type: 'file', size: 32150 }
              ]
            }
          ]
        },
        { name: 'package.json', type: 'file', size: 2340 },
        { name: 'README.md', type: 'file', size: 4210 },
        { name: '.gitignore', type: 'file', size: 430 },
        { name: 'tsconfig.json', type: 'file', size: 1980 }
      ]
    };
  };
  
  // Custom node renderer
  const nodeTypes = {
    customNode: ({ data }) => (
      <div>
        <div className="node-header">
          {data.type === 'file' ? <File size={14} /> : <Folder size={14} />}
          <span>{data.label}</span>
        </div>
        <div className="node-type">{data.type}</div>
        {data.size && <div className="text-xs mt-1">{formatBytes(data.size)}</div>}
      </div>
    ),
  };
  
  // Format bytes to human readable format
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Initialize ReactFlow
  const onInit = (instance) => {
    reactFlowInstance.current = instance;
  };
  
  useEffect(() => {
    // Load sample data on initial mount for demo purposes
    // In a real app, this would be commented out
    loadSampleData();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border py-3 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Layers className="text-primary mr-2" size={20} />
            <h1 className="text-lg font-medium">Codebase Visualizer</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              className="text-sm py-1 px-3 border border-border rounded-full hover:bg-secondary transition-colors flex items-center"
              onClick={loadSampleData}
              disabled={isLoading}
            >
              <Zap size={14} className="mr-1" />
              {isLoading ? 'Loading...' : 'Load Sample'}
            </button>
            
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFolderSelect}
                className="hidden"
                multiple
              />
              <button
                className="text-sm py-1 px-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors flex items-center"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload size={14} className="mr-1" />
                Select Folder
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-grow flex">
        {/* File tree sidebar */}
        <div className="w-80 border-r border-border bg-card flex flex-col overflow-hidden">
          {/* File tree header */}
          <div className="p-4 border-b border-border">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium">Project Structure</h2>
              <button
                className="p-1.5 rounded-full hover:bg-secondary transition-colors"
                onClick={toggleSearch}
              >
                <Search size={16} />
              </button>
            </div>
            
            {isSearching && (
              <div className="relative animate-fade-in">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-1.5 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {searchTerm && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm('')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* File tree content */}
          <div className="flex-grow overflow-y-auto p-2 file-tree">
            {filteredTree ? (
              <FileTreeItem item={filteredTree} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No files to display</p>
                <p className="text-xs mt-1">Select a folder to visualize</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Graph visualization */}
        <div className="flex-grow relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onInit={onInit}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={12}
              size={1}
              color="hsl(var(--border))"
            />
            <Controls className="bg-background border border-border rounded-md shadow-sm" />
            <MiniMap
              className="bg-card border border-border rounded-md shadow-sm"
              maskColor="rgba(240, 240, 240, 0.5)"
              nodeColor={(node) => {
                if (node.data?.type === 'file') return 'hsl(var(--primary) / 0.3)';
                return 'hsl(var(--muted) / 0.3)';
              }}
            />
            
            <Panel position="top-right" className="space-x-2">
              <button
                className="p-2 bg-background text-foreground border border-border rounded-md hover:bg-secondary transition-colors"
                onClick={centerGraph}
                title="Center Graph"
              >
                <RefreshCw size={16} />
              </button>
              <button
                className="p-2 bg-background text-foreground border border-border rounded-md hover:bg-secondary transition-colors"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                title="Visualization Settings"
              >
                <Settings size={16} />
              </button>
              <button
                className="p-2 bg-background text-foreground border border-border rounded-md hover:bg-secondary transition-colors"
                onClick={exportDependencies}
                title="Export Dependencies"
              >
                <Download size={16} />
              </button>
            </Panel>
            
            {isSettingsOpen && (
              <Panel position="top-center">
                <SettingsPanel />
              </Panel>
            )}
          </ReactFlow>
          
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center p-6 rounded-lg">
                <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto mb-4"></div>
                <p className="font-medium">Processing...</p>
                <p className="text-sm text-muted-foreground mt-1">Analyzing codebase structure</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

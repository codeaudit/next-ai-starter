"use client";

import React, { useState, useEffect, useRef } from "react";

export interface Pattern {
  id: string;
  label: string;
  connectedTo: string[];
}

export interface PatternWebProps {
  patterns: Pattern[];
  onNodeClick?: (patternId: string) => void;
}

export const PatternWeb: React.FC<PatternWebProps> = ({
  patterns,
  onNodeClick,
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<{source: string, target: string} | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Record<string, { x: number; y: number; el: HTMLDivElement | null }>>({});

  // Create nodes positioned in a circle
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    
    const angleStep = (2 * Math.PI) / patterns.length;
    
    const newNodes: Record<string, { x: number; y: number; el: HTMLDivElement | null }> = {};
    
    patterns.forEach((pattern, index) => {
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      newNodes[pattern.id] = { x, y, el: null };
    });
    
    setNodes(newNodes);
  }, [patterns, canvasRef]);

  const handleNodeClick = (patternId: string) => {
    setSelectedNode(patternId);
    onNodeClick?.(patternId);
  };

  // Draw lines between connected nodes
  const renderConnections = () => {
    const connections: React.JSX.Element[] = [];
    
    patterns.forEach(pattern => {
      const sourceNode = nodes[pattern.id];
      if (!sourceNode) return;
      
      pattern.connectedTo.forEach(targetId => {
        const targetNode = nodes[targetId];
        if (!targetNode) return;
        
        const isHighlighted = 
          hoveredNode === pattern.id || 
          hoveredNode === targetId || 
          selectedNode === pattern.id || 
          selectedNode === targetId ||
          (hoveredEdge?.source === pattern.id && hoveredEdge?.target === targetId);
        
        // Calculate the edge path with a slight curve
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate curve control point
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        const curveOffset = distance / 5;
        
        // Perpendicular vector for curve
        const perpX = -dy / distance * curveOffset;
        const perpY = dx / distance * curveOffset;
        
        // Control point with offset
        const ctrlX = midX + perpX;
        const ctrlY = midY + perpY;
        
        // Edge path data for the bezier curve
        const path = `M ${sourceNode.x} ${sourceNode.y} Q ${ctrlX} ${ctrlY} ${targetNode.x} ${targetNode.y}`;
        
        connections.push(
          <svg 
            key={`${pattern.id}-${targetId}`}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <path
              d={path}
              stroke={isHighlighted ? "#3b82f6" : "#d1d5db"}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeOpacity={isHighlighted ? 0.8 : 0.5}
              fill="none"
              className="transition-all duration-300"
            />
            
            {/* Interactive hit area for the edge */}
            <path
              d={path}
              stroke="transparent" 
              strokeWidth={20}
              fill="none"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredEdge({ source: pattern.id, target: targetId })}
              onMouseLeave={() => setHoveredEdge(null)}
            />
            
            {/* Direction arrow */}
            <polygon
              points="0,-4 8,0 0,4"
              fill={isHighlighted ? "#3b82f6" : "#d1d5db"}
              opacity={isHighlighted ? 0.8 : 0.5}
              className="transition-all duration-300"
              transform={`translate(${targetNode.x - dx/8}, ${targetNode.y - dy/8}) rotate(${Math.atan2(dy, dx) * 180 / Math.PI})`}
            />
          </svg>
        );
      });
    });
    
    return connections;
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-white dark:bg-neutral-900 rounded-lg">
      <div ref={canvasRef} className="w-full h-full relative">
        {renderConnections()}
        
        {patterns.map(pattern => {
          const node = nodes[pattern.id];
          if (!node) return null;
          
          const isSelected = selectedNode === pattern.id;
          const isHovered = hoveredNode === pattern.id;
          const isConnectedToHoveredEdge = 
            hoveredEdge?.source === pattern.id || 
            hoveredEdge?.target === pattern.id;
          
          return (
            <div
              key={pattern.id}
              ref={el => {
                if (el) {
                  setNodes(prev => ({
                    ...prev,
                    [pattern.id]: { ...prev[pattern.id], el }
                  }));
                }
              }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 dark:border-blue-400 shadow-md"
                  : isHovered || isConnectedToHoveredEdge
                  ? "bg-neutral-100 dark:bg-neutral-800 border border-blue-300 dark:border-blue-700"
                  : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
              style={{
                left: node.x,
                top: node.y,
                zIndex: isSelected || isHovered ? 2 : 1,
              }}
              onClick={() => handleNodeClick(pattern.id)}
              onMouseEnter={() => setHoveredNode(pattern.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <span className="text-sm font-medium text-neutral-800 dark:text-white">
                {pattern.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatternWeb; 
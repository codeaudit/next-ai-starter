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
          selectedNode === targetId;
        
        connections.push(
          <svg 
            key={`${pattern.id}-${targetId}`}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <line
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={isHighlighted ? "#3b82f6" : "#d1d5db"}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeOpacity={isHighlighted ? 0.8 : 0.5}
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
                  : isHovered
                  ? "bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
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
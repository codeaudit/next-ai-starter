"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Edit, Eye, Save, Clock, GitBranch, Check } from "lucide-react";

export interface DocumentEditorProps {
  documentContent: string;
  editMode: boolean;
  onToggleEditMode?: () => void;
  onContentChange?: (content: string) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  documentContent,
  editMode,
  onToggleEditMode,
  onContentChange,
}) => {
  const [content, setContent] = useState(documentContent);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setUnsavedChanges(true);
  };

  const handleSaveContent = () => {
    onContentChange?.(content);
    setUnsavedChanges(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-neutral-900 rounded-lg overflow-hidden">
      {/* Editor toolbar */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-neutral-800 dark:text-white">Document</h2>
        </div>
        <div className="flex items-center gap-2">
          {editMode && unsavedChanges && (
            <button
              onClick={handleSaveContent}
              className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          )}
          <button
            onClick={onToggleEditMode}
            className="flex items-center gap-1 px-3 py-1 text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
          >
            {editMode ? (
              <>
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-auto">
        {editMode ? (
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-full p-4 font-mono text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 border-none resize-none focus:ring-0 focus:outline-none"
            placeholder="Start writing here..."
          />
        ) : (
          <div className="w-full h-full p-6 prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none overflow-auto">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export interface Version {
  id: string;
  label: string;
  date: string;
  parentId?: string;
}

export interface VersionTimelineProps {
  versions: Version[];
  selectedVersion?: string;
  onSelectVersion?: (versionId: string) => void;
}

export const VersionTimeline: React.FC<VersionTimelineProps> = ({
  versions,
  selectedVersion,
  onSelectVersion,
}) => {
  const [hoveredVersion, setHoveredVersion] = useState<string | null>(null);

  // Group versions by parent to show branching
  const versionsByParent: Record<string, Version[]> = versions.reduce((acc, version) => {
    const parentId = version.parentId || 'root';
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(version);
    return acc;
  }, {} as Record<string, Version[]>);

  // Determine if a version has branches (children)
  const hasBranches = (versionId: string): boolean => {
    return !!versionsByParent[versionId] && versionsByParent[versionId].length > 0;
  };

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800 py-2">
      <div className="px-4 py-1 flex justify-between items-center">
        <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Version History</span>
        </div>
      </div>
      
      <div className="relative px-4 py-2 overflow-x-auto">
        <div className="flex items-start min-w-max">
          {/* Main timeline */}
          <div className="flex items-center">
            {/* Root versions (no parent) */}
            {(versionsByParent['root'] || []).map((version, index, array) => (
              <React.Fragment key={version.id}>
                <VersionNode 
                  version={version}
                  isSelected={selectedVersion === version.id}
                  isHovered={hoveredVersion === version.id}
                  hasBranches={hasBranches(version.id)}
                  onSelect={() => onSelectVersion?.(version.id)}
                  onHover={(hovered) => setHoveredVersion(hovered ? version.id : null)}
                />
                
                {/* Connection line */}
                {index < array.length - 1 && (
                  <div className="h-0.5 w-12 bg-neutral-200 dark:bg-neutral-700" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Branches section */}
          {versions.filter(v => v.parentId).length > 0 && (
            <div className="ml-2 mt-4 flex flex-col space-y-2">
              {Object.entries(versionsByParent)
                .filter(([parentId]) => parentId !== 'root')
                .map(([parentId, childVersions]) => (
                  <div key={parentId} className="flex items-center group">
                    <div className="flex items-center">
                      <div className="h-6 border-l border-t rounded-tl-md border-neutral-200 dark:border-neutral-700 w-4" />
                      
                      {/* Branch versions */}
                      {childVersions.map((version, index, array) => (
                        <React.Fragment key={version.id}>
                          <VersionNode 
                            version={version}
                            isSelected={selectedVersion === version.id}
                            isHovered={hoveredVersion === version.id}
                            hasBranches={hasBranches(version.id)}
                            isBranch={true}
                            onSelect={() => onSelectVersion?.(version.id)}
                            onHover={(hovered) => setHoveredVersion(hovered ? version.id : null)}
                          />
                          
                          {/* Connection line between branch versions */}
                          {index < array.length - 1 && (
                            <div className="h-0.5 w-8 bg-neutral-200 dark:bg-neutral-700" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface VersionNodeProps {
  version: Version;
  isSelected: boolean;
  isHovered: boolean;
  hasBranches: boolean;
  isBranch?: boolean;
  onSelect: () => void;
  onHover: (isHovered: boolean) => void;
}

const VersionNode: React.FC<VersionNodeProps> = ({
  version,
  isSelected,
  isHovered,
  hasBranches,
  isBranch = false,
  onSelect,
  onHover,
}) => {
  const formattedDate = new Date(version.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <div 
      className={`relative group cursor-pointer ${isSelected || isHovered ? 'z-10' : ''}`}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div 
        className={`
          h-6 px-3 py-1 rounded-md flex items-center border
          ${isSelected 
            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : isHovered 
              ? 'border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800' 
              : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
          }
          transition-colors whitespace-nowrap
        `}
      >
        <span className="text-xs font-medium text-neutral-800 dark:text-white mr-1">
          {version.label}
        </span>
        
        {hasBranches && (
          <GitBranch className="h-3 w-3 text-neutral-500 dark:text-neutral-400 ml-1" />
        )}
        
        {isSelected && (
          <Check className="h-3 w-3 text-blue-500 dark:text-blue-400 ml-1" />
        )}
      </div>
      
      {/* Tooltip with date on hover */}
      <div 
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-neutral-800 text-white text-xs transition-opacity ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {formattedDate}
      </div>
    </div>
  );
};

export interface CenterPanelProps {
  documentContent: string;
  editMode: boolean;
  versions?: Version[];
  selectedVersion?: string;
  onToggleEditMode?: () => void;
  onContentChange?: (content: string) => void;
  onSelectVersion?: (versionId: string) => void;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({
  documentContent,
  editMode,
  versions = [],
  selectedVersion,
  onToggleEditMode,
  onContentChange,
  onSelectVersion,
}) => {
  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-hidden">
        <DocumentEditor
          documentContent={documentContent}
          editMode={editMode}
          onToggleEditMode={onToggleEditMode}
          onContentChange={onContentChange}
        />
      </div>
      
      {versions.length > 0 && (
        <VersionTimeline
          versions={versions}
          selectedVersion={selectedVersion}
          onSelectVersion={onSelectVersion}
        />
      )}
    </div>
  );
};

export default CenterPanel; 
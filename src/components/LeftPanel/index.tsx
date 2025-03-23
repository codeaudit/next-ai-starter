"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, File, Folder, LayoutGrid, FileText, PanelBottomClose, PanelBottom, Copy, X } from "lucide-react";

export interface Document {
  id: number | string;
  title: string;
  folder: string;
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
}

export type ViewMode = "docs" | "patternWeb";

export interface LeftPanelProps {
  workspaces: string[];
  currentWorkspace: string;
  documents: Document[];
  snippets?: Snippet[];
  viewMode?: ViewMode;
  onSelectWorkspace?: (workspace: string) => void;
  onSelectDoc?: (docId: number | string) => void;
  onToggleViewMode?: (mode: ViewMode) => void;
  onSnippetSelect?: (snippetId: string) => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  workspaces,
  currentWorkspace,
  documents,
  snippets = [],
  viewMode = "docs",
  onSelectWorkspace,
  onSelectDoc,
  onToggleViewMode,
  onSnippetSelect,
}) => {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    Main: true, // Default expanded
  });
  const [isSnippetsOpen, setIsSnippetsOpen] = useState(false);

  // Group documents by folder
  const documentsByFolder = documents.reduce((acc, doc) => {
    if (!acc[doc.folder]) {
      acc[doc.folder] = [];
    }
    acc[doc.folder].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const handleWorkspaceChange = (workspace: string) => {
    onSelectWorkspace?.(workspace);
    setIsWorkspaceOpen(false);
  };

  const handleViewModeToggle = (mode: ViewMode) => {
    onToggleViewMode?.(mode);
  };

  const toggleSnippets = () => {
    setIsSnippetsOpen(!isSnippetsOpen);
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
      {/* Workspace Selector */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="relative">
          <button
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          >
            <span>{currentWorkspace}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>

          {isWorkspaceOpen && (
            <div className="absolute left-0 mt-2 w-full bg-white dark:bg-neutral-800 shadow-md rounded-md z-10 border border-neutral-200 dark:border-neutral-700">
              <ul className="py-1">
                {workspaces.map((workspace) => (
                  <li key={workspace}>
                    <button
                      className={`w-full text-left px-3 py-2 text-sm ${
                        workspace === currentWorkspace
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      }`}
                      onClick={() => handleWorkspaceChange(workspace)}
                    >
                      {workspace}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <button
          className={`flex-1 flex justify-center items-center py-2 text-sm ${
            viewMode === "docs"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
          onClick={() => handleViewModeToggle("docs")}
        >
          <FileText className="h-4 w-4 mr-1" />
          <span>Documents</span>
        </button>
        <button
          className={`flex-1 flex justify-center items-center py-2 text-sm ${
            viewMode === "patternWeb"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
          onClick={() => handleViewModeToggle("patternWeb")}
        >
          <LayoutGrid className="h-4 w-4 mr-1" />
          <span>Pattern Web</span>
        </button>
      </div>

      {/* Content based on viewMode */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {viewMode === "docs" ? (
          // Document List
          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-2 mb-2">
              Documents
            </div>
            
            {Object.entries(documentsByFolder).map(([folderName, docs]) => (
              <div key={folderName} className="mb-1">
                <button 
                  className="flex items-center w-full px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm text-neutral-700 dark:text-neutral-300"
                  onClick={() => toggleFolder(folderName)}
                >
                  {expandedFolders[folderName] ? (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1" />
                  )}
                  <Folder className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400" />
                  <span>{folderName}</span>
                </button>
                
                {expandedFolders[folderName] && (
                  <ul className="pl-9 mt-1">
                    {docs.map((doc) => (
                      <li key={doc.id}>
                        <button
                          className="flex items-center w-full px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm text-neutral-600 dark:text-neutral-400"
                          onClick={() => onSelectDoc?.(doc.id)}
                        >
                          <File className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400" />
                          <span>{doc.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Pattern Web Placeholder
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="text-neutral-500 dark:text-neutral-400">
              <LayoutGrid className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Pattern Web View</p>
              <p className="text-xs mt-2">Select this mode to visualize connections between patterns</p>
            </div>
          </div>
        )}

        {/* Snippets Panel - Always visible regardless of view mode */}
        <div className="border-t border-neutral-200 dark:border-neutral-800">
          <button 
            className="flex items-center justify-between w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={toggleSnippets}
          >
            <div className="flex items-center">
              {isSnippetsOpen ? <PanelBottomClose className="h-4 w-4 mr-2" /> : <PanelBottom className="h-4 w-4 mr-2" />}
              <span>Snippets</span>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{snippets.length}</span>
          </button>
          
          {isSnippetsOpen && (
            <div className="p-2 max-h-60 overflow-y-auto">
              {snippets.length > 0 ? (
                <ul className="space-y-1">
                  {snippets.map((snippet) => (
                    <li key={snippet.id}>
                      <button
                        className="flex items-center justify-between w-full px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        onClick={() => onSnippetSelect?.(snippet.id)}
                      >
                        <span className="truncate">{snippet.title}</span>
                        <Copy className="h-3.5 w-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-sm text-neutral-500 dark:text-neutral-400">
                  <p>No snippets available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel; 
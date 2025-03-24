"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Edit, Eye, Save } from "lucide-react";

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

export interface CenterPanelProps {
  documentContent: string;
  editMode: boolean;
  onToggleEditMode?: () => void;
  onContentChange?: (content: string) => void;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({
  documentContent,
  editMode,
  onToggleEditMode,
  onContentChange,
}) => {
  return (
    <div className="flex-1 h-full overflow-hidden">
      <DocumentEditor
        documentContent={documentContent}
        editMode={editMode}
        onToggleEditMode={onToggleEditMode}
        onContentChange={onContentChange}
      />
    </div>
  );
};

export default CenterPanel; 
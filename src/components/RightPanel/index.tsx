"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Plus, X } from "lucide-react";

export interface Message {
  role: "user" | "ai";
  text: string;
}

export interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage?: (text: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() && onSendMessage) {
      onSendMessage(inputText.trim());
      setInputText("");
      // Focus the input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800">
        <h2 className="text-lg font-medium text-neutral-800 dark:text-white">Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 dark:text-neutral-400 text-center p-6">
            <Bot className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start a conversation by typing a message below.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`
                  max-w-[80%] rounded-lg px-4 py-2 
                  ${message.role === "user" 
                    ? "bg-blue-500 text-white" 
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "user" ? (
                    <>
                      <span className="font-medium text-xs">You</span>
                      <User className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <Bot className="h-3 w-3" />
                      <span className="font-medium text-xs">AI</span>
                    </>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full p-3 pr-10 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 min-h-[80px] max-h-[160px] resize-none"
              rows={3}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export interface ConversationTab {
  id: string;
  label: string;
  messages: Message[];
}

export interface TabbedConversationsProps {
  tabs: ConversationTab[];
  activeTabId: string;
  onSwitchTab: (tabId: string) => void;
  onSendMessage: (text: string, tabId: string) => void;
  onAddTab?: () => void;
  onCloseTab?: (tabId: string) => void;
}

export const TabbedConversations: React.FC<TabbedConversationsProps> = ({
  tabs,
  activeTabId,
  onSwitchTab,
  onSendMessage,
  onAddTab,
  onCloseTab,
}) => {
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];
  
  const handleSendMessage = (text: string) => {
    onSendMessage(text, activeTabId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs Header */}
      <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 overflow-x-auto">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`
              flex items-center gap-1 px-3 py-2 border-r border-neutral-200 dark:border-neutral-800 cursor-pointer whitespace-nowrap
              ${activeTabId === tab.id 
                ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-neutral-900 border-b-2 border-blue-500 dark:border-blue-400' 
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }
            `}
            onClick={() => onSwitchTab(tab.id)}
          >
            <span className="text-sm font-medium">{tab.label}</span>
            {tabs.length > 1 && onCloseTab && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
                aria-label={`Close ${tab.label} tab`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        
        {onAddTab && (
          <button
            onClick={onAddTab}
            className="flex items-center gap-1 px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            aria-label="Add new conversation tab"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Active Tab Content */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface 
          messages={activeTab.messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export interface RightPanelProps {
  messages?: Message[];
  tabs?: ConversationTab[];
  activeTabId?: string;
  useTabs?: boolean;
  onSendMessage?: (text: string) => void;
  onTabSendMessage?: (text: string, tabId: string) => void;
  onSwitchTab?: (tabId: string) => void;
  onAddTab?: () => void;
  onCloseTab?: (tabId: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  messages = [],
  tabs = [],
  activeTabId = "",
  useTabs = false,
  onSendMessage,
  onTabSendMessage,
  onSwitchTab,
  onAddTab,
  onCloseTab,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        {useTabs && tabs.length > 0 ? (
          <TabbedConversations 
            tabs={tabs}
            activeTabId={activeTabId || tabs[0].id}
            onSwitchTab={onSwitchTab || (() => {})}
            onSendMessage={onTabSendMessage || (() => {})}
            onAddTab={onAddTab}
            onCloseTab={onCloseTab}
          />
        ) : (
          <ChatInterface 
            messages={messages} 
            onSendMessage={onSendMessage} 
          />
        )}
      </div>
    </div>
  );
};

export default RightPanel; 
"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PromptList from "@/components/PromptList";
import ConversationsList from "@/components/ConversationsList";
import MessagesList from "@/components/MessagesList";
import { ConversationBase } from "@/lib/api/conversations";

export default function Home() {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationBase | null>(null);

  const handleConversationSelect = (conversation: ConversationBase) => {
    setSelectedConversation(conversation);
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar>
        <ConversationsList onConversationSelect={handleConversationSelect} />
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Career Advisor
              </h1>
              <p className="text-gray-600">
                Get personalized career advice and guidance
              </p>
            </div>
            {selectedConversation && (
              <MessagesList conversationId={selectedConversation.id} />
            )}
            <PromptList />
          </div>
        </div>
      </div>
    </div>
  );
}

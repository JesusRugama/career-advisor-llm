"use client";

import { useEffect, useState } from "react";
import {
  getConversationsApiUsersUserIdConversationsGet,
  ConversationBase,
} from "@/lib/api/conversations";
import ConversationsListItem from "./ConversationsListItem";
import { USER_ID } from "@/constants/user";

interface ConversationsListProps {
  onConversationSelect: (conversation: ConversationBase) => void;
}

export default function ConversationsList({
  onConversationSelect,
}: ConversationsListProps) {
  const [conversations, setConversations] = useState<ConversationBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await getConversationsApiUsersUserIdConversationsGet({
          path: { user_id: USER_ID },
        });

        if (response.data?.success && response.data.conversations) {
          setConversations(response.data.conversations);
        } else {
          setError("Failed to fetch conversations");
        }
      } catch (err) {
        setError("Error connecting to conversation service");
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Your Conversations</h2>
      {conversations.length === 0 ? (
        <p className="text-gray-600">
          No conversations yet. Start a new conversation to get career advice!
        </p>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <ConversationsListItem
              key={conversation.id}
              conversation={conversation}
              onConversationSelect={onConversationSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

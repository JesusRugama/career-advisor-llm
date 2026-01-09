"use client";

import { useEffect, useState } from "react";
import {
  MessageBase,
  getConversationMessagesApiUsersUserIdConversationsConversationIdMessagesGet,
} from "@/lib/api/conversations";
import MessagesListItem from "./MessagesListItem";
import MessageInput from "./MessageInput";
import { USER_ID } from "@/constants/user";

interface MessagesListProps {
  conversationId: string;
}

export default function MessagesList({ conversationId }: MessagesListProps) {
  const [messages, setMessages] = useState<MessageBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response =
          await getConversationMessagesApiUsersUserIdConversationsConversationIdMessagesGet(
            {
              path: {
                user_id: USER_ID,
                conversation_id: conversationId,
              },
            },
          );

        if (response.data?.success && response.data.messages) {
          setMessages(response.data.messages);
        } else {
          setError("Failed to fetch messages");
        }
      } catch (err) {
        setError("Error loading messages");
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId && USER_ID) {
      fetchMessages();
    }
  }, [conversationId]);

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
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessagesListItem key={message.id} message={message} />
          ))
        )}
      </div>

      <MessageInput conversationId={conversationId} />
    </div>
  );
}

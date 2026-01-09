import { useState } from "react";
import { createConversationMessageApiUsersUserIdConversationsConversationIdMessagePost } from "@/lib/api/conversations";
import { USER_ID } from "@/constants/user";

interface MessageInputProps {
  conversationId: string;
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const message = formData.get("message") as string;

    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response =
        await createConversationMessageApiUsersUserIdConversationsConversationIdMessagePost(
          {
            path: {
              user_id: USER_ID,
              conversation_id: conversationId,
            },
            body: {
              message: message.trim(),
            },
          },
        );

      if (response.data?.success) {
        form.reset();
      } else {
        setError("Failed to send message");
      }
    } catch (err) {
      setError("Error sending message");
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <input
          type="text"
          name="message"
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

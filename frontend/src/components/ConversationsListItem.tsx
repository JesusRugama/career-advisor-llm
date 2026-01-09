import { ConversationBase } from "@/lib/api/conversations";

interface ConversationsListItemProps {
  conversation: ConversationBase;
  onConversationSelect: (conversation: ConversationBase) => void;
}

export default function ConversationsListItem({
  conversation,
  onConversationSelect,
}: ConversationsListItemProps) {
  const handleConversationClick = () => {
    onConversationSelect(conversation);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-gray-300"
      onClick={handleConversationClick}
    >
      <div className="flex flex-col justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {conversation.title}
          </h3>
          <p className="text-sm text-gray-500">
            Created: {formatDate(conversation.created_at)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            ID: {conversation.id.slice(0, 8)}...
          </span>
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleConversationClick();
            }}
          >
            Open →
          </button>
        </div>
      </div>
    </div>
  );
}

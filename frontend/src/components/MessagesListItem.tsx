import { MessageBase } from "@/lib/api/conversations";

interface MessagesListItemProps {
  message: MessageBase;
}

export default function MessagesListItem({ message }: MessagesListItemProps) {
  const isHuman = message.is_human;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isHuman ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%] ${isHuman ? "order-2" : "order-1"}`}>
        {/* Avatar */}
        <div
          className={`flex items-start space-x-3 ${isHuman ? "flex-row-reverse space-x-reverse" : ""}`}
        >
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              isHuman ? "bg-blue-600 text-white" : "bg-gray-600 text-white"
            }`}
          >
            {isHuman ? "U" : "AI"}
          </div>

          {/* Message Content */}
          <div
            className={`flex flex-col ${isHuman ? "items-end" : "items-start"}`}
          >
            <div
              className={`px-4 py-3 rounded-2xl ${
                isHuman
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-900 rounded-bl-md"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>

            {/* Timestamp */}
            <span className="text-xs text-gray-500 mt-1 px-1">
              {formatTime(message.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

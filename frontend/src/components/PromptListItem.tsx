import { PromptBase } from "@/lib/api/types.gen";

interface PromptListItemProps {
  prompt: PromptBase;
}

export default function PromptListItem({ prompt }: PromptListItemProps) {
  const handlePromptClick = () => {
    // TODO: Navigate to conversation page or trigger prompt usage
    console.log("Selected prompt:", prompt);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handlePromptClick}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {prompt.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-3">{prompt.prompt_text}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          ID: {prompt.id}
        </span>
        <button
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            handlePromptClick();
          }}
        >
          Use Prompt →
        </button>
      </div>
    </div>
  );
}

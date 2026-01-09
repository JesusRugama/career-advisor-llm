"use client";

import { useEffect, useState } from "react";
import { getPromptsApiPromptsGet, PromptBase } from "@/lib/api/prompts";
import PromptListItem from "./PromptListItem";

export default function PromptList() {
  const [prompts, setPrompts] = useState<PromptBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        const response = await getPromptsApiPromptsGet();

        if (response.data?.success && response.data.prompts) {
          setPrompts(response.data.prompts);
        } else {
          setError("Failed to fetch prompts");
        }
      } catch (err) {
        setError("Error connecting to prompt service");
        console.error("Error fetching prompts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
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
      <h2 className="text-2xl font-bold text-gray-900">
        Career Advice Prompts
      </h2>
      {prompts.length === 0 ? (
        <p className="text-gray-600">No prompts available at the moment.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptListItem key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}

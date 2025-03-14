
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Hash, X } from "lucide-react";

interface HashtagInputProps {
  hashtags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

const HashtagInput = ({ hashtags, onAdd, onRemove }: HashtagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addHashtag();
    }
  };

  const addHashtag = () => {
    const tag = inputValue.trim().replace(/^#/, "");
    if (tag && !hashtags.includes(tag)) {
      onAdd(tag);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center border rounded-md overflow-hidden">
        <div className="px-3 py-2">
          <Hash size={18} className="text-gray-400" />
        </div>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addHashtag}
          placeholder="Add hashtags (press Enter or Space)"
          className="border-0 focus-visible:ring-0"
        />
      </div>
      
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {hashtags.map((tag) => (
            <div
              key={tag}
              className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
            >
              <span className="text-sm mr-1">#{tag}</span>
              <button
                onClick={() => onRemove(tag)}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HashtagInput;

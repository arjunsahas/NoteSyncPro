import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, X } from "lucide-react";
import { useState } from "react";

interface TagSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selected, onChange }: TagSelectorProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    if (!input.trim()) return;
    const newTags = [...selected, input.trim()];
    onChange(newTags);
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(selected.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-4">
      <h2 className="font-medium">Tags</h2>
      
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add tag..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <Button onClick={addTag} size="sm">
          <Tag className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {selected.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

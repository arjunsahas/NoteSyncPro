import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import SearchBar from "@/components/search-bar";
import NoteList from "@/components/note-list";
import TagSelector from "@/components/tag-selector";
import CalendarView from "@/components/calendar-view";
import { useState } from "react";
import { type SearchParams } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    tags: [],
  });

  const { data: notes, isLoading } = useQuery({
    queryKey: ["/api/notes/search", searchParams],
    queryFn: async () => {
      const res = await fetch("/api/notes/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchParams),
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif">Notes</h1>
          <Link href="/note/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </Link>
        </div>

        <div className="flex gap-4">
          <div className="w-64">
            <TagSelector
              selected={searchParams.tags || []}
              onChange={(tags) => setSearchParams({ ...searchParams, tags })}
            />
          </div>

          <div className="flex-1 space-y-4">
            <SearchBar
              value={searchParams.query || ""}
              onChange={(query) => setSearchParams({ ...searchParams, query })}
            />

            <Tabs defaultValue="list">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <NoteList notes={notes || []} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="calendar">
                <CalendarView notes={notes || []} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

import { type Note } from "@shared/schema";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag } from "lucide-react";
import { Link } from "wouter";

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
}

export default function NoteList({ notes, isLoading }: NoteListProps) {
  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No notes found
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Link key={note.id} href={`/note/${note.id}`}>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <h3 className="font-medium">{note.title}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {note.content}
              </p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              {note.startTime && (
                <Badge variant="secondary">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(note.startTime).toLocaleDateString()}
                </Badge>
              )}
              {note.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

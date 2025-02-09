import { Calendar } from "@/components/ui/calendar";
import { type Note } from "@shared/schema";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CalendarViewProps {
  notes: Note[];
  isLoading: boolean;
}

export default function CalendarView({ notes, isLoading }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDayNotes = notes.filter((note) => {
    if (!date || !note.startTime) return false;
    const noteDate = new Date(note.startTime);
    return (
      noteDate.getDate() === date.getDate() &&
      noteDate.getMonth() === date.getMonth() &&
      noteDate.getFullYear() === date.getFullYear()
    );
  });

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />

      <div className="space-y-4">
        <h3 className="font-medium">Notes for {date?.toLocaleDateString()}</h3>
        {selectedDayNotes.length === 0 ? (
          <p className="text-muted-foreground">No notes for this day</p>
        ) : (
          selectedDayNotes.map((note) => (
            <Card key={note.id}>
              <CardContent className="pt-6">
                <h4 className="font-medium">{note.title}</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {note.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

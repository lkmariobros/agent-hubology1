
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

// Mock note type
export interface TeamNote {
  id: number;
  author: {
    name: string;
    initials: string;
    avatarColor: string;
    avatar?: string | null;
  };
  date: string;
  content: string;
  action?: string;
}

interface TeamNotesProps {
  notes: TeamNote[];
  onAddNote?: (note: Omit<TeamNote, 'id' | 'date'>) => void;
  className?: string;
}

export const TeamNotes: React.FC<TeamNotesProps> = ({ 
  notes, 
  onAddNote,
  className = '' 
}) => {
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    if (onAddNote) {
      // In a real app, we would get the current user info from context/auth
      onAddNote({
        author: {
          name: "Current User",
          initials: "CU",
          avatarColor: "bg-blue-500"
        },
        content: newNote,
        action: "added a note"
      });
    }

    setNewNote('');
    setIsAddingNote(false);
    toast.success("Note added successfully");
  };

  return (
    <Card className={`overflow-hidden border-neutral-800 bg-card/90 backdrop-blur-sm h-full flex flex-col ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          Team Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow overflow-auto">
        {notes.length > 0 ? (
          <Timeline>
            {notes.map((note) => (
              <TimelineItem key={note.id} className="pb-5 last:pb-0">
                <TimelineHeader>
                  <TimelineSeparator className="left-3 h-full" />
                  <TimelineTitle className="font-medium text-sm">
                    {note.author.name}{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      {note.action || "commented"}
                    </span>
                  </TimelineTitle>
                  <TimelineIndicator className="left-0 top-0">
                    <Avatar className="h-6 w-6">
                      {note.author.avatar ? (
                        <AvatarImage src={note.author.avatar} alt={note.author.name} />
                      ) : (
                        <AvatarFallback className={note.author.avatarColor}>
                          {note.author.initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </TimelineIndicator>
                </TimelineHeader>
                <TimelineContent className="mt-2 ml-9">
                  <div className="rounded-lg border border-neutral-800 bg-black/20 px-4 py-3 text-sm">
                    {note.content}
                    <TimelineDate>{note.date}</TimelineDate>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No team notes yet
          </div>
        )}
        
        {isAddingNote ? (
          <div className="mt-4 space-y-3">
            <Textarea
              placeholder="Type your note here..."
              className="min-h-[100px] bg-black/20 border-neutral-800"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote('');
                }}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleAddNote}
              >
                Add Note
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => setIsAddingNote(true)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

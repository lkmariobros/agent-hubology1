
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
  action?: string; // Keeping this for backward compatibility
}

interface TeamNotesProps {
  notes: TeamNote[];
  onAddNote?: (note: Omit<TeamNote, 'id' | 'date'>) => void;
  className?: string;
  hideTitle?: boolean; // Add a new prop to hide the title
}

export const TeamNotes: React.FC<TeamNotesProps> = ({ 
  notes, 
  onAddNote,
  className = '',
  hideTitle = false // Default to showing the title
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
        action: "commented on" // Always set as "commented on"
      });
    }

    setNewNote('');
    setIsAddingNote(false);
    toast.success("Note added successfully");
  };

  return (
    <Card className={`overflow-hidden border-neutral-800 bg-card/90 backdrop-blur-sm h-full flex flex-col ${className}`}>
      {!hideTitle && (
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Team Notes
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-4 flex-grow overflow-auto">
        {notes.length > 0 ? (
          <Timeline>
            {notes.map((note, index) => (
              <TimelineItem key={note.id} className="pb-0 last:pb-0">
                <TimelineIndicator>
                  <Avatar className="h-7 w-7">
                    {note.author.avatar ? (
                      <AvatarImage src={note.author.avatar} alt={note.author.name} />
                    ) : (
                      <AvatarFallback className={note.author.avatarColor}>
                        {note.author.initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TimelineIndicator>
                
                {index !== notes.length - 1 && <TimelineSeparator />}
                
                <TimelineHeader>
                  <TimelineTitle>
                    <span className="font-medium text-sm text-foreground">{note.author.name}</span>
                    {" "}
                    <span className="text-muted-foreground text-sm">
                      commented on
                    </span>
                  </TimelineTitle>
                </TimelineHeader>
                
                <TimelineContent>
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

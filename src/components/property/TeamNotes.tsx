
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

export interface TeamNote {
  id: number;
  author: string;
  content: string;
  date: string;
}

interface TeamNotesProps {
  notes: TeamNote[];
  onAddNote: (note: Omit<TeamNote, 'id' | 'date'>) => void;
  className?: string;
}

const TeamNotesSection: React.FC<TeamNotesProps> = ({ 
  notes = [], 
  onAddNote,
  className = ''
}) => {
  const [newNote, setNewNote] = useState('');
  const [currentUser] = useState('Current Agent'); // In a real app, get from auth context

  const handleSubmitNote = () => {
    if (!newNote.trim()) return;
    
    onAddNote({
      author: currentUser,
      content: newNote.trim()
    });
    
    setNewNote('');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Team Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Add a note for your team..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="resize-none"
              />
              <Button 
                onClick={handleSubmitNote} 
                disabled={!newNote.trim()}
                className="flex items-center gap-1 ml-auto"
                size="sm"
              >
                <Send className="h-4 w-4 mr-1" />
                Add Note
              </Button>
            </div>
          </div>
          
          {notes.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {note.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{note.author}</span>
                        <span className="text-xs text-muted-foreground">{note.date}</span>
                      </div>
                      <p className="text-sm mt-1">{note.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {notes.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No team notes yet. Be the first to add one!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamNotesSection;

"use client"

import React from "react";
import NoteListItem from "./note-list-item";
import { Note } from "../../types/note";

interface NoteListProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteClick?: (note: Note) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, selectedNoteId, onNoteClick }) => {
  return (
    <div className="pl-2 pr-1 pt-1 flex flex-col">
      {notes.map((note) => (
        <NoteListItem
          key={note.id}
          title={note.title || 'Untitled'}
          summary={note.content}
          date={note.createdAt instanceof Date ? note.createdAt.toLocaleDateString() : new Date(note.createdAt).toLocaleDateString()}
          selected={selectedNoteId === note.id}
          onClick={() => onNoteClick && onNoteClick(note)}
        />
      ))}
    </div>
  );
};

export default NoteList;

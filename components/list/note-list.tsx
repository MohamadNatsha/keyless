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
    <div className="overflow-y-auto px-2 custom-scrollbar pt-1 pb-[20%] flex flex-col">
      {notes.map((note) => (
        <NoteListItem
          key={note.id}
          title={note.title}
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

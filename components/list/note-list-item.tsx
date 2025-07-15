"use client"

import React from "react";

interface NoteListItemProps {
  title: string;
  summary: string;
  date: string;
  selected?: boolean;
  onClick?: () => void;
}

const truncate = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const NoteListItem: React.FC<NoteListItemProps> = ({ title, summary, date, selected, onClick }) => {
  return (
    <div
      className={`bg-base-300 mb-3 p-4${selected ? ' ring-2 ring-primary' : ''}`}
      style={{ cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
    >
      <div className="text-base-content" style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>{title}</div>
      <div className="text-base-content-secondary" style={{ fontSize: 14, marginBottom: 8 }}>{truncate(summary, 80)}</div>
      <div className="text-base-content-secondary" style={{ fontSize: 12 }}>{date}</div>
    </div>
  );
};

export default NoteListItem;

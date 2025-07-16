"use client"

import React from "react";

interface NoteListItemProps {
  title: string;
  summary: string;
  date: string;
  selected?: boolean;
  onClick?: () => void;
}

function htmlToText(html: string): string {
  if (typeof window !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  return '';
}

const truncate = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const NoteListItem: React.FC<NoteListItemProps> = ({ title, summary, date, selected, onClick }) => {
  const plainSummary = htmlToText(summary);
  return (
    <div
      className={`p-4 hover:bg-base-100 last:mb-20  ${selected ? 'ring-1 ring-primary/50 bg-base-100 rounded-sm z-10' : 'bg-base-300 border-b-2 border-base-content-secondary/40'}`}
      style={{ cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
    >
      <div className="text-base-content" style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>{title}</div>
      <div className="text-base-content-secondary overflow-hidden text-ellipsis" style={{ fontSize: 14, marginBottom: 8 }}>{truncate(plainSummary, 80)}</div>
      <div className="text-base-content-secondary" style={{ fontSize: 12 }}>{date}</div>
    </div>
  );
};

export default NoteListItem;

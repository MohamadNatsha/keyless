'use client'

import NoteList from "@/components/list/note-list";
import { Note } from "../types/note";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from 'next-themes';
import NoteEditor from "@/components/note-editor";
import { PacmanLoader, MoonLoader } from "react-spinners";
import { IconSearch, IconTextPlus, IconSun, IconMoon } from "@tabler/icons-react";
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home() {
  const { theme, setTheme, systemTheme } = useTheme();
  let [notes, setNotes] = useState<Note[]>([]);
  let [loading, setLoading] = useState(true);
  let [selectedNote, setSelectedNote] = useState<Note | null>(null);
  let [search, setSearch] = useState("");
  let [hasMore, setHasMore] = useState(true);
  let [creatingNote, setCreatingNote] = useState(false);
  let [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const resolvedTheme = useMemo(() => theme === 'system' ? systemTheme : theme, [theme, systemTheme]);
  
  function toggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  function searchNotes(search: string) {
    setSearch(search);
    fetchNotes({ search }).then(notes => {
      setNotes(notes);
      setHasMore(true);
    });
  };

  async function fetchNotes(params: { search?: string; offset?: number; } = {}) {
    const searchParams = [];
    if (params.search) searchParams.push(`search=${encodeURIComponent(params.search)}`);
    if (typeof params.offset === 'number') searchParams.push(`offset=${params.offset}`);
    const url = `/api/notes${searchParams.length ? '?' + searchParams.join('&') : ''}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch notes");
    const notes = await res.json();
    return notes.map((n: any) => ({
      ...n,
      id: n.id.toString(),
      createdAt: new Date(n.createdAt),
      updatedAt: new Date(n.updatedAt),
    }));
  }

  async function createNote() {
    setCreatingNote(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '', content: '' })
      });
      if (!res.ok) throw new Error('Failed to create note');
      const n = await res.json();
      const newNote = {
        ...n,
        id: n.id.toString(),
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      };
      setNotes(prev => [newNote, ...prev]);
      setSelectedNote(newNote);
    } finally {
      setCreatingNote(false);
    }
  }

  function loadMore() {
    fetchNotes({ search, offset: notes.length }).then(notes => {
      setNotes(prev => [...prev, ...notes]);
      if(notes.length === 0) {
        setHasMore(false);
      }

      console.log('loaded more notes');
    });
  }

  useEffect(() => {
    fetchNotes().then(notes => {
      setNotes(notes);
      if (notes.length > 0) {
        setSelectedNote(notes[0]);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className={`bg-base-300 max-h-screen h-screen w-screen max-h-screen grid grid-rows-[100%] grid-cols-[300px_1fr]`}>
      <div className="h-full w-[300px]  text-base-content grid grid-rows-[180px_1fr]">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2 h-12">
            <h1 className="text-xl font-bold flex items-center">Keyless Notes</h1>
            <button
              className="ml-2 p-2 rounded transition bg-base-100 hover:bg-base-100 text-base-content"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              suppressHydrationWarning
              title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isClient && (resolvedTheme === 'dark' ? <IconSun suppressHydrationWarning className="w-5 h-5 text-primary" /> : <IconMoon suppressHydrationWarning className="w-5 h-5 text-primary" />)}
            </button>
          </div>
          <div className="flex flex-col gap-3">
          <button
            className="flex items-center w-full justify-center gap-2 bg-primary hover:brightness-95 text-white font-semibold py-2 rounded transition"
            onClick={createNote}
            disabled={creatingNote}
          >
            <IconTextPlus className="h-5 w-5" />
            New Note
          </button>
          <div className="relative ">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content">
              <IconSearch className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search notes..."
              className="input input-bordered w-full pl-10 py-2 rounded focus:outline-none focus:ring-2  bg-base-200 text-base-content outline outline-base-content-secondary/60"
              value={search}
              onChange={e => searchNotes(e.target.value)}
            />
          </div>
          </div>
        </div>
        {
          loading ? (
            <div className="flex justify-center items-center h-full pb-16">
              {isClient && <MoonLoader className="text-base-content" size={32} color={resolvedTheme === "dark" ? "white" : "black"} />}
            </div>
          ) : (
            <div id="note-scroll-container" className="max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
              <InfiniteScroll
                dataLength={notes.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <div className="flex justify-center items-center h-24">
                    {isClient && <MoonLoader className="text-base-content" size={24} color={resolvedTheme === "dark" ? "white" : "black"} />}
                  </div>
                }
                scrollableTarget="note-scroll-container"
              >
                <NoteList onNoteClick={setSelectedNote} selectedNoteId={selectedNote?.id ?? undefined} notes={notes} />
              </InfiniteScroll>
            </div>
          )
        }
      </div>
      <div className="bg-base-300 p-2  w-full">
        {loading || creatingNote ? <div className=" bg-base-200 rounded-lg flex justify-center items-center h-full">
          {isClient && <PacmanLoader className="text-base-content" color={resolvedTheme === "dark" ? "white" : "black"}></PacmanLoader>}
        </div> : <NoteEditor note={selectedNote} onCreateNote={() => {}} />}
      </div>
    </div>
  );
}


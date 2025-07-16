'use client'

import NoteList from "@/components/list/note-list";
import { Note, NoteCreationInput } from "../types/note";
import { useEffect, useMemo, useState, useRef, useContext } from "react";
import { useTheme } from 'next-themes';
import NoteEditor from "@/components/note-editor";
import { PacmanLoader, MoonLoader } from "react-spinners";
import { IconSearch, IconTextPlus, IconSun, IconMoon, IconX, IconMenu, IconAlertTriangle } from "@tabler/icons-react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { DirtyProvider, DirtyContext } from '../components/dirty-context';
import { oklch, formatHex } from 'culori';

function HomeContent() {
  const { theme, setTheme, systemTheme } = useTheme();
  let [notes, setNotes] = useState<Note[]>([]);
  let [loading, setLoading] = useState(true);
  let [selectedNote, setSelectedNote] = useState<Note | null>(null);
  let [search, setSearch] = useState("");
  let [hasMore, setHasMore] = useState(true);
  let [creatingNote, setCreatingNote] = useState(false);
  let [isClient, setIsClient] = useState(false);
  let [isSidebarOpen, setIsSidebarOpen] = useState(true);
  let [showDirtyModal, setShowDirtyModal] = useState(false);
  const { isDirty, setIsDirty, setShowWarning } = useContext(DirtyContext);
  const [primaryColor, setPrimaryColor] = useState('#000000');
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--color-primary').trim();
    setPrimaryColor(primaryColor);
    console.log('primaryColor', formatHex(oklch(primaryColor)));
  }, [systemTheme,theme]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const resolvedTheme = useMemo(() => theme === 'system' ? systemTheme : theme, [theme, systemTheme]);

  function toggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  function searchNotes(search: string) {
    setSearch(search);
    setHasMore(true);
    fetchNotes({ search }).then(notes => {
      setNotes(notes);
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

    if(notes.length < 10) {
      setHasMore(false);
    }

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
        body: JSON.stringify({ title: 'Untitled', content: '' })
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

  async function createNoteIfNotDirty() {
    if(isDirty) {
      setShowWarning(true, () => {
        createNote();
      });
    } else {
      createNote();
    }
  }

  async function deleteNote() {
    await fetch(`/api/notes/${selectedNote?.id}`, {
      method: 'DELETE'
    });
    setNotes(prev => prev.filter(n => n.id !== selectedNote?.id));
    setSelectedNote(null);
  }

  async function saveNote(note: NoteCreationInput) {
    await fetch(`/api/notes/${selectedNote?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });

    setIsDirty(false); // Move this out of setNotes
    setNotes(prev => {
      const newNotes = [...prev];
      const selectedNoteIndex = newNotes.findIndex(n => n.id === selectedNote?.id);
      if (selectedNoteIndex !== -1) {
        newNotes[selectedNoteIndex] = {
          ...newNotes[selectedNoteIndex],
          ...note
        };
      }
      return newNotes;
    });
  }

  function loadMore() {
    fetchNotes({ search, offset: notes.length }).then(notes => {
      setNotes(prev => [...prev, ...notes]);
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

  function handleNoteClick(note: Note) {
    if (isDirty && selectedNote && note.id !== selectedNote.id) {
      setShowWarning(true, () => {
        setSelectedNote(note);
      });
    } else {
      setSelectedNote(note);
    }
  }

  function handleDirtyModalConfirm() {
    setShowDirtyModal(false);
    setIsDirty(false);
  }
  function handleDirtyModalCancel() {
    setShowDirtyModal(false);
  }

  return (
    <div className={`relative bg-base-300 h-screen w-screen overflow-hidden grid grid-rows-[100%] grid-cols-[100%] md:grid-cols-[300px_1fr]`}>
      <div className={`${isSidebarOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'} transition-transform duration-300 max-md:absolute  left-0 bg-base-300 h-full w-full sm:w-[300px]  text-base-content flex flex-col max-h-screen overflow-hidden`}>

        <aside className="p-4">
          { /* Mobile only toggle sidebar */}
          <div className="md:hidden h-8 mb-2 flex items-center justify-between w-full">
            <button className="rounded transition hover:bg-base-100 text-base-content" aria-label="Toggle theme" onClick={() => setIsSidebarOpen(false)}>
              <IconX className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mb-2 h-12">
            <h1 className="text-xl font-bold flex items-center">Keyless Notes</h1>
            {isClient && <button
              className="ml-2 p-2 rounded transition bg-base-100 hover:bg-base-100 text-base-content"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              suppressHydrationWarning
              title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {(resolvedTheme === 'dark' ? <IconSun suppressHydrationWarning className="w-5 h-5 text-primary" /> : <IconMoon suppressHydrationWarning className="w-5 h-5 text-primary" />)}
            </button>}
          </div>
          <div className="flex flex-col gap-3">
            <button
              className="flex items-center w-full justify-center gap-2 bg-primary hover:brightness-95 text-white font-semibold py-2 rounded transition"
              onClick={createNoteIfNotDirty}
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
        </aside>
        { /* Loading for note list */}
        {
          loading ? (
            <div className="flex justify-center items-center h-full pb-16">
              {isClient && <MoonLoader className="text-base-content" size={32} color={primaryColor} />}
            </div>
          ) : (
            <main id="note-scroll-container" className=" overflow-y-auto custom-scrollbar">
              <InfiniteScroll
                dataLength={notes.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <div className="flex justify-center items-center h-24">
                    {isClient && <MoonLoader className="text-base-content" size={24} color={primaryColor} />}
                  </div>
                }
                scrollableTarget="note-scroll-container"
              >
                <NoteList onNoteClick={handleNoteClick} selectedNoteId={selectedNote?.id ?? undefined} notes={notes} />
              </InfiniteScroll>
            </main>
          )
        }
      </div>
      <div className="bg-base-300 flex flex-col p-2 pt-4 overflow-hidden">
        { /* Mobile only toggle sidebar */}
        <div className="md:hidden h-8 p-2 mb-2 flex items-center justify-between w-full">
          <button className="rounded transition hover:bg-base-100 text-base-content" aria-label="Toggle theme" onClick={() => setIsSidebarOpen(true)}>
            <IconMenu className="w-5 h-5" />
          </button>
        </div>
        { /* Loading for note editor */}
        {loading || creatingNote ? <div className=" bg-base-200 rounded-lg flex justify-center items-center h-full">
          {isClient && <PacmanLoader className="text-base-content" color={primaryColor}></PacmanLoader>}
        </div> : <NoteEditor onDeleteNote={deleteNote} onSaveNote={saveNote} note={selectedNote} onCreateNote={createNoteIfNotDirty} />}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <DirtyProvider>
      <HomeContent />
    </DirtyProvider>
  );
}


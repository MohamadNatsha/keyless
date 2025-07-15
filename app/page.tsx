'use client'

import NoteList from "@/components/list/note-list";
import { Note } from "../types/note";
import { useEffect, useState } from "react";
import NoteEditor from "@/components/note-editor";
import { PacmanLoader, MoonLoader } from "react-spinners";
import { Search, FilePlus } from "lucide-react";
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home() {
  let [notes, setNotes] = useState<Note[]>([]);
  let [loading, setLoading] = useState(true);
  let [selectedNote, setSelectedNote] = useState<Note | null>(null);
  let [theme, setTheme] = useState<"dark" | "light">("light");
  let [search, setSearch] = useState("");
  let [hasMore, setHasMore] = useState(true);

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
    <div className={`${theme === "dark" ? "dark" : ""} bg-base-100 max-h-screen h-screen w-screen max-h-screen grid grid-rows-[100%] grid-cols-[300px_1fr]`}>
      <div className="h-full w-[300px]  text-base-content grid grid-rows-[180px_1fr]">
        <div className="p-4">
          <h1 className="text-xl font-bold h-12 flex items-center mb-2">Keyless Notes</h1>
          <div className="flex flex-col gap-3">
          <button className="flex items-center w-full justify-center gap-2 bg-primary hover:brightness-95 text-white font-semibold py-2 rounded transition">
            <FilePlus className="h-5 w-5" />
            New Note
          </button>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search notes..."
              className="input input-bordered w-full pl-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-base-200 text-base-content"
              value={search}
              onChange={e => searchNotes(e.target.value)}
            />
          </div>
          </div>
        </div>
        {
          loading ? (
            <div className="flex justify-center items-center h-full pb-16">
              <MoonLoader className="text-base-content" size={32} color={theme === "dark" ? "white" : "black"} />
            </div>
          ) : (
            <div id="note-scroll-container" className="max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
              <InfiniteScroll
                dataLength={notes.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <div className="flex justify-center items-center h-24">
                    <MoonLoader className="text-base-content" size={24} color={theme === "dark" ? "white" : "black"} />
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
      <div className="bg-base-100 p-2  w-full">
        {loading ? <div className=" bg-base-200 rounded-lg flex justify-center items-center h-full">
          <PacmanLoader className="text-base-content" color={theme === "dark" ? "white" : "black"}></PacmanLoader>
        </div> : <NoteEditor note={selectedNote} onCreateNote={() => {}} />}
      </div>
    </div>
  );
}


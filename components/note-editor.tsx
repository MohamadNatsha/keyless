import { Note, NoteCreationInput } from "../types/note";
import { useRef, useEffect } from 'react';
import '../components/note';
import {
  IconList,
  IconListNumbers,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconH1,
  IconH2,
  IconH3,
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconDotsVertical
} from '@tabler/icons-react';
import { Editor } from '@tiptap/core';

type NoteEditorProps = {
  note: Note | null;
  onCreateNote: () => void;
  onSaveNote: (note: NoteCreationInput) => Promise<void>;
};

export default function NoteEditor({ note, onCreateNote, onSaveNote }: NoteEditorProps) {
  const editorRef = useRef<any>(null);
  function getEditor() {
   return editorRef.current.getEditor?.() as Editor | undefined;
  }

  async function saveNote() {
    const title = editorRef.current.getTitle() ?? '';
    const content = editorRef.current.getContent() ?? '';
    console.log(title, content);
    await onSaveNote({ title, content });
  }

  return (
    <div className="bg-base-100 text-base-content rounded-lg h-full w-full shadow-lg">
      {note ? <>
        <div className="w-full overflow-x-auto">
          <div className="flex justify-between">
            <div className="h-14 flex items-center p-4 pb-1 gap-4">
            <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().toggleBold().run()}>
                <IconBold />
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().toggleItalic().run()}>
                <IconItalic />
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().toggleUnderline().run()}>
                <IconUnderline />
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().toggleStrike().run()}>
                <IconStrikethrough />
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().toggleBulletList().run()}>
                <IconList />
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().toggleOrderedList().run()}>
                <IconListNumbers />
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().toggleHeading({ level: 1 }).run()}>
                <IconH1 />
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().toggleHeading({ level: 2 }).run()}>
                <IconH2 />
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().toggleHeading({ level: 3 }).run()}>
                <IconH3 />
              </button>
         
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().setTextAlign('left').run()}>
                <IconAlignLeft />
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().setTextAlign('center').run()}>
                <IconAlignCenter />
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5" onClick={() => getEditor()?.chain().focus().setTextAlign('right').run()}>
                <IconAlignRight />
              </button>
            </div>
            <div className="h-14 flex items-center p-4 pb-1 gap-4">
              <button onClick={saveNote} className="hover:bg-base-content-secondary/30 rounded-sm p-0.5 px-2">
                <p>Save</p>
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5">
                <IconDotsVertical />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-full w-full custom-scrollbar overflow-y-auto px-4 pt-4  flex flex-col items-center ">
          <note-viewer class="w-full h-full overflow-y-auto"  ref={editorRef} title={note?.title} content={note?.content} />
        </div>
      </> : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-gray-400 mb-4">No note selected.</div>
          <button
            className="btn btn-primary btn-outline"
            onClick={onCreateNote}
          >
            Create Note
          </button>
        </div>
      )}
    </div>
  );
}
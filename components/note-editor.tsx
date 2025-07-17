import { Note, NoteCreationInput } from "../types/note";
import { useRef, useState, useEffect, useContext } from 'react';
import './note';
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
  IconTrash,
  IconAlertCircle,
  IconTextPlus
} from '@tabler/icons-react';
import { Editor } from '@tiptap/core';
import { DirtyContext } from './dirty-context';

type NoteEditorProps = {
  note: Note | null;
  onCreateNote: () => void;
  onSaveNote: (note: NoteCreationInput) => Promise<void>;
  onDeleteNote: () => Promise<void>;
};

export default function NoteEditor({ note, onCreateNote, onSaveNote, onDeleteNote }: NoteEditorProps) {
  const editorRef = useRef<HTMLElement & { getEditor?: () => Editor | undefined; getTitle?: () => string; getContent?: () => string }>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { setIsDirty } = useContext(DirtyContext);

  useEffect(() => {
    if (!editorRef.current) return;
    const noteViewer = editorRef.current;
    const handleDirty = () => setIsDirty(true);
    noteViewer.addEventListener('dirty', handleDirty);
    return () => {
      noteViewer.removeEventListener('dirty', handleDirty);
    };
  }, [setIsDirty, note]);

  function getEditor() {
    if (!editorRef.current) return undefined;
    return editorRef.current.getEditor?.() as Editor | undefined;
  }

  async function saveNote() {
    const title = editorRef.current?.getTitle?.() ?? '';
    const content = editorRef.current?.getContent?.() ?? '';
    await onSaveNote({ title, content });
  }

  // Add ToolbarItem component
  function ToolbarItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
      <button className="hover:bg-base-content-secondary/30 rounded-sm p-0.5 h-8 w-8 flex items-center justify-center" onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <div className="bg-base-100 text-base-content rounded-lg h-full w-full shadow-lg">
      {note ? <>
        <div className="w-full overflow-x-auto">
          <div className="flex justify-between">
            <div className="h-14 flex items-center p-4 pb-1 gap-4">
              <ToolbarItem onClick={() => getEditor()?.chain().focus().toggleBold().run()}>
                <IconBold />
              </ToolbarItem>
              <ToolbarItem onClick={() => getEditor()?.chain().focus().toggleItalic().run()}>
                <IconItalic />
              </ToolbarItem>
              <ToolbarItem onClick={() => getEditor()?.chain().focus().toggleUnderline().run()}>
                <IconUnderline />
              </ToolbarItem>
              <ToolbarItem onClick={() => getEditor()?.chain().focus().toggleStrike().run()}>
                <IconStrikethrough />
              </ToolbarItem>
              <ToolbarItem onClick={() => getEditor()?.chain().focus().toggleBulletList().run()}>
                <IconList />
              </ToolbarItem>
              <ToolbarItem onClick={() => getEditor()?.chain().focus().toggleOrderedList().run()}>
                <IconListNumbers />
              </ToolbarItem>
              <ToolbarItem onClick={() => getEditor()?.chain().focus().toggleHeading({ level: 1 }).run()}>
                <IconH1 />
              </ToolbarItem>
              <ToolbarItem onClick={() => getEditor()?.chain().focus().toggleHeading({ level: 2 }).run()}>
                <IconH2 />
              </ToolbarItem>
              <ToolbarItem onClick={() => getEditor()?.chain().focus().toggleHeading({ level: 3 }).run()}>
                <IconH3 />
              </ToolbarItem>
              <ToolbarItem onClick={() => getEditor()?.chain().focus().setTextAlign('left').run()}>
                <IconAlignLeft />
              </ToolbarItem>
              <ToolbarItem onClick={() => getEditor()?.chain().focus().setTextAlign('center').run()}>
                <IconAlignCenter />
              </ToolbarItem>
              <ToolbarItem onClick={() => getEditor()?.chain().focus().setTextAlign('right').run()}>
                <IconAlignRight />
              </ToolbarItem>
            </div>
            <div className="h-14 flex items-center p-4 pb-1 gap-4">
              <button onClick={saveNote} className="hover:bg-base-content-secondary/30 rounded-sm p-0.5 px-2 h-8 flex items-center justify-center">
                <p className="text-lg font-semibold">Save</p>
              </button>
              <button className="hover:bg-base-content-secondary/30 rounded-sm p-1 h-8 w-8 flex items-center justify-center" onClick={() => setShowDeleteModal(true)}>
                <IconTrash  className="text-error" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-full w-full custom-scrollbar overflow-y-auto px-4 pt-4  flex flex-col items-center ">
          {/* @ts-expect-error I tried to fix this typescript error using type declartions but it didnt work with so I will ingore the error for now*/}
          <note-viewer class="w-full h-full overflow-y-auto"  ref={editorRef} title={note?.title} content={note?.content} />
        </div>
      </> : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-base-content-secondary mb-4">No note selected.</div>
          <button
            className="flex items-center w-[400px] justify-center gap-2 bg-primary hover:brightness-95 text-white font-semibold py-2 rounded transition"
            onClick={onCreateNote}
          >
            <IconTextPlus className="h-5 w-5" />
            New Note
          </button>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 transition-all "></div>
          <div className="relative bg-base-100 p-8 rounded-xl shadow-2xl border border-base-content/10 w-full max-w-xs sm:max-w-sm animate-pop-in">
            <div className="flex flex-col items-center">
              <IconAlertCircle className="mb-3 text-error w-12 h-12"/>
              <div className="mb-4 text-lg font-semibold text-center text-base-content">Are you sure you want to delete?</div>
              <div className="flex gap-3 w-full justify-end mt-2">
                <button
                  className="px-4 py-2 rounded-md font-medium"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-error text-error-content px-4 py-2 rounded-md font-medium shadow-sm hover:brightness-110"
                  onClick={() => {
                    onDeleteNote();
                    setShowDeleteModal(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
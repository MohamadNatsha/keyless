import { Note } from "../types/note";

type NoteEditorProps = {
  note: Note | null;
  onCreateNote: () => void;
};

export default function NoteEditor({ note, onCreateNote }: NoteEditorProps) {
  return (
    <div className="bg-base-300 text-base-content rounded-lg h-full w-full">
      {note ? (
        <div className="max-h-full w-full custom-scrollbar overflow-y-auto px-4  flex flex-col items-center pt-16">
          <div className="max-w-[680px] w-full pb-[20%]">
            <h2 className="text-2xl font-bold">{note.title}</h2>
            <p className="mt-2 whitespace-pre-wrap">{note.content}</p>
          </div>
        </div>
      ) : (
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
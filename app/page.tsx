import NoteList from "@/components/list/note-list";
import Image from "next/image";
import { Note } from "../types/note";

const testNotes: Note[] = [
  {
    id: "1",
    title: "Meeting Notes",
    content: "Discussed project milestones and deliverables. Action items assigned to team members.",
    createdAt: new Date("2024-06-01T10:00:00Z"),
    updatedAt: new Date("2024-06-01T12:00:00Z"),
  },
  {
    id: "2",
    title: "Shopping List",
    content: "Milk, eggs, bread, and coffee. Remember to check for discounts.",
    createdAt: new Date("2024-06-02T09:30:00Z"),
    updatedAt: new Date("2024-06-02T09:45:00Z"),
  },
  {
    id: "3",
    title: "Ideas",
    content: "Brainstorm new features for the app. Consider user feedback and recent trends.",
    createdAt: new Date("2024-06-03T14:20:00Z"),
    updatedAt: new Date("2024-06-03T15:00:00Z"),
  },
  {
    id: "4",
    title: "Travel Plans",
    content: "Book flights and hotels for summer vacation. Research local attractions and restaurants.",
    createdAt: new Date("2024-06-04T08:10:00Z"),
    updatedAt: new Date("2024-06-04T08:30:00Z"),
  },
  {
    id: "5",
    title: "Workout Routine",
    content: "Monday: Chest and triceps. Wednesday: Back and biceps. Friday: Legs and shoulders.",
    createdAt: new Date("2024-06-05T07:00:00Z"),
    updatedAt: new Date("2024-06-05T07:45:00Z"),
  },
  {
    id: "6",
    title: "Reading List",
    content: "Finish 'Atomic Habits', start 'Deep Work', and review notes from 'The Pragmatic Programmer'.",
    createdAt: new Date("2024-06-06T11:15:00Z"),
    updatedAt: new Date("2024-06-06T11:30:00Z"),
  },
  {
    id: "7",
    title: "Recipe Ideas",
    content: "Try making homemade pizza, experiment with Thai curry, and bake banana bread.",
    createdAt: new Date("2024-06-07T16:40:00Z"),
    updatedAt: new Date("2024-06-07T17:00:00Z"),
  },
  {
    id: "8",
    title: "Birthday Gifts",
    content: "Look for a new watch, personalized mug, and a book for Sarah's birthday.",
    createdAt: new Date("2024-06-08T13:25:00Z"),
    updatedAt: new Date("2024-06-08T13:40:00Z"),
  },
  {
    id: "9",
    title: "Learning Goals",
    content: "Complete React course, practice TypeScript, and build a portfolio project.",
    createdAt: new Date("2024-06-09T18:00:00Z"),
    updatedAt: new Date("2024-06-09T18:30:00Z"),
  },
  {
    id: "10",
    title: "Garden Tasks",
    content: "Water the plants, trim the hedges, and plant new flowers in the backyard.",
    createdAt: new Date("2024-06-10T07:50:00Z"),
    updatedAt: new Date("2024-06-10T08:10:00Z"),
  },
];

export default function Home() {
  return (
   <div className="h-screen w-screen max-h-screen">
    <div className="dark h-full w-[300px] bg-base-200 text-base-content flex flex-col">
      <div className="p-4">
          <h1 className="text-2xl font-bold">Keyless Notes</h1>
      </div>
      <NoteList notes={testNotes} />
    </div>
    
    
   </div>
  );
}


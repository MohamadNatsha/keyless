# Reasoning

This file is here to share my thoughts and decision-making process as I built this project. I hope it gives you a clear sense of why I made certain choices, and where things could go next!

## Framework

I went with Next.js because I wanted to use the same tools you use in your enviroment. While Next.js is incredibly powerful, I kept things simple and didn't use every feature (for example, I skipped React Server Components). There's a lot more that could be explored here!

## Deployment

The challenge mentioned deploying with Docker or Vercel. Personally, I usually lean toward Vercel for its simplicity, but since this app uses SQLite (which needs file system access), Docker made more sense. Vercel's serverless environment doesn't support persistent file storage, so Docker was the practical choice.

## State Management

Given the scope of this challenge, I stuck with React's built-in state and context. It's lightweight and gets the job done for a small app. If this project were to grow, I'd recommend moving to something like Zustand for more scalable state management.

## Styling

I used Tailwind CSS v4 for its powerful theming capabilities. I also followed the DaisyUI naming convention, using variable descriptions and grades (like 100, 200, 300) where it made sense. This keeps things organized and easy to extend.

## User Experience (UX)

I wanted the app to feel smooth and user-friendly, so I added:
- A warning if you try to leave with unsaved notes
- Loading screens when actions are in progress
- Basic mobile support (though there's room to improve)
- Both dark and light themes for your preference

## Constraints & Improvements

I aimed to finish this task in a limited time, so there are definitely areas for improvement:
- Show an indicator on the editor toolbar if your selection already uses an effect (like bold)
- Display a message in the editor when a note has unsaved changes
- Add auto-save that groups changes and syncs them to the server
- Make animations smoother and more engaging

Thanks for checking out my work! If you have ideas or feedback, I'd love to hear them. 
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { readText } from "@tauri-apps/api/clipboard";
import { generateCardsAI } from "./utils/card_chain";
import {
  CardJob,
  useCardsStore,
  useSettingsStore,
} from "./components/AppZustand";
import { v4 as uuidV4 } from "uuid";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("app")!);

const MainComponent = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        {/* <div data-tauri-drag-region className="title-bar fixed w-full h-7 bg-base-100 top-0 left-0 z-10 shadow-sm"></div> */}
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
};

root.render(<MainComponent></MainComponent>);

// window.api.onShortcut(async () => {
//   console.log("shotrcut");
//   console.log(await window.api.getClipboardText());
// });

const SHORTCUT = "CommandOrControl+Shift+K";

// Clear all previous (unfinished) jobs on app start
const { clearAllJobs } = useCardsStore.getState();
clearAllJobs();

unregister(SHORTCUT).then(() => {
  register(SHORTCUT, async () => {
    const clipText = await readText();
    const { openAIKey, promptTemplates, primaryLanguage } =
      useSettingsStore.getState();

    const { addJob, removeJob, addCards } = useCardsStore.getState();

    if (clipText) {
      console.log(clipText);

      const job: CardJob = {
        input: clipText,
        uuid: uuidV4(),
        timestamp: Date.now(),
      };

      try {
        addJob(job);
        const cards = await generateCardsAI(
          clipText,
          openAIKey,
          promptTemplates,
          primaryLanguage
        );

        console.log(cards);

        addCards(cards);
      } catch (error) {}

      removeJob(job.uuid);
    }
  });
});

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite'
);

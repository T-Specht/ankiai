import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";

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
import { toTauriStr } from "./components/KbdShortcut";

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

// Clear all previous (unfinished) jobs on app start
const { clearAllJobs } = useCardsStore.getState();

// Check for notification permission
isPermissionGranted().then(async (permissionGranted) => {
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === "granted";
  }
});

const newJob = async () => {
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

    sendNotification({
      title: "Generating new cards...",
    });

    try {
      addJob(job);
      const cards = await generateCardsAI(
        clipText,
        openAIKey,
        promptTemplates,
        primaryLanguage
      );

      console.log(cards);
      sendNotification({
        title: "New cards were generated.",
        body: `${cards.length} new cards were added to your collection.`,
      });

      addCards(cards);
    } catch (error) {}

    removeJob(job.uuid);
  }
};

let currentKey = useSettingsStore.getState().generateHotkey;

const registerGeneratationShortCut = async (key: string[]) => {
  const previousKey = toTauriStr(currentKey);
  const keyStr = toTauriStr(key);

  // if (!(await isRegistered(keyStr))) {
  // Skip this for now
  // }

  console.log("registering globalShort", keyStr);
  await unregister(previousKey);
  await register(keyStr, newJob);

  currentKey = key;
};

registerGeneratationShortCut(currentKey);

useSettingsStore.subscribe((state) => {
  registerGeneratationShortCut(state.generateHotkey);
});
clearAllJobs();

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite'
);

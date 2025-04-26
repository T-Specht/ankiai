import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode, useEffect } from "react";
import { register, ShortcutEvent, unregister } from "@tauri-apps/plugin-global-shortcut";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
import { generateCardsAI } from "./utils/card_chain";
import {
  CardJob,
  useCardsStore,
  useSettingsStore,
} from "./components/AppZustand";
import { v4 as uuidV4 } from "uuid";
import { toTauriStr } from "./components/KbdShortcut";
// import { ThemeProvider } from "./components/ui/ThemeProvider";
import { useDarkMode } from "usehooks-ts";

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
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    root.classList.add(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
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

const newJob = async (event: ShortcutEvent) => {
  if(event.state == 'Pressed') return; // Only run when key is released
  const clipText = await readText();
  const { openAIKey, promptTemplates, primaryLanguage, modelName } =
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
        primaryLanguage,
        modelName
      );

      console.log("Model: ", modelName);

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

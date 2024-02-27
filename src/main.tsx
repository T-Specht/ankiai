import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { AppContextProvider } from "./components/AppContextProvider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import {
  RouterProvider,
  createRouter
} from "@tanstack/react-router";
import { StrictMode } from "react";

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
        <AppContextProvider>
          {/* <div data-tauri-drag-region className="title-bar fixed w-full h-7 bg-base-100 top-0 left-0 z-10 shadow-sm"></div> */}
          <RouterProvider router={router} />
        </AppContextProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

root.render(<MainComponent></MainComponent>);

// window.api.onShortcut(async () => {
//   console.log("shotrcut");
//   console.log(await window.api.getClipboardText());
// });

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite'
);

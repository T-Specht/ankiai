import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";
import { useSettingsStore } from "../components/AppContextProvider";

export const Route = createRootRoute({
  component: () => {
    const onboardingComplete = useSettingsStore.use.onboardingComplete();
    const nav = useNavigate();

    useEffect(() => {
      if (!onboardingComplete) {
        nav({
          to: "/onboarding",
        });
      }
    }, [onboardingComplete]);

    return (
      <>
        <Outlet />

        {import.meta.env.DEV && <TanStackRouterDevtools />}
      </>
    );
  },
});

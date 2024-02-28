import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSettingsStore } from "../components/AppZustand";
import { useState } from "react";
import { KbdShortcut } from "../components/KbdShortcut";
import { KeyInput } from "../components/KeyInput";
import { IconAlertTriangle } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const setOnboardingComplete = useSettingsStore.use.setOnboardingComplete();
  const openAIKey = useSettingsStore.use.openAIKey();
  const generateHotkey = useSettingsStore.use.generateHotkey();
  const nav = useNavigate();

  const [step, setStep] = useState(0);

  const steps = [
    <div className="prose text-center">
      <h1>Welcome to AnkiAI! 🤖</h1>
      <p>
        AnkiAI was build to use AI for Anki card creation while still maintaing
        a user controlled workflow.
        <br />
        This means that while cards will be created by AI initially, you can
        still edit and editor them before adding to Anki.
      </p>
      <p></p>
    </div>,
    <div className="prose text-center">
      <div className="grid grid-cols-2 items-center md:gap-6 md:grid-cols-3">
        <div className="col-span-2">
          <h1>It's simple!</h1>
          <p>
            Copy the text you want to create Anki cards about into your cppboard
          </p>
          <p>
            Press <KbdShortcut keys={generateHotkey} />
          </p>
          <p>AnkiAI will generate cards unsing ChatGPT 3.5 Turbo</p>
          <p>Edit the cards to fit your style</p>
          <p>Add the cards to Anki</p>
        </div>
        <div className="hidden md:block">
          <img
            src="ai.gif"
            alt=""
            className="max-w-52 rounded shadow-md pointer-events-none"
          />
        </div>
      </div>
    </div>,
    <div className="prose text-center">
      <h1>Enter your OpenAI API Key</h1>
      <p>
        To use AnkiAI, you just need an OpenAI API Key and balance on your
        account. This means, you only pay what you use.
      </p>
      <KeyInput></KeyInput>
    </div>,
    <div className="prose text-center">
      <h1>All done!</h1>

      <p>Have fun with in the new era of Anki card creation! 🥳</p>
      <p>
        <b>Next steps:</b>
        <br />
        Setup AnkiConnect in the settings or just get started with creating AI
        cards.
      </p>

      <Button
        onClick={() => {
          setOnboardingComplete(true);
          nav({
            to: "/",
          });
        }}
        disabled={openAIKey == ""}
      >
        Get started!
      </Button>

      {openAIKey == "" && (
        <div className="text-left mt-3">
          <Alert>
            <IconAlertTriangle className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Before continuing, you need to enter an OpenAI API Key on the
              previous step.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>,
  ];

  return (
    <div className="select-none">
      <AnimatePresence mode="wait" initial={step != 0}>
        <motion.div
          key={step}
          className="min-h-svh flex p-4"
          initial={{ opacity: 0, x: "100%", scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: "-100%", scale: 0.8 }}
          transition={{
            duration: 0.1,
          }}
        >
          <div className="m-auto">{steps[step]}</div>
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 w-full p-10 flex justify-between">
        <Button
          variant="secondary"
          disabled={step == 0}
          onClick={() => setStep(step - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={step == steps.length - 1}
          onClick={() => setStep(step + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

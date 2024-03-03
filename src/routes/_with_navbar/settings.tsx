import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useSettingsStore } from "../../components/AppZustand";
import { HotKeyRecorder } from "../../components/HotKeyRecorder";
import { KeyInput } from "../../components/KeyInput";
import { DEFAULT_PROMPT_TEMPLATES } from "../../utils/card_chain";
import { useDarkMode, useLocalStorage } from "usehooks-ts";
import { IconMoon, IconSun } from "@tabler/icons-react";

export const Route = createFileRoute("/_with_navbar/settings")({
  component: Index,
});

function PromptTextArea(props: {
  defaultValue: string;
  setValue: (str: string) => unknown;
  promptKey: string;
  value: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (ref.current) {
      ref.current.style.height = ""; // needs to be unset first to make it smaller if necessary
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    setTimeout(() => {
      adjustHeight();
    }, 2000);
  }, []);

  return (
    <div className="my-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="textarea">
          <b>{props.promptKey}</b>{" "}
          {props.value.trim() !== props.defaultValue.trim() && (
            <Button onClick={() => props.setValue(props.defaultValue)}>
              Reset
            </Button>
          )}
        </Label>
        <Textarea
          placeholder="Prompt..."
          id="textarea"
          ref={ref}
          value={props.value}
          onChange={(e) => {
            adjustHeight();
            props.setValue(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

function Index() {
  const primaryLanguage = useSettingsStore.use.primaryLanguage();
  const setPrimaryLanguage = useSettingsStore.use.setPrimaryLanguage();
  const promptTemplates = useSettingsStore.use.promptTemplates();
  const setPromptTemplates = useSettingsStore.use.setPromptTemplates();
  const setGenerateHotkey = useSettingsStore.use.setGenerateHotkey();
  const generateHotkey = useSettingsStore.use.generateHotkey();

  const [accumulatedCost, setAccumulatedCosts] = useLocalStorage(
    "accumulatedCosts",
    {
      input: 0,
      output: 0,
      total: 0,
    }
  );

  const { isDarkMode, toggle } = useDarkMode();

  return (
    <div className="space-y-3">
      <KeyInput></KeyInput>

      <div>
        <Button onClick={toggle}>
          {isDarkMode ? (
            <>
              <IconSun size={15} className="mr-2"></IconSun>
              Switch to light mode
            </>
          ) : (
            <>
              <IconMoon size={15} className="mr-2"></IconMoon>
              Switch to dark mode
            </>
          )}
        </Button>
      </div>

      <div>
        <div className="text-lg font-bold">Accumulated Costs</div>
        <div>
          <b>Input: </b>
          {accumulatedCost.input}$
        </div>
        <div>
          <b>Output: </b>
          {accumulatedCost.output}$
        </div>
        <div>
          <b>Total: </b>
          {accumulatedCost.total}$
        </div>
        <div className="mt-3">
          <Button
            onClick={() =>
              setAccumulatedCosts({ input: 0, output: 0, total: 0 })
            }
          >
            Reset
          </Button>
        </div>
      </div>

      <div>
        <div className="text-lg font-bold">Hotkey for card generation</div>
        <HotKeyRecorder
          currentKeys={generateHotkey}
          onSave={(keys) => {
            setGenerateHotkey(keys);
          }}
        ></HotKeyRecorder>
      </div>

      <div>
        <Button asChild>
          <Link to="/anki-connect-setup">Go to AnkiConnect setup</Link>
        </Button>
      </div>

      <div>
        <Button asChild>
          <Link to="/onboarding">Go to onboarding</Link>
        </Button>
      </div>

      <Accordion
        type="single"
        collapsible
        className="bg-secondary px-4 py-2 rounded-md"
      >
        <AccordionItem value="templates">
          <AccordionTrigger>
            <div>
              Prompt Templates
              <span className="ml-2 text-xs">
                Click to expand. Modify at your own risk.
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="input">Primary language</Label>
                <Input
                  type="text"
                  placeholder="English, for example"
                  id="input"
                  value={primaryLanguage}
                  onChange={(e) => setPrimaryLanguage(e.target.value)}
                />
              </div>
              {Object.entries(promptTemplates).map(([key, value]) => {
                const defaultValue: string = (DEFAULT_PROMPT_TEMPLATES as any)[
                  key
                ];

                const setValue = (newValue: string) =>
                  setPromptTemplates({ ...promptTemplates, [key]: newValue });

                return (
                  <PromptTextArea
                    key={key}
                    promptKey={key}
                    defaultValue={defaultValue}
                    setValue={setValue}
                    value={value}
                  ></PromptTextArea>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

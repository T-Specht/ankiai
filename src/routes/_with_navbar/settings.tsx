import { Link, createFileRoute } from "@tanstack/react-router";
import { KeyInput } from "../../components/KeyInput";
import { DEFAULT_PROMPT_TEMPLATES } from "../../utils/card_chain";
import { useSettingsStore } from "../../components/AppZustand";
import { useEffect, useRef } from "react";

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
      ref.current.style.height = "";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    setTimeout(() => {
      adjustHeight()
    }, 2000)
  }, []);

  return (
    <div className="my-4">
      <label className="form-control">
        <div className="label">
          <span className="label-text">
            <b>{props.promptKey}</b>{" "}
            {props.value.trim() !== props.defaultValue.trim() && (
              <button
                className="btn btn-xs"
                onClick={() => props.setValue(props.defaultValue)}
              >
                Reset
              </button>
            )}
          </span>
        </div>
        <textarea
          className="textarea textarea-bordered"
          ref={ref}
          value={props.value}
          onChange={(e) => {
            adjustHeight();
            props.setValue(e.target.value);
          }}
        ></textarea>
      </label>
    </div>
  );
}

function Index() {
  const primaryLanguage = useSettingsStore.use.primaryLanguage();
  const setPrimaryLanguage = useSettingsStore.use.setPrimaryLanguage();
  const promptTemplates = useSettingsStore.use.promptTemplates();
  const setPromptTemplates = useSettingsStore.use.setPromptTemplates();

  return (
    <div className="space-y-3">
      <KeyInput></KeyInput>

      <div>
        <Link to="/anki-connect-setup" className="btn no-underline">
          Go to AnkiConnect setup
        </Link>
      </div>

      <div>
        <Link to="/onboarding" className="btn no-underline">
          Go to onboarding
        </Link>
      </div>

      <details className="collapse bg-base-200">
        <summary className="collapse-title text-xl font-medium">
          Prompt Templates
          <p className="text-xs">Click to expand. Modify at your own risk.</p>
        </summary>
        <div className="collapse-content">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">
                <b>Primary language</b>
              </span>
            </div>
            <input
              type="text"
              placeholder="English, for example"
              className="input input-bordered w-full max-w-xs"
              value={primaryLanguage}
              onChange={(e) => setPrimaryLanguage(e.target.value)}
            />
          </label>

          {Object.entries(promptTemplates).map(([key, value]) => {
            const defaultValue: string = (DEFAULT_PROMPT_TEMPLATES as any)[key];

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
      </details>
    </div>
  );
}

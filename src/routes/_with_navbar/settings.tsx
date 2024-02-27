import { Link, createFileRoute } from "@tanstack/react-router";
import { KeyInput } from "../../components/KeyInput";
import { useAppContext } from "../../components/AppContextProvider";
import { DEFAULT_PROMPT_TEMPLATES } from "../../utils/card_chain";

export const Route = createFileRoute("/_with_navbar/settings")({
  component: Index,
});

function Index() {
  const {
    promptTemplates: queries,
    setPromptTemplates: setQueries,
    primaryLanguage,
    setPrimaryLanguage,
  } = useAppContext();

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

          {Object.entries(queries).map(([key, value]) => {
            const defaultValue: string = (DEFAULT_PROMPT_TEMPLATES as any)[key];

            const setValue = (newValue: string) =>
              setQueries({ ...queries, [key]: newValue });

            return (
              <div key={key} className="my-4">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">
                      <b>{key}</b>{" "}
                      {value.trim() !== defaultValue.trim() && (
                        <button
                          className="btn btn-xs"
                          onClick={() => setValue(defaultValue)}
                        >
                          Reset
                        </button>
                      )}
                    </span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered h-32"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                  ></textarea>
                </label>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}

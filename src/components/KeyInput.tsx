import { useSettingsStore } from "./AppZustand";

export function KeyInput() {
  const openAIKey = useSettingsStore.use.openAIKey();
  const setOpenAIKey = useSettingsStore.use.setOpenAIKey();

  return (
    <>
      <label className="input input-bordered flex items-center gap-2">
        OpenAI Key
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="password"
          value={openAIKey}
          onChange={(e) => setOpenAIKey(e.target.value)}
        />
      </label>
      <p className="p-1">
        If you do not have an API key, you need to register for the OpenAI API
        at{" "}
        <a href="https://platform.openai.com" className="link" target="_blank">
          platform.openai.com
        </a>
        .
        <br />
        You can follow the first steps of{" "}
        <a
          href="https://platform.openai.com/docs/quickstart?context=node"
          target="_blank"
          className="link"
        >
          this guide
        </a>{" "}
        to get your API key, if you are unsure how to do so.
      </p>
    </>
  );
}

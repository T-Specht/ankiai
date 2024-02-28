import { useSettingsStore } from "./AppZustand";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function KeyInput() {
  const openAIKey = useSettingsStore.use.openAIKey();
  const setOpenAIKey = useSettingsStore.use.setOpenAIKey();

  return (
    <>
      <div className="grid w-full items-center gap-1.5 text-left">
        <Label htmlFor="openAIKey">Open AI Key</Label>
        <Input
          type="password"
          id="openAIKey"
          placeholder="sk-"
          value={openAIKey}
          onChange={(e) => setOpenAIKey(e.target.value)}
        />
      </div>
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

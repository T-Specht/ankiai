import { useState } from "react";
import { useRecordHotkeys } from "react-hotkeys-hook";
import { KbdShortcut } from "./KbdShortcut";
import { Button } from "./ui/button";

export function HotKeyRecorder(props: {
  currentKeys: string[];
  onSave: (keys: string[]) => unknown;
}) {
  const [keys, { start, stop, isRecording, resetKeys }] = useRecordHotkeys();
  const [currentKeys, setCurrentKeys] = useState<string[] | null>(
    props.currentKeys || null
  );

  return (
    <div>
      <Button
        variant={isRecording ? "destructive" : "secondary"}
        size="xs"
        onClick={() => {
          if (isRecording) stop();
          else start();
        }}
      >
        {isRecording ? (
          <span className="flex items-center gap-1">
            <span className="loading loading-ring loading-xs"></span>
            <span>Recording... Click to stop</span>
          </span>
        ) : (
          "Click to record"
        )}
      </Button>
      <div className="mt-3">
        <div>
          {currentKeys == null ? (
            <span>Currently, no shortcut is set</span>
          ) : (
            <span>
              Current hotkey: <KbdShortcut keys={currentKeys} />
            </span>
          )}
        </div>
        {keys.size > 0 && (
          <div className="mt-4">
            New hotkey: <KbdShortcut keys={[...keys]}></KbdShortcut>
            <Button
              size="xs"
              className="ml-4"
              onClick={() => {
                if (isRecording) stop();
                props.onSave([...keys]);
                setCurrentKeys([...keys]);
                resetKeys();
              }}
            >
              Save shortcut
            </Button>
            <Button
              size="xs"
              variant="secondary"
              className="ml-2"
              onClick={() => {
                if (isRecording) stop();
                resetKeys();
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      <br />
    </div>
  );
}

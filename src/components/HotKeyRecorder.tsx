import { useRecordHotkeys } from "react-hotkeys-hook";
import { KbdShortcut } from "./KbdShortcut";
import { useState } from "react";

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
      <button
        className={`btn btn-xs ${isRecording ? "btn-error" : "btn"}`}
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
      </button>
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
          <div className="mt-2">
            New hotkey: <KbdShortcut keys={[...keys]}></KbdShortcut>
            <button
              className="btn btn-xs btn-primary ml-4"
              onClick={() => {
                if (isRecording) stop();
                props.onSave([...keys]);
                setCurrentKeys([...keys]);
                resetKeys();
              }}
            >
              Save shortcut
            </button>
            <button
              className="btn btn-xs ml-2"
              onClick={() => {
                if (isRecording) stop();
                resetKeys();
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <br />
    </div>
  );
}

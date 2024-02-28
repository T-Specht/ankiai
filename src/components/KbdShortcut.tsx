function isMacintosh() {
  return navigator.userAgent.indexOf("Mac") > -1;
}

const isMac = isMacintosh();

const specialKeysMac: {
  [key: string]: {
    mac: string;
    win: string;
    tauri: string;
  };
} = {
  meta: {
    mac: "⌘",
    win: "⊞",
    tauri: "CmdOrControl",
  },
  mod: {
    mac: "⌘",
    win: "⊞",
    tauri: "CmdOrControl",
  },
  alt: {
    mac: "⌥",
    win: "alt",
    tauri: "Alt",
  },
  shift: {
    mac: "⇧",
    win: "⇧",
    tauri: "Shift",
  },
  ctrl: {
    mac: "^",
    win: "Ctrl",
    tauri: "CmdOrControl",
  },
};

export const toTauriStr = (keys: string[]) => {
  return keys
    .map((k) => {
      const keySymbol = specialKeysMac[k.toLowerCase()]
        ? specialKeysMac[k.toLowerCase()].tauri
        : k.toUpperCase();
      return keySymbol;
    })
    .join("+");
};

export const KbdShortcut = (props: { keys: string[] }) => {
  return (
    <>
      {props.keys.map((k, i) => {
        const keySymbol = specialKeysMac[k.toLowerCase()]
          ? specialKeysMac[k.toLowerCase()][isMac ? "mac" : "win"]
          : k.toUpperCase();

        return (
          <span key={`${k}-${i}`}>
            {i != 0 && <span>+</span>}
            <kbd className="text-base-content bg-secondary py-2 px-2 text-secondary-foreground shadow-xs rounded border">
              {keySymbol}
            </kbd>
          </span>
        );
      })}
    </>
  );
};

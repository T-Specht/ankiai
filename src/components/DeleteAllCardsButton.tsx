import { IconTrash } from "@tabler/icons-react";
import { useAppContext } from "./AppContextProvider";
import { confirm } from "@tauri-apps/api/dialog";

export function DeleteAllCardsButton() {
  const { setCards } = useAppContext();
  return (
    <button
      className="btn btn-error btn-xs"
      onClick={async () => {
        if (await confirm("Do you really want to delete all generated cards?"))
          setCards([]);
      }}
    >
      <IconTrash size={15}></IconTrash>
      Delete all
    </button>
  );
}

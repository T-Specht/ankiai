import { IconCheck, IconLayoutGridAdd, IconX } from "@tabler/icons-react";
import { useRef } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppContext } from "./AppContextProvider";
import { useLocalStorage } from "@uidotdev/usehooks";
import { confirm } from "@tauri-apps/api/dialog";
import { Link } from "@tanstack/react-router";
import { addAnkiNotes, getAnkiAPIVersion } from "../utils/anki";

export function AddToAnkiButton() {
  const { cards, setCards } = useAppContext();
  const [deck, setDeck] = useLocalStorage("deck", "AnkiAi");
  const modalRef = useRef<HTMLDialogElement>(null);

  const ankiVersionQuery = useQuery({
    queryFn: () => getAnkiAPIVersion(),
    queryKey: ["ankiversion"],
  });

  const ankiAddCardsToDeck = useMutation({
    mutationFn: () => {
      return addAnkiNotes(cards, deck);
    },
    onSuccess: async () => {
      if (
        await confirm(
          `${cards.length} cards were added to deck ${deck}. Delete cards here?`
        )
      ) {
        setCards([]);
      }
      modalRef.current?.close();
    },
  });

  return (
    <>
      <button
        className="btn btn-success btn-xs"
        onClick={async () => {
          modalRef.current?.showModal();
        }}
      >
        <IconLayoutGridAdd size={15} />
        Add to Anki
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add to Anki</h3>

          <div className="py-4">
            {ankiVersionQuery.data ? (
              <div>
                <div className="flex items-center gap-2">
                  <IconCheck className="text-green-500"></IconCheck>
                  <div>
                    Connected to Anki API version {ankiVersionQuery.data.result}
                  </div>
                </div>
                <div className="my-4 flex items-end gap-4">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Deck name</span>
                    </div>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Deck name"
                      value={deck}
                      onChange={(e) => setDeck(e.target.value)}
                    />
                  </label>
                  <button
                    className="btn btn-primary"
                    disabled={deck == "" || cards.length == 0 || ankiAddCardsToDeck.isPending}
                    onClick={() => {
                      ankiAddCardsToDeck.mutate();
                    }}
                  >
                    Add {cards.length} cards to deck
                  </button>
                </div>
              </div>
            ) : (
              <>
                
                <div className="flex items-center gap-2">
                  <IconX className="text-red-600"></IconX>
                  <div>
                    Connection to Anki API was unsuccessful. Is Anki open? Have
                    you followed the setup?
                  </div>
                </div>
                <Link to="/anki-connect-setup">
                  <button className="btn mt-5 btn-primary">Setup & Instructions</button>
                </Link>
              </>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

import { IconCheck, IconLayoutGridAdd, IconX } from "@tabler/icons-react";
import { useState } from "react";

import { useCardsStore } from "@/components/AppZustand";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addAnkiNotes, getAnkiAPIVersion } from "@/utils/anki";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { confirm } from "@tauri-apps/plugin-dialog";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function AddToAnkiButton() {
  const cards = useCardsStore.use.cards();
  const setCards = useCardsStore.use.setCards();
  const [deck, setDeck] = useLocalStorage("deck", "AnkiAi");
  const [open, setOpen] = useState(false);

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
        setOpen(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger>
        <Button variant="secondary" size="xs">
          <IconLayoutGridAdd size={15} className="mr-2" />
          Add to Anki
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Anki</DialogTitle>
          <DialogDescription>
            Add the current cards to Anki. Please make sure that the deck already exists
            in Anki, as it will <b>not</b> be created automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          {ankiVersionQuery.data ? (
            <div>
              <div className="flex items-center gap-2">
                <IconCheck className="text-green-500"></IconCheck>
                <div>
                  Connected to Anki API version {ankiVersionQuery.data.result}
                </div>
              </div>
              <div className="my-4 flex items-end gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="deck">Deck name</Label>
                  <Input
                    type="text"
                    id="deck"
                    placeholder="Deck name, e.g. AIAnki"
                    value={deck}
                    onChange={(e) => setDeck(e.target.value)}
                  />
                </div>
                <Button
                  disabled={
                    deck == "" ||
                    cards.length == 0 ||
                    ankiAddCardsToDeck.isPending
                  }
                  onClick={() => {
                    ankiAddCardsToDeck.mutate();
                  }}
                >
                  Add {cards.length} cards to deck
                </Button>
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
              <Button asChild>
                <Link to="/anki-connect-setup">Setup & Instructions</Link>
              </Button>
            </>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AICard, ChangedAICards, updateAnkiCard } from "../utils/card_chain";
import { useSettingsStore } from "./AppZustand";
import { Loader } from "./Loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const ChangeCardDialog = (props: {
  card: AICard;
  openAIKey: string;
  handleCardChange: (data: ChangedAICards) => unknown;
  children: React.ReactNode;
}) => {
  const [changeRequest, setChangeRequest] = useState("");
  // const { promptTemplates, primaryLanguage } = useAppContext();
  const primaryLanguage = useSettingsStore.use.primaryLanguage();
  const promptTemplates = useSettingsStore.use.promptTemplates();
  const modelName = useSettingsStore.use.modelName();
  const [open, setOpen] = useState(false);

  const changeCardMutation = useMutation({
    mutationFn: (action: string) => {
      return updateAnkiCard(
        props.card,
        action,
        props.openAIKey,
        promptTemplates,
        primaryLanguage,
        modelName
      );
    },
    onSettled(data) {
      console.log(data);
      setOpen(false);
      props.handleCardChange(data as any);
    },
  });

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change card</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="What should be changed?"
              className="input input-bordered w-full flex-grow"
              value={changeRequest}
              onChange={(e) => setChangeRequest(e.target.value)} />
            <Button
              onClick={() => changeCardMutation.mutate(changeRequest)}
              disabled={changeRequest == "" || changeCardMutation.isPending}
              type="submit"
            >
              Change
            </Button>
          </div>
          <div className="my-2 flex gap-2">
            {[
              {
                name: "Split",
                action: "split the card up into multiple cards if possible but do not repeat the questions.",
              },
              {
                name: "More detail",
                action: "add more detail",
              },
            ].map((a) => (
              <Button
                variant="secondary"
                key={a.name}
                disabled={changeCardMutation.isPending}
                onClick={() => changeCardMutation.mutate(a.action)}
              >
                {a.name}
              </Button>
            ))}
          </div>
          {changeCardMutation.isPending && (
            <div className="text-primary flex my-5">
              <Loader text="Editing card..."></Loader>
            </div>
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
};

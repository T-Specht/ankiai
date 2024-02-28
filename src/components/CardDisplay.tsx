import { useRef, useState, forwardRef } from "react";
import { AICard, updateAnkiCard, ChangedAICards } from "../utils/card_chain";
import { useMutation } from "@tanstack/react-query";
import { IconMessagePlus, IconTrash } from "@tabler/icons-react";
import { Editor } from "./Editor";
import { confirm } from "@tauri-apps/api/dialog";
import {
  useCardsStore,
  useSettingsStore,
  useTemporalCardsStore,
} from "./AppZustand";

const ChangeCardDialog = forwardRef<
  HTMLDialogElement,
  {
    card: AICard;
    openAIKey: string;
    handleCardChange: (data: ChangedAICards) => unknown;
  }
>((props, ref) => {
  const [changeRequest, setChangeRequest] = useState("");
  // const { promptTemplates, primaryLanguage } = useAppContext();
  const primaryLanguage = useSettingsStore.use.primaryLanguage();
  const promptTemplates = useSettingsStore.use.promptTemplates();

  const changeCardMutation = useMutation({
    mutationFn: (action: string) => {
      return updateAnkiCard(
        props.card,
        action,
        props.openAIKey,
        promptTemplates,
        primaryLanguage
      );
    },
    onSettled(data) {
      console.log(data);
      props.handleCardChange(data as any);
    },
  });

  return (
    <dialog className="modal" ref={ref}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Change card</h3>

        <div className="my-2 flex gap-2">
          <input
            type="text"
            placeholder="What should be changed?"
            className="input input-bordered w-full max-w-xs flex-grow"
            value={changeRequest}
            onChange={(e) => setChangeRequest(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => changeCardMutation.mutate(changeRequest)}
            disabled={changeRequest == "" || changeCardMutation.isPending}
          >
            Change
          </button>
        </div>
        <div className="my-2 flex gap-2">
          {[
            {
              name: "Split",
              action:
                "split the card up into multiple cards if possible but do not repeat the questions.",
            },
            {
              name: "More detail",
              action: "add more detail",
            },
          ].map((a) => (
            <button
              className="btn btn-outline"
              key={a.name}
              disabled={changeCardMutation.isPending}
              onClick={() => changeCardMutation.mutate(a.action)}
            >
              {a.name}
            </button>
          ))}
        </div>
        {changeCardMutation.isPending && (
          <div className="text-primary flex my-10">
            <span className="loading loading-spinner mr-4"></span>
            <span>Editing card... </span>
          </div>
        )}
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
});

export const CardDisplay: React.FunctionComponent<{
  card: AICard;
}> = ({ card }) => {
  const changeModal = useRef<HTMLDialogElement>(null);

  const changeCard = useCardsStore.use.changeCard();
  const removeCard = useCardsStore.use.removeCard();
  const removeCardAndAddChangedVersions =
    useCardsStore.use.removeCardAndAddChangedVersions();
  const openAIKey = useSettingsStore.use.openAIKey();

  const { futureStates } = useTemporalCardsStore((state) => state);

  return (
    <div className="card bg-base-100 dark:bg-neutral shadow-xl  dark:border-none border rounded-md">
      <div className="card-body">
        <h2 className="card-title text-primary">
          <Editor
            inputMarkdown={card.front}
            prose={false}
            key={`h-${card.uuid}-${futureStates.length}`} // Handle Zustand history change: this key is important because once mounted, the editor is uncontrolled and does not change its content based on inputMarkdown prop. This is only used for initialSetting
            onChange={(markdown) => changeCard(card.uuid, { front: markdown })}
          ></Editor>
        </h2>
        <div>
          <Editor
            key={`b-${card.uuid}-${futureStates.length}`} // Handle Zustand history change: this key is important because once mounted, the editor is uncontrolled and does not change its content based on inputMarkdown prop. This is only used for initialSetting
            inputMarkdown={card.back}
            prose
            onChange={(markdown) => changeCard(card.uuid, { back: markdown })}
          ></Editor>
        </div>
        <div className="card-actions mt-auto flex items-center pt-5">
          <div className="max-w-[50%] opacity-50 text-xs">{card.deck}</div>
          <div className="mr-auto"></div>
          <button
            className="btn btn-sm"
            onClick={() => {
              changeModal.current!.showModal();
            }}
          >
            <IconMessagePlus></IconMessagePlus>
          </button>
          <button
            className="btn btn-sm"
            onClick={async () => {
              if (await confirm("Wirklich löschen?")) removeCard(card.uuid);
            }}
          >
            <IconTrash></IconTrash>
          </button>
        </div>
        <ChangeCardDialog
          ref={changeModal}
          card={card}
          openAIKey={openAIKey}
          handleCardChange={(cards) => {
            removeCardAndAddChangedVersions(card.uuid, cards);
          }}
        ></ChangeCardDialog>
      </div>
    </div>
  );
};

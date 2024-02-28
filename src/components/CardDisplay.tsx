import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  IconFileTextAi,
  IconMessagePlus,
  IconTrash,
} from "@tabler/icons-react";
import { confirm } from "@tauri-apps/api/dialog";
import { useRef } from "react";
import { AICard } from "../utils/card_chain";
import {
  useCardsStore,
  useSettingsStore,
  useTemporalCardsStore,
} from "./AppZustand";
import { ChangeCardDialog } from "./ChangeCardDialog";
import { Editor } from "./Editor";
import { SummaryDialog } from "./SummaryDialog";
import { Button } from "./ui/button";

// export const CardDisplay: React.FunctionComponent<{
//   card: AICard;
// }> = ({ card }) => {
//   const changeModal = useRef<HTMLDialogElement>(null);

//   const changeCard = useCardsStore.use.changeCard();
//   const removeCard = useCardsStore.use.removeCard();
//   const removeCardAndAddChangedVersions =
//     useCardsStore.use.removeCardAndAddChangedVersions();
//   const openAIKey = useSettingsStore.use.openAIKey();

//   const { futureStates } = useTemporalCardsStore((state) => state);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>
//           <Editor
//             inputMarkdown={card.front}
//             prose={false}
//             key={`h-${card.uuid}-${futureStates.length}`} // Handle Zustand history change: this key is important because once mounted, the editor is uncontrolled and does not change its content based on inputMarkdown prop. This is only used for initialSetting
//             onChange={(markdown) => changeCard(card.uuid, { front: markdown })}
//           ></Editor>
//         </CardTitle>
//         {/* <CardDescription>Card Description</CardDescription> */}
//       </CardHeader>
//       <CardContent>
//         <Editor
//           key={`b-${card.uuid}-${futureStates.length}`} // Handle Zustand history change: this key is important because once mounted, the editor is uncontrolled and does not change its content based on inputMarkdown prop. This is only used for initialSetting
//           inputMarkdown={card.back}
//           prose
//           onChange={(markdown) => changeCard(card.uuid, { back: markdown })}
//         ></Editor>
//       </CardContent>
//       <CardFooter>
//         <div className="flex gap-2 items-center">
//           <div className="max-w-[50%] opacity-50 text-xs">{card.deck}</div>

//           <div className="ml-auto flex gap-2">
//             <ChangeCardDialog
//               card={card}
//               openAIKey={openAIKey}
//               handleCardChange={(cards) => {
//                 removeCardAndAddChangedVersions(card.uuid, cards);
//               }}
//             >
//               <Button
//                 variant="secondary"
//                 size="xs"
//                 onClick={() => {
//                   changeModal.current!.showModal();
//                 }}
//               >
//                 <IconMessagePlus size={15}></IconMessagePlus>
//               </Button>
//             </ChangeCardDialog>
//             <Button
//               variant="destructive"
//               size="xs"
//               onClick={async () => {
//                 if (await confirm("Wirklich löschen?")) removeCard(card.uuid);
//               }}
//             >
//               <IconTrash size={15}></IconTrash>
//             </Button>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// };

export const CardDisplay: React.FunctionComponent<{
  card: AICard;
  summary: string;
}> = ({ card, summary }) => {
  const changeModal = useRef<HTMLDialogElement>(null);

  const changeCard = useCardsStore.use.changeCard();
  const removeCard = useCardsStore.use.removeCard();
  const removeCardAndAddChangedVersions =
    useCardsStore.use.removeCardAndAddChangedVersions();
  const openAIKey = useSettingsStore.use.openAIKey();

  const { futureStates } = useTemporalCardsStore((state) => state);

  return (
    <div className="grid md:grid-cols-3 border rounded my-3 shadow-lg">
      <div className="col-span-1 p-6 space-y-3">
        <h3 className="text-lg font-bold">
          <Editor
            inputMarkdown={card.front}
            prose={false}
            key={`h-${card.uuid}-${futureStates.length}`} // Handle Zustand history change: this key is important because once mounted, the editor is uncontrolled and does not change its content based on inputMarkdown prop. This is only used for initialSetting
            onChange={(markdown) => changeCard(card.uuid, { front: markdown })}
          ></Editor>
        </h3>
        <div className="opacity-50 text-xs">{card.deck}</div>
        <div className="flex gap-2 items-center">
          <ChangeCardDialog
            card={card}
            openAIKey={openAIKey}
            handleCardChange={(cards) => {
              removeCardAndAddChangedVersions(card.uuid, cards);
            }}
          >
            <Button
              variant="secondary"
              size="xs"
              onClick={() => {
                changeModal.current!.showModal();
              }}
            >
              <IconMessagePlus size={15}></IconMessagePlus>
            </Button>
          </ChangeCardDialog>
          <SummaryDialog summary={summary}>
            <Button variant="secondary" size="xs">
              <IconFileTextAi size={15}></IconFileTextAi>
            </Button>
          </SummaryDialog>
          <Button
            variant="destructive"
            size="xs"
            onClick={async () => {
              if (await confirm("Wirklich löschen?")) removeCard(card.uuid);
            }}
          >
            <IconTrash size={15}></IconTrash>
          </Button>
        </div>
      </div>
      <div className="col-span-2 p-3 md:p-1">
        <Editor
          key={`b-${card.uuid}-${futureStates.length}`} // Handle Zustand history change: this key is important because once mounted, the editor is uncontrolled and does not change its content based on inputMarkdown prop. This is only used for initialSetting
          inputMarkdown={card.back}
          prose
          onChange={(markdown) => changeCard(card.uuid, { back: markdown })}
        ></Editor>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <Editor
          key={`b-${card.uuid}-${futureStates.length}`} // Handle Zustand history change: this key is important because once mounted, the editor is uncontrolled and does not change its content based on inputMarkdown prop. This is only used for initialSetting
          inputMarkdown={card.back}
          prose
          onChange={(markdown) => changeCard(card.uuid, { back: markdown })}
        ></Editor>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 items-center">
          <div className="max-w-[50%] opacity-50 text-xs">{card.deck}</div>

          <div className="ml-auto flex gap-2">
            <ChangeCardDialog
              card={card}
              openAIKey={openAIKey}
              handleCardChange={(cards) => {
                removeCardAndAddChangedVersions(card.uuid, cards);
              }}
            >
              <Button
                variant="secondary"
                size="xs"
                onClick={() => {
                  changeModal.current!.showModal();
                }}
              >
                <IconMessagePlus size={15}></IconMessagePlus>
              </Button>
            </ChangeCardDialog>
            <Button
              variant="destructive"
              size="xs"
              onClick={async () => {
                if (await confirm("Wirklich löschen?")) removeCard(card.uuid);
              }}
            >
              <IconTrash size={15}></IconTrash>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

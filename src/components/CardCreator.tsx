import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { Container, NavBar } from "../routes/_with_navbar";
import { AddToAnkiButton } from "./AddToAnkiButton";
import { useCardsStore, useTemporalCardsStore } from "./AppZustand";
import { CardsList } from "./CardsList";
import { DeleteAllCardsButton } from "./DeleteAllCardsButton";
import { LoadingIndicator } from "./LoadingIndicator";
import { Button } from "./ui/button";

export const CardCreator: React.FunctionComponent = () => {
  const currentJobs = useCardsStore.use.currentJobs();
  const { futureStates, pastStates, redo, undo } = useTemporalCardsStore(
    (state) => state
  );

  useHotkeys("mod+z", () => undo());
  useHotkeys("mod+shift+z", () => redo());

  return (
    <>
      <NavBar>
        <div className="ml-auto"></div>
        <AddToAnkiButton></AddToAnkiButton>
        <DeleteAllCardsButton></DeleteAllCardsButton>
        <Button
          size="xs"
          variant="secondary"
          disabled={pastStates.length == 0}
          onClick={() => {
            undo();
          }}
        >
          <IconArrowBackUp size={15} />
        </Button>
        <Button
          size="xs"
          variant="secondary"
          disabled={futureStates.length == 0}
          onClick={() => {
            redo();
          }}
        >
          <IconArrowForwardUp size={15} />
        </Button>
      </NavBar>
      <Container>
        <AnimatePresence>
          {currentJobs.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <LoadingIndicator
                currentGenerations={currentJobs.length}
              ></LoadingIndicator>
            </motion.div>
          )}
        </AnimatePresence>

        <CardsList></CardsList>
      </Container>
    </>
  );
};

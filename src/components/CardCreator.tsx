
import { LoadingIndicator } from "./LoadingIndicator";
import { CardsList } from "./CardsList";
import { DeleteAllCardsButton } from "./DeleteAllCardsButton";
import { AnimatePresence, motion } from "framer-motion";
import { AddToAnkiButton } from "./AddToAnkiButton";
import { Container, NavBar } from "../routes/_with_navbar";
import {
  useCardsStore, useTemporalCardsStore
} from "./AppZustand";
import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";

export const CardCreator: React.FunctionComponent = () => {
  const currentJobs = useCardsStore.use.currentJobs();
  const { futureStates, pastStates, redo, undo } = useTemporalCardsStore(
    (state) => state
  );

  return (
    <>
      <NavBar>
        <div className="ml-auto"></div>
        <AddToAnkiButton></AddToAnkiButton>
        <DeleteAllCardsButton></DeleteAllCardsButton>
        <button
          className="btn btn-xs"
          disabled={pastStates.length == 0}
          onClick={() => {
            undo();
          }}
        >
          <IconArrowBackUp size={15} />
        </button>
        <button
          className="btn btn-xs"
          disabled={futureStates.length == 0}
          onClick={() => {
            redo();
          }}
        >
          <IconArrowForwardUp size={15} />
        </button>
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

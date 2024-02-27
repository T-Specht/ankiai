import { useEffect, useState } from "react";
import { generateCardsAI } from "../utils/card_chain";
import { useMutation } from "@tanstack/react-query";

import { LoadingIndicator } from "./LoadingIndicator";
import { CardsList } from "./CardsList";
import { DeleteAllCardsButton } from "./DeleteAllCardsButton";
import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { readText } from "@tauri-apps/api/clipboard";
import { AnimatePresence, motion } from "framer-motion";
import { AddToAnkiButton } from "./AddToAnkiButton";
import { Container, NavBar } from "../routes/_with_navbar";
import { useCardsStore, useSettingsStore } from "./AppContextProvider";

export const CardCreator: React.FunctionComponent = () => {

    const addCards = useCardsStore.use.addCards();
    const openAIKey = useSettingsStore.use.openAIKey();
    const promptTemplates = useSettingsStore.use.promptTemplates();
    const primaryLanguage = useSettingsStore.use.primaryLanguage();
    

  const [currentGenerations, setCurrentGenerations] = useState(0);

  const generateCards = useMutation({
    mutationFn: (data: { input: string; key: string }) => {
      return generateCardsAI(
        data.input,
        data.key,
        promptTemplates,
        primaryLanguage
      );
    },
    onMutate: () => {
      setCurrentGenerations((n) => n + 1);
    },
    onSuccess: (data) => {
      addCards(data);
    },
    onSettled: () => {
      setCurrentGenerations((n) => n - 1);
    },
  });

  useEffect(() => {
    const SHORTCUT = "CommandOrControl+Shift+K";

    unregister(SHORTCUT).then(() => {
      register(SHORTCUT, async () => {
        const clip = await readText();

        console.log(clip);

        const result = await generateCards.mutateAsync({
          input: clip!,
          key: openAIKey,
        });
        console.log(result);
        // Setting the results is done through handler
      });
    });

    return () => {
      unregister(SHORTCUT);
    };
  }, []);

  return (
    <>
      <NavBar>
        <div className="ml-auto"></div>
        <AddToAnkiButton></AddToAnkiButton>
        <DeleteAllCardsButton></DeleteAllCardsButton>
      </NavBar>
      <Container>
        <AnimatePresence>
          {generateCards.isPending && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <LoadingIndicator
                currentGenerations={currentGenerations}
              ></LoadingIndicator>
            </motion.div>
          )}
        </AnimatePresence>

        <CardsList></CardsList>
      </Container>
    </>
  );
};

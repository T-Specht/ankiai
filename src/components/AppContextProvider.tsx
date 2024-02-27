import { useLocalStorage } from "@uidotdev/usehooks";
import { createContext, useContext, useEffect, useState } from "react";
import { AICard, DEFAULT_PROMPT_TEMPLATES } from "../utils/card_chain";

type AppContextData = {
  openAIKey: string;
  cards: AICard[];
  onboardingComplete: boolean;
  promptTemplates: typeof DEFAULT_PROMPT_TEMPLATES;
  primaryLanguage: string;
};

type ReactStateAction<T> = React.Dispatch<React.SetStateAction<T>>;

type AppContextActions = {
  setOpenAIKey: ReactStateAction<string>;
  setCards: ReactStateAction<AICard[]>;
  changeCard: (uuid: string, updateField: Partial<AICard>) => unknown;
  addCards: (cards: AICard[]) => unknown;
  removeCard: (uuid: string) => unknown;
  setOnboardingComplete: ReactStateAction<boolean>;
  setPromptTemplates: ReactStateAction<typeof DEFAULT_PROMPT_TEMPLATES>;
  setPrimaryLanguage: ReactStateAction<string>;
};

type AppContextType = AppContextData & AppContextActions;

const AppContext = createContext<AppContextType | null>(null);

const LS_CARDS_KEY = "cards";

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) throw new Error("Ensure context provider");

  return context;
};

export const AppContextProvider = (props: { children: React.ReactNode }) => {
  const [openAIKey, setOpenAIKey] = useLocalStorage("key", "");
  const [onboardingComplete, setOnboardingComplete] = useLocalStorage(
    "onboarding-complete",
    false
  );

  const [promptTemplates, setPromptTemplates] = useLocalStorage(
    "prompt_templates",
    DEFAULT_PROMPT_TEMPLATES
  );
  const [primaryLanguage, setPrimaryLanguage] = useLocalStorage(
    "primary_lang",
    "German"
  );

  // useLocalStorage hook is too slow? Bug?
  const [cards, setCards] = useState<AICard[]>(() => {
    const val = localStorage.getItem(LS_CARDS_KEY);
    return val ? JSON.parse(val) : [];
  });

  useEffect(() => {
    localStorage.setItem(LS_CARDS_KEY, JSON.stringify(cards));
  }, [cards]);

  const contextData: AppContextData = {
    openAIKey,
    cards,
    onboardingComplete,
    promptTemplates,
    primaryLanguage,
  };
  const contextActions: AppContextActions = {
    setOpenAIKey,
    setOnboardingComplete,
    setPrimaryLanguage,
    setCards,
    addCards: (newCards) => {
      setCards((oldCards) => [...oldCards, ...newCards]);
    },
    changeCard: (uuid, fields) => {
      setCards((c) => {
        const clone = structuredClone(c);
        const cardIndex = clone.findIndex((c) => c.uuid == uuid);
        if (cardIndex >= 0) {
          const card = clone[cardIndex];
          clone[cardIndex] = { ...card, ...fields };
        }
        return clone;
      });
    },
    removeCard: (uuid) => {
      setCards((c) => {
        const clone = structuredClone(c);
        const cardIndex = clone.findIndex((c) => c.uuid == uuid);
        if (cardIndex >= 0) {
          clone.splice(cardIndex, 1);
        }
        return clone;
      });
    },
    setPromptTemplates,
  };

  return (
    <AppContext.Provider value={{ ...contextData, ...contextActions }}>
      {props.children}
    </AppContext.Provider>
  );
};

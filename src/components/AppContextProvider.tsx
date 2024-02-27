import { AICard, DEFAULT_PROMPT_TEMPLATES } from "../utils/card_chain";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { StoreApi, UseBoundStore } from "zustand";
import { produce } from "immer";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

type SetterFunction<T> = (input: T) => unknown;
interface SettingsStore {
  openAIKey: string;
  setOpenAIKey: SetterFunction<string>;
  promptTemplates: typeof DEFAULT_PROMPT_TEMPLATES;
  primaryLanguage: string;
  setPromptTemplates: SetterFunction<typeof DEFAULT_PROMPT_TEMPLATES>;
  setPrimaryLanguage: SetterFunction<string>;
  onboardingComplete: boolean;
  setOnboardingComplete: SetterFunction<boolean>;
}

export const useSettingsStoreBase = create<SettingsStore>()(
  persist(
    (set) => ({
      openAIKey: "",
      setOpenAIKey: (key) => set({ openAIKey: key }),
      primaryLanguage: "German",
      setPrimaryLanguage: (l) => set({ primaryLanguage: l }),
      promptTemplates: DEFAULT_PROMPT_TEMPLATES,
      setPromptTemplates: (p) => set({ promptTemplates: p }),
      onboardingComplete: false,
      setOnboardingComplete: (v) => set({ onboardingComplete: v }),
    }),
    {
      name: "zustand_settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSettingsStore = createSelectors(useSettingsStoreBase);

interface CardsStore {
  cards: AICard[];
  setCards: SetterFunction<AICard[]>;
  changeCard: (uuid: string, updateField: Partial<AICard>) => unknown;
  addCards: (cards: AICard[]) => unknown;
  removeCard: (uuid: string) => unknown;
}

export const useCardsStoreBase = create<CardsStore>()(
  persist(
    (set) => ({
      cards: [],
      setCards: (c) => set({ cards: c }),
      addCards: (c) =>
        set(
          produce((state: CardsStore) => {
            state.cards.push(...c);
            return state;
          })
        ),
      changeCard: (uuid, fields) =>
        set(
          produce((state: CardsStore) => {
            const cardIndex = state.cards.findIndex((c) => c.uuid == uuid);
            if (cardIndex >= 0) {
              const card = state.cards[cardIndex];
              state.cards[cardIndex] = { ...card, ...fields };
            }
            return state;
          })
        ),
      removeCard: (uuid) =>
        set(
          produce((state: CardsStore) => {
            const cardIndex = state.cards.findIndex((c) => c.uuid == uuid);
            if (cardIndex >= 0) {
              state.cards.splice(cardIndex, 1);
            }
            return state;
          })
        ),
    }),
    {
      name: "zustand_cards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useCardsStore = createSelectors(useCardsStoreBase);

import { AICard, DEFAULT_PROMPT_TEMPLATES } from "../utils/card_chain";
import { create, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { StoreApi, UseBoundStore } from "zustand";
import { TemporalState, temporal } from "zundo";
import deepEqual from "fast-deep-equal";
import { throttle } from "throttle-debounce";
import { immer } from "zustand/middleware/immer";

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

export interface CardJob {
  input: string;
  uuid: string;
  timestamp: number;
}

interface CardsStore {
  cards: AICard[];
  currentJobs: CardJob[];
  addJob(job: CardJob): unknown;
  removeJob(uuid: string): unknown;
  clearAllJobs(): unknown;
  setCards: SetterFunction<AICard[]>;
  changeCard: (uuid: string, updateField: Partial<AICard>) => unknown;
  addCards: (cards: AICard[]) => unknown;
  removeCard: (uuid: string) => unknown;
  removeCardAndAddChangedVersions: (uuid: string, cards: AICard[]) => unknown;
}

export const useCardsStoreBase = create<CardsStore>()(
  persist(
    temporal(
      immer((set) => ({
        cards: [],
        currentJobs: [],
        clearAllJobs: () =>
          set((state) => {
            state.currentJobs = [];
          }),
        addJob: (job) =>
          set((state) => {
            state.currentJobs.push(job);
          }),
        removeJob: (uuid) =>
          set((state) => {
            const index = state.currentJobs.findIndex((j) => j.uuid == uuid);
            if (index >= 0) state.currentJobs.splice(index, 1);
          }),

        setCards: (cards) => set({ cards }),
        addCards: (c) =>
          set((state) => {
            state.cards.push(...c);
          }),
        changeCard: (uuid, fields) =>
          set((state) => {
            const cardIndex = state.cards.findIndex((c) => c.uuid == uuid);

            if (cardIndex >= 0) {
              const card = state.cards[cardIndex];
              state.cards[cardIndex] = { ...card, ...fields };
            }
          }),
        removeCardAndAddChangedVersions: (uuid, cards) =>
          set((state) => {
            const cardIndex = state.cards.findIndex((c) => c.uuid == uuid);
            if (cardIndex >= 0) {
              state.cards.splice(cardIndex, 1);
            }
            state.cards.push(...cards);
          }),
        removeCard: (uuid) =>
          set((state) => {
            const cardIndex = state.cards.findIndex((c) => c.uuid == uuid);
            if (cardIndex >= 0) {
              state.cards.splice(cardIndex, 1);
            }
          }),
      })),
      {
        limit: 20,
        handleSet: (handleSet) =>
          throttle<typeof handleSet>(1000, (state) => {
            console.info("handleSet called throttle");
            handleSet(state);
          }),
        partialize: (state) => {
          // Only track cards
          const { cards } = state;
          return { cards };
        },
        equality(pastState, currentState) {
          const isEqual = deepEqual(pastState, currentState);
          //console.log("Equal", pastState, currentState, isEqual);

          return isEqual;
        },
        onSave(pastState, currentState) {
          console.log("history_save", pastState, currentState);
        },
      }
    ),
    {
      name: "zustand_cards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useTemporalCardsStore = <T,>(
  selector: (state: TemporalState<Partial<CardsStore>>) => T,
  equality?: (a: T, b: T) => boolean
) => useStore(useCardsStoreBase.temporal, selector, equality);

export const useCardsStore = createSelectors(useCardsStoreBase);

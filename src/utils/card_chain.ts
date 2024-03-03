import { ChatOpenAI } from "@langchain/openai";
import {
  RunnableSequence,
  RunnableRetry,
  RunnableMap,
  RunnablePick,
} from "@langchain/core/runnables";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { zodToJsonSchema } from "zod-to-json-schema";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { v4 as uuidv4 } from "uuid";

const PRINCING_SCHEMA_PER_1000 = {
  input: 0.0005,
  output: 0.0015,
};

export interface AccumulatedCosts {
  input: number;
  output: number;
  total: number;
}

const callbackCostCalc = [
  {
    handleLLMEnd(output: any) {
      const tokenUsage = output.llmOutput?.tokenUsage as {
        completionTokens: number;
        promptTokens: number;
        totalTokens: number;
      };

      console.log(tokenUsage);

      const inputCost =
        (tokenUsage.promptTokens * PRINCING_SCHEMA_PER_1000.input) / 1000;
      const outputCost =
        (tokenUsage.completionTokens * PRINCING_SCHEMA_PER_1000.output) / 1000;
      const totalCost = inputCost + outputCost;

      let accumulatedCosts = JSON.parse(
        localStorage.getItem("accumulatedCosts") ||
          '{"input": 0, "output": 0, "total": 0}'
      );
      let addedAccumulatedCosts = {
        input: accumulatedCosts.input + inputCost,
        output: accumulatedCosts.output + outputCost,
        total: accumulatedCosts.total + totalCost,
      };

      localStorage.setItem(
        "accumulatedCosts",
        JSON.stringify(addedAccumulatedCosts)
      );
    },
  },
];

// Before 14,55$

export const DEFAULT_PROMPT_TEMPLATES = {
  summary: `Create a structured overview with every fact and detail in the user input. Think step by step and use bullet points. The language must be {language}.`,
  newCards: `Follow these instructions precisely:\n- Create flashcards for a university level exam.\n- Each card is standalone: make sure that the question is specific and unambiguous.\n- The question must contain a reference to the overarching topic\n- The answers must be on the back and must not be included in the question.\n- Answers must be formatted as bullet points\n- use markdown in the answers to highlight important facts in bold text\n- Questions and answers must be in {language}\n- Create cards for every important fact\n- Create open-ended questions; avoid questions that can be answered with just yes or no\n\nThe ouput language is {language}.`,
  updateCardChangeRequest: `Change the generated card: {change_request}\nThe ouput language is {language}.`,
};

const cardsSchema = z.object({
  topic: z.string().describe("Überthema der Karten als maximal 1 Wort"),
  cards: z.array(
    z.object({
      front: z.string().describe("front of flashcard"),
      back: z.string().describe("back of flashcard with bullet points"),
    })
  ),
});

export const stringToAnkiCardsAsChat = async (
  input: string,
  key: string,
  prompt_templates: typeof DEFAULT_PROMPT_TEMPLATES,
  language: string
) => {
  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0125",
    callbacks: callbackCostCalc,
    openAIApiKey: key,
    //modelName: "gpt-4-0125-preview",
    temperature: 0.05,
    timeout: 30 * 1000, // 1 minute timeout,
  });

  const summaryPrompt = ChatPromptTemplate.fromMessages([
    ["system", prompt_templates.summary],
    // [
    //   "system",
    //   `Create a summary with all the facts and details in this text. Create bullet points. The input and output language is ${language}.`,
    // ],
    ["user", `{input}`],
  ]);

  const createCardsPrompt = ChatPromptTemplate.fromMessages([
    // [
    //   "system",
    //   `- Erstelle Karteikarten für eine Prüfung auf Universitätsniveau.
    //   - Jede Karte ist für sich allein stehend: Achten Sie darauf, dass die Frage spezifisch und unmissverständlich ist.
    //   - Die Frage soll einen Hinweis auf das Überthema enthalten
    //   - Die Antworten sollten auf der Rückseite stehen und nicht in der Frage enthalten sein.
    //   - Antworten müssen als Stichpunkte formuliert sein
    //   - Du verwendest Markdown in den Antworten, um Text z.B. fett zu formartieren
    //   - Fragen und Antworten müssen auf Deutsch sein.
    //   - Erstelle Karten für alle wichtigen Punkte
    //   - Erstelle offene Fragen; vermeide also Fragen, die mit Ja oder Nein beantwortet werden können`,
    // ],
    ["system", prompt_templates.newCards],
    ["user", `{facts}`],
  ]);

  const chain = new RunnableMap({
    steps: {
      inputString: new RunnablePick("input"),
      facts: RunnableSequence.from([
        summaryPrompt,
        llm,
        new StringOutputParser(),
      ]),
      language: new RunnablePick("language"),
    },
  }).assign({
    result: RunnableSequence.from([
      createCardsPrompt,
      llm.bind({
        functions: [
          {
            name: "flashcards",
            description: "always use this function to format the output",
            parameters: zodToJsonSchema(cardsSchema),
          },
        ],
        function_call: {
          name: "flashcards",
        },
      }),
      new JsonOutputFunctionsParser(),
    ]),
  });

  const result = await new RunnableRetry({
    bound: chain,
    config: {},
    maxAttemptNumber: 3,
  }).invoke({
    input,
    language,
  });

  return result as {
    facts: string;
    result: z.infer<typeof cardsSchema>;
    inputString: string;
  };
};

export const generateCardsAI = async (
  input: string,
  key: string,
  prompt_templates = DEFAULT_PROMPT_TEMPLATES,
  language: string,
  SPLIT_OPTIONS = {
    chunkSize: 5000, // tested 2000
    chunkOverlap: 300, // tested 200
  }
) => {
  //console.log(decks);
  const timestamp = Date.now();

  const splitter = new RecursiveCharacterTextSplitter({
    ...SPLIT_OPTIONS,
    separators: ["\n\n"],
  });

  const docs = await splitter.splitText(input);

  const cards = await Promise.all(
    docs.map(
      async (d) =>
        await stringToAnkiCardsAsChat(d, key, prompt_templates, language)
    )
  );

  return cards
    .map((d) =>
      d.result.cards.map((c) => ({
        ...c,
        uuid: uuidv4(),
        deck: d.result.topic,
        facts: d.facts,
        inputString: d.inputString,
        timestamp,
      }))
    )
    .flat();
};

export type AICard = Awaited<ReturnType<typeof generateCardsAI>>[0];

export const updateAnkiCard = async (
  card: AICard,
  changeRequest = "Retry with another formulation",
  key: string,
  prompt_templates = DEFAULT_PROMPT_TEMPLATES,
  language: string
) => {
  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0125",
    openAIApiKey: key,
    verbose: true,
    //modelName: "gpt-4-0125-preview",
    temperature: 0.05,
    timeout: 30 * 1000, // 1 minute timeout,
  });

  const temp = ChatPromptTemplate.fromMessages([
    ["system", prompt_templates.summary],
    ["user", "{facts}"],
    ["ai", `{card}`],
    ["user", prompt_templates.updateCardChangeRequest],
  ]);

  const chain = RunnableSequence.from([
    temp,
    llm.bind({
      functions: [
        {
          name: "flashcards",
          description: "always use this function to format the output",
          parameters: zodToJsonSchema(cardsSchema),
        },
      ],
      function_call: {
        name: "flashcards",
      },
    }),
    new JsonOutputFunctionsParser(),
  ]).withRetry({
    stopAfterAttempt: 3,
  });

  const frontBack = { front: card.front, back: card.back };

  const result = (await chain.invoke({
    facts: card.facts,
    card: JSON.stringify(frontBack),
    change_request: changeRequest,
    language,
  })) as z.infer<typeof cardsSchema>;

  return result.cards.map((c) => ({
    ...c,
    deck: result.topic,
    facts: card.facts,
    inputString: card.inputString,
    timestamp: card.timestamp,
    uuid: uuidv4(),
    modifications: {
      timestamp: Date.now(),
      changeRequest: changeRequest,
      previousVersion: { ...frontBack, uuid: card.uuid },
    },
  }));
};

export type ChangedAICards = Awaited<ReturnType<typeof updateAnkiCard>>;

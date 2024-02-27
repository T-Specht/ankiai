import axios, { AxiosRequestConfig } from "axios";
import { micromark } from "micromark";

export async function invokeAnki<T>(action: string, params = {}, version = 6) {
  let data = JSON.stringify({
    version,
    action,
    params,
  });

  let config: AxiosRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8765",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios.request<T>(config).then((d) => d.data);
}



export async function findModelsByName(name: string) {
  return invokeAnki<{
    result: Array<{
      id: number;
      name: string;
      type: number;
      mod: number;
      usn: number;
      sortf: number;
      did: any;
      tmpls: Array<{
        name: string;
        ord: number;
        qfmt: string;
        afmt: string;
        bqfmt: string;
        bafmt: string;
        did: any;
        bfont: string;
        bsize: number;
        id: number;
      }>;
      flds: Array<{
        name: string;
        ord: number;
        sticky: boolean;
        rtl: boolean;
        font: string;
        size: number;
        description: string;
        plainText: boolean;
        collapsed: boolean;
        excludeFromSearch: boolean;
        id: number;
        tag: any;
        preventDeletion: boolean;
      }>;
      css: string;
      latexPre: string;
      latexPost: string;
      latexsvg: boolean;
      req: Array<[number, string, Array<number>]>;
      originalStockKind: number;
    }>;
    error: any;
  }>("findModelsByName", {
    modelNames: [name],
  });
}

export async function addAnkiNotes(
  notes: { front: string; back: string }[],
  deckName: string
) {
  type NotePayload = {
    deckName: string;
    modelName: string;
    fields: {
      Front: string;
      Back: string;
    };
    options?: Partial<{
      allowDuplicate: boolean;
      duplicateScope: string;
      duplicateScopeOptions: {
        deckName: string;
        checkChildren: boolean;
        checkAllModels: boolean;
      };
    }>;
    tags?: Array<string>;
    audio?: Array<{
      url: string;
      filename: string;
      skipHash: string;
      fields: Array<string>;
    }>;
    video?: Array<{
      url: string;
      filename: string;
      skipHash: string;
      fields: Array<string>;
    }>;
    picture?: Array<{
      url: string;
      filename: string;
      skipHash: string;
      fields: Array<string>;
    }>;
  };

  const processedNotes = notes.map(
    (n) =>
      ({
        deckName,
        modelName: "Basic GPT",
        fields: {
          Front: micromark(n.front),
          Back: micromark(n.back),
        },
        options: {
          allowDuplicate: false,
          duplicateScope: "deck",
          duplicateScopeOptions: {
            deckName: "Default",
            checkChildren: false,
            checkAllModels: false,
          },
        },
        tags: ["ai"],
      }) satisfies NotePayload
  );

  return invokeAnki<{
    result: (number | null)[];
    error: unknown;
  }>("addNotes", { notes: processedNotes });
}

export async function getAnkiAPIVersion() {
  return invokeAnki<{
    result: number;
    error: unknown;
  }>("version");
}

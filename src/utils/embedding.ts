import "@tensorflow/tfjs-node";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { IContextVector } from "../types/types.interface";

export const createEmbedding = async (text: string[]) => {
  const model = await use.load();
  const vector = await model.embed(text);
  const array = await vector.array();
  return array;
};

export const cosineSimilarity = (vecA: number[], vecB: number[]) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

export const textToVector = async (text: string) => {
  const processedText = await preProcessTextToChunk(text);

  const vector = await createEmbedding(processedText);

  const contextVectors: IContextVector[] = [];

  for (let i = 0; i < vector.length; i++) {
    contextVectors.push({ vector: vector[i], text: processedText[i] });
  }

  return contextVectors;
};

export const preProcessTextToChunk = async (text: string) => {
  const maxChunks = 800;

  const textFormatted = text.toLowerCase().trim();

  const splitter = new RecursiveCharacterTextSplitter({
    separators: ["\n\n"],
    chunkSize: maxChunks,
    chunkOverlap: 100,
    lengthFunction: (text: string) => text.length,
  });

  const chunks = await splitter.splitText(textFormatted);

  return chunks.map((e) => e.replace(/\n/g, " "));
};

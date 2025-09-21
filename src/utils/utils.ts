import { IContext, IContextVector } from "../types/types.interface";
import { loadEmbeddingFromDB } from "./db";
import { cosineSimilarity, textToVector } from "./embedding";

export const SearchResult = async (question: string, filename: string) => {
  const questionVector = await textToVector(question);

  const embeddings = (await loadEmbeddingFromDB(filename)) as IContextVector[];

  const scores: IContext[] = [];
  console.log("Calculating Similarity....");
  for (const [i, embedding] of embeddings.entries()) {
    const score = cosineSimilarity(embedding.vector, questionVector[0].vector);
    scores.push({ index: i, score: score!, text: embedding.text });
  }

  const getCorrespondingResult = scores
    .sort((a, b) => b.score - a.score)
    .map((e) => ({
      score: e.score,
      text: embeddings[e.index!].text,
    }));

  return getCorrespondingResult.slice(0, 5);
};

export interface IContext {
  index?: number;
  text: string;
  score: number;
}

export interface IContextVector {
  vector: number[];
  text: string;
}

import fs from "fs";
import path from "path";
import { IContextVector } from "../types/types.interface";

export const getBooksActive = async () => {
  const pathDir = path.resolve(__dirname, "../../data/input");
  const files = fs.readdirSync(pathDir);
  const fileName = files.map((file) => file.split(".")[0] + "-embedding.json");

  const existFiles = fileName.map((file) => {
    if (fs.existsSync(path.resolve(__dirname, `../../data/output/${file}`))) {
      return file;
    }
    return null;
  });

  return existFiles.filter((file) => file !== null);
};

export const loadEmbeddingFromDB = async (filename: string) => {
  const pathDir = path.resolve(__dirname, `../../data/output/${filename}`);
  const data = fs.readFileSync(pathDir, "utf8");
  return JSON.parse(data);
};

export const saveEmbeddingToDB = async (
  embeddingsValue: IContextVector[],
  filename: string
) => {
  const pathDir = path.resolve(__dirname, `../../data/output/${filename}`);

  if (fs.existsSync(pathDir)) {
    console.log("Embedding already exists, skipping...");
    return;
  }

  return await new Promise((resolve) => {
    fs.createWriteStream(pathDir)
      .on("ready", () => {
        fs.writeFileSync(pathDir, JSON.stringify(embeddingsValue));
        console.log("Embedding saved successfully");
        resolve(true);
      })
      .on("error", (err) => {
        throw err;
      });
  });
};

import path from "path";
import fs from "fs";
import { textToVector } from "./utils/embedding";
import { saveEmbeddingToDB } from "./utils/db";
const pdfParser = require("pdf-parse");

const getArgs = () => {
  const args = process.argv.slice(2);

  const filename = args.find((arg) => arg.includes("--f"));

  if (!filename) {
    throw new Error("Filename is required");
  }

  const filename_ = filename.split("=")[1];

  if (filename_.split(".")[1] !== "pdf") {
    throw new Error("Invalid file name");
  }

  return filename_;
};

const LoadFile = async (filename: string) => {
  const dir = path.join(__dirname, `../data/input/${filename}`);

  if (!fs.existsSync(dir)) {
    throw new Error("File not found");
  }

  const pdfFile = fs.readFileSync(dir);

  const pdf = await pdfParser(pdfFile);

  const numOfPage = pdf.numpages;
  const numOfRenderedPage = pdf.numrender;

  if (numOfPage !== numOfRenderedPage) {
    throw new Error("Faild to parse pdf");
  }

  return pdf.text as string;
};

const StartProgram = async () => {
  const filename = getArgs();

  const pdfRawText = await LoadFile(filename);

  console.log(`-------------********-----------`);
  console.log(`\n\n------ Creating vector embeddings -----\n\n`);
  console.log(`-------------********-----------`);
  //create a vector for raw text
  const vectors = await textToVector(pdfRawText);

  //save vectors

  const success = await saveEmbeddingToDB(
    vectors,
    `${filename.split(".")[0]}-embedding.json`
  );
  if (!success) {
    throw new Error("Failed to save embedding");
  }
  console.log(`-------------********-----------`);
  console.log(
    `\n\n------ Saved Embedding to ${
      filename.split(".")[0]
    }-embedding.json -----\n\n`
  );
  console.log(`-------------********-----------`);
  process.exit(0);
};

StartProgram();

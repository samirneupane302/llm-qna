import { SearchResult } from "./utils/utils";
import { SearchLLM } from "./utils/LLM";
import prompt from "prompt";
import { getBooksActive } from "./utils/db";

async function getResult(question: string, filename: string) {
  const result = await SearchResult(question, filename);
  const llmResult = await SearchLLM(question, result);
  return llmResult;
}

prompt.start();

const PromtPolling = async () => {
  const selectedBook = await getBooksActive();

  console.log("\nAvailable books:");

  selectedBook.forEach((book, index) => {
    console.log(`${index + 1}. ${book.replace("-embedding.json", "")}`);
  });

  const { bookNumber } = await prompt.get({
    properties: {
      bookNumber: {
        description: "Enter book number to select",
        pattern: /^[0-9]+$/,
        message: "Book number must be a number",
        required: true,
        conform: function (value) {
          const num = parseInt(value);
          return num > 0 && num <= selectedBook.length;
        },
      },
    },
  });

  const selectedBookIndex = parseInt(bookNumber as string) - 1;
  console.log(
    `\nSelected book: ${selectedBook[selectedBookIndex].replace(
      "-embedding.json",
      ""
    )}\n`
  );

  prompt.get(["question"], async function (err, result: { question: string }) {
    if (err) {
      return console.error(err);
    }

    const question = result.question;

    console.log("\n\n🧑 =====> ", question);

    let answer = (await getResult(
      question,
      selectedBook[selectedBookIndex]
    )) as null | string;

    if (!answer) {
      answer = '{"type":"answer","data":"LLM faild to answer the question"}';
    }

    const answerObject = JSON.parse(answer!) as {
      type: "answer";
      data: string;
    };

    console.log(`--------- ***** --------`);
    console.log("\n\n🤖 ====>  ", answerObject.data);
    console.log(`\n\n--------- ***** --------`);
    setTimeout(() => {
      PromtPolling();
    }, 1000);
  });
};
PromtPolling();

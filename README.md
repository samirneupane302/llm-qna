# LLM Q&A Agent in Node.js

A TypeScript-based intelligent question-answering system that processes PDF documents using vector embeddings and Large Language Models (LLMs) to provide accurate, context-aware responses.

## 🎯 Overview

This project creates a semantic search and question-answering system that:

- Processes PDF documents and converts them into vector embeddings
- Uses TensorFlow Universal Sentence Encoder for text embedding
- Performs similarity search using cosine similarity
- Leverages OpenAI GPT-4o-mini via OpenRouter for intelligent responses
- Provides an interactive CLI interface for querying documents

## 🏗️ Architecture

### Core Components

1. **Document Processing** (`src/create-embedding.ts`)

   - Parses PDF files using `pdf-parse`
   - Splits text into manageable chunks with overlap
   - Generates vector embeddings using Universal Sentence Encoder
   - Stores embeddings as JSON files

2. **Vector Search** (`src/utils/utils.ts`)

   - Computes cosine similarity between query and document embeddings
   - Returns top 5 most relevant text chunks
   - Ranks results by similarity score

3. **LLM Integration** (`src/utils/LLM.ts`)

   - Uses OpenRouter API to access OpenAI GPT-4o-mini
   - Provides context-aware responses based on retrieved document chunks
   - Structured prompt engineering for accurate answers

4. **Interactive Interface** (`src/index.ts`)
   - CLI-based book selection and querying
   - Continuous question-answer loop
   - User-friendly book management

### Data Flow

```
PDF Document → Text Extraction → Text Chunking → Vector Embedding → Storage
                                                                       ↓
User Question → Query Embedding → Similarity Search → Context Retrieval → LLM Response
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (via OpenRouter)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/samirneupane302/llm-qna.git
   cd llm-qna
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openrouter_api_key_here
   ```

4. **Prepare your documents**
   - Place PDF files in the `data/input/` directory
   - Supported format: PDF files only

### Usage

#### Step 1: Create Embeddings

Generate vector embeddings for your PDF documents:

```bash
npm run create -- --f=filename.pdf
```

**Example:**

```bash
npm run create -- --f=social.pdf
```

This command will:

- Parse the PDF file
- Split text into chunks (800 characters with 100-character overlap)
- Generate vector embeddings using Universal Sentence Encoder
- Save embeddings to `data/output/filename-embedding.json`

#### Step 2: Start the Q&A Session

Launch the interactive question-answering interface:

```bash
npm start
```

The application will:

1. Display available books (PDFs with existing embeddings)
2. Allow you to select a book by number
3. Enter a continuous Q&A loop where you can ask questions about the selected document

**Example Session:**

```
Available books:
1. social
2. white-paper

Enter book number to select: 1

Selected book: social

prompt: question: What is social media marketing?

🧑 =====> What is social media marketing?
Calculating Similarity....
--------- ***** --------

🤖 ====>  Social media marketing is a digital marketing strategy that involves creating and sharing content on social media platforms to achieve marketing and branding goals...

--------- ***** --------
```

## 🔧 Configuration

### Environment Variables

| Variable         | Description                                    | Required |
| ---------------- | ---------------------------------------------- | -------- |
| `OPENAI_API_KEY` | OpenRouter API key for accessing OpenAI models | Yes      |

### Model Configuration

The system uses OpenAI GPT-4o-mini via OpenRouter with the following settings:

- **Model**: `openai/gpt-4o-mini`
- **Max Tokens**: 1000
- **Temperature**: 0.5
- **Base URL**: `https://openrouter.ai/api/v1`

### Text Processing Settings

- **Chunk Size**: 800 characters
- **Chunk Overlap**: 100 characters
- **Text Splitter**: Recursive Character Text Splitter
- **Separators**: Double newlines (`\n\n`)

## 🛠️ Development

### Available Scripts

- `npm start` - Run the Q&A application
- `npm run create` - Generate embeddings for PDF files
- `npm test` - Run tests (not implemented)

### Building the Project

```bash
npx tsc
```

Compiled JavaScript files will be output to the `dist/` directory.

## 🔍 How It Works

### 1. Document Processing

- PDFs are parsed and converted to plain text
- Text is split into overlapping chunks for better context preservation
- Each chunk is converted to a 512-dimensional vector using Universal Sentence Encoder

### 2. Query Processing

- User questions are converted to vector embeddings using the same encoder
- Cosine similarity is calculated between the query vector and all document vectors
- Top 5 most similar chunks are selected as context

### 3. Response Generation

- Selected context chunks are formatted and sent to GPT-4o-mini
- The LLM generates a natural language response based on the provided context
- Responses are structured as JSON with type and data fields

### 4. Continuous Interaction

- The system maintains a session loop for multiple questions
- Users can switch between different documents
- All interactions are logged to the console

## 🙏 Technology

- **TensorFlow.js** for Universal Sentence Encoder
- **LangChain** for text splitting utilities
- **OpenRouter** for LLM API access
- **pdf-parse** for PDF processing

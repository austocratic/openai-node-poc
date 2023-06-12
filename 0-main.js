
import { PineconeClient } from "@pinecone-database/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import * as dotenv from "dotenv";
import { createPineconeIndex } from "./1-createPineconeIndex.js";
import { updatePinecone } from "./2-updatePinecone.js";
import { queryPineconeVectorStoreAndQueryLLM } from "./3-queryPineconeAndQueryGPT.js";

// 1. Load environment variables
dotenv.config();

// 2. Set up DirectoryLoader to load documents from the ./documents directory
const loader = new DirectoryLoader("./documents", {
    ".txt": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
});

const docs = await loader.load();

// 3. Variable for the prompt
const question = "Output a summary of the product warranty terms in English"

const indexName = "ts-reader";
const vectorDimension = 1536;

// 4. Initialize Pinecone client with API key and environment
const client = new PineconeClient();

await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

// 5. Main execution
(async () => {

// 5.1. Check if Pinecone index exists and create if necessary
  //await createPineconeIndex(client, indexName, vectorDimension);

// 5.2. Update Pinecone vector store with document embeddings
   //await updatePinecone(client, indexName, docs);

// 5.3. Query Pinecone vector store and GPT model for an answer
  await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
})();

import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { createPineconeIndex } from "./createPineconeIndex.js";
import { updatePinecone } from "./updatePinecone.js";
import { queryPineconeVectorStoreAndQueryLLM } from "./queryPineconeAndQueryGPT.js";

// 1. Load environment variables
dotenv.config();

// 3. Variable for the prompt
const question = "Summarize the product warranty terms"

//Nonsense question for testing
//const question = "jfhgasfkhadskfhasdfk;adshfjhadsljfhdsakfaskjdfhasdjkfhasdj,fjkasdfkjasdfjkafdkjadskfjasdkjbfj,adsvm,d,,d,,"

const indexName = "ts-reader";

// 4. Initialize Pinecone client with API key and environment
const client = new PineconeClient();

await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

// 5. Main execution
(async () => {

// 5.1. Check if Pinecone index exists and create if necessary
  //await createPineconeIndex(client, indexName);

// 5.2. Update Pinecone vector store with document embeddings
   //await updatePinecone(client, indexName);

// 5.3. Query Pinecone vector store and GPT model for an answer
  await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);

  console.log(`Finished executing index.js`)
})();
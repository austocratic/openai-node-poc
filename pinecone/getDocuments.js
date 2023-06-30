
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

//This class was not used in the tutorial, but is referenced on https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone
import { PineconeStore } from "langchain/vectorstores/pinecone";

export const getDocuments = async (
  client,
  indexName,
  question,
  pineconeFilter
) => {

  console.log("Querying Pinecone vector store...");

  //The client variable is instantiated from: new PineconeClient();
  // Retrieve the Pinecone index
  const pineconeIndex = client.Index(indexName);

  console.log(`Using OpenAI to create embeddings for question: ${question}...`);

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  const queryResponse = await vectorStore.similaritySearchWithScore(
    question, 
    10, //Max docs to return 
    // Metadata
    pineconeFilter
  );

  return queryResponse
};



  
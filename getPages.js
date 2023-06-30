
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

//This class was not used in the tutorial, but is referenced on https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone
import { PineconeStore } from "langchain/vectorstores/pinecone";

export const getPages = async (
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

  //Maybe we should fetch the appropriate documents from Pinecone, then perform index search in memory using something like:
  // Load the docs into the vector store
  /*
  const vectorStore = await MemoryVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings()
  );*/
  
  //Setup Pinecone to be the vector store. COnfigure it to use openAI to handle embedding the query

  //Do we need to call asRetriever() to actually use teh vector store as a retriever?
  //https://js.langchain.com/docs/modules/indexes/retrievers/vectorstore

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  //Format is array of Document objects
  //https://js.langchain.com/docs/modules/indexes/vector_stores
  //We could also try similaritySearchWithScore which returns a similarity score
  /*
  const queryResponse = await vectorStore.similaritySearch(
    question, 
    6, //Max docs to return 
    // Metadata
    pineconeFilter
  );*/

  const queryResponse = await vectorStore.similaritySearchWithScore(
    question, 
    10, //Max docs to return 
    // Metadata
    pineconeFilter
  );

  return queryResponse
};



  
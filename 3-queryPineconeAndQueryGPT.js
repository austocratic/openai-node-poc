
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";

export const queryPineconeVectorStoreAndQueryLLM = async (
  client,
  indexName,
  question
) => {
// 1. Start query process
console.log("Querying Pinecone vector store...");
// 2. Retrieve the Pinecone index
const index = client.Index(indexName);

// 3. Create query embedding
const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
  
// 4. Query Pinecone index and return top 10 matches
  let queryResponse = await index.query({
    queryRequest: {
      topK: 5, //maximum number of matches
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
      filter: {"model":"GNE27JYMFS"} //Hard coded only one model number for first test
    },
  });

  console.log(`Found ${queryResponse.matches.length} matches...`);

  console.log(`Asking question: ${question}...`);
  if (queryResponse.matches.length) {
// 5. Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({});
    const chain = loadQAStuffChain(llm);
// 6. Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata.pageContent)
      .join(" ");
// 7. Execute the chain with input documents and question
    const result = await chain.call({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: question,
    });
    console.log(`Answer: ${result.text}`);
  } else {
// 8. Log that there are no matches, so GPT-3 will not be queried
    console.log("Since there are no matches, GPT-3 will not be queried.");
  }
};
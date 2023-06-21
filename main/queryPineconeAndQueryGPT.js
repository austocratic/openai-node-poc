

import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { getPages } from "../getPages.js";

export const queryPineconeVectorStoreAndQueryLLM = async (
  client,
  indexName,
  question
) => {

  //Filters to use in Pinecone metadata
  const pineconeFilter = {
    "model":"LRSDS2706D"
  }

  //Output: concatenated string of content from Pinecone 
  //Use openAI to create embedding of question, query pinecone, concatenate results into single string and return
  const concatenatedPageContent = await getPages(  
    client,
    indexName,
    question,
    pineconeFilter
  );

  //If there are Pinecone results proceed with LLM query
  if (concatenatedPageContent){
    console.log(`Found results from Pinecone. Calling LLM....`)
    // Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({
      //temperature: 0.9 //Optional temperature setting
    });
    // Create the Langchain. "QA" means Question, Answer
    const chain = loadQAStuffChain(llm);

    // Execute the chain with input documents and question
    //.call is a convenient version of .generate but only takes a single string prompt
    /*
    const result = await chain.call({
        input_documents: [new Document({ 
          pageContent: concatenatedPageContent
          //metadata: //optional field for other info about the document
        })],
        question: question
      });*/

      const result = await chain.call({
        input_documents: concatenatedPageContent,
        question: question
      });

      //Here is a version where input_documents is already array of DOcuments

      console.log(`Answer: ${result.text}`)
  
    return;
  } else {
    console.log(`Empty pagecontent from Pinecone, skipping LLM query...`)
  }
};
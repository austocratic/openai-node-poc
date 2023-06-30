
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { getDocuments } from '../pinecone/getDocuments.js'
import { prompts } from '../prompts.js'


export const warrantySummaryController = async (req, res) => {
  console.log('calling warrantySummaryController')
  const model = req.params.model;

  const indexName = "ts-reader";

  //TODO, Need to add a validation that the model # passed in is supported
  /* Old way to get the model
  const pineconeFilter = {
    //"model":"GNE27JYMFS"
    //"model":"JGBS60DEKCC"
    //"model":"JKS3000SNSS"
    //"model":"LDF5545ST"
    "model":"LFXS26973S"
    //"model":"LRSDS2706D"
    //"model":"PDT145SSLSS"
    //"model":"WF45T6000AW"
    //"model":"WM3400CW"
  }*/

  //Use value passed into URL
  const pineconeFilter = {
    "model": model
  }

  //Output: array of Document objects
  const documents = await getDocuments(  
    req.client,
    indexName, //TODO maybe move this to env variable or somewhere else?
    prompts.warrantySummary.pinecone,
    pineconeFilter
  );

  //If there are Pinecone results proceed with LLM query
  if (documents){
    console.log(`Found results from Pinecone. Calling LLM....`)
    // Create an OpenAI instance and load the QAStuffChain
    
    const llm = new OpenAI({
      temperature: 0.1 //Optional temperature setting
    });
    // Create the Langchain. "QA" means Question, Answer
    const chain = loadQAStuffChain(llm, {
      // verbose true shows lots of chain output
      // https://js.langchain.com/docs/api/chains/interfaces/StuffQAChainParams
      verbose: true
    });

    const result = await chain.call({
      input_documents: documents,
      question: prompts.warrantySummary.llm
    });

    console.log(`Reached the end of warrantySummaryController, returning result`)
    res.send(`Result: ${result.text}`);
  
  return;

  } else {
    console.log(`Empty pagecontent from Pinecone, skipping LLM query...`)
    res.send(`No results found in Pinecone, skipping LLM`)
  }


  
}



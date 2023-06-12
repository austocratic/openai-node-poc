


# openai-node-poc

Proof of Concept LLM implementation in Nodejs using langchain, Pinecone, and OpenAI

The code is based on this tutorial, but can be refactored to meet our needs: https://www.youtube.com/watch?v=CF5buEVrYwo

## Setup

1. Create a .env file in the root of the project and add keys for these environment variables:
    - OPENAI_API_KEY
    - PINECONE_API_KEY
    - PINECONE_ENVIRONMENT
2. Install dependencies

## Executing

1. Comment or uncomment the necessary functions from main.js:
    - createPineconeIndex(client, indexName, vectorDimension) - **Execute this if you need a new Pinecone index**
    - updatePinecone(client, indexName, docs) - **Execute this to vectorize all the files in the /documents folder**
    - queryPineconeVectorStoreAndQueryLLM(client, indexName, question) - **Query the vector store**
2. Adjust the prompt in main.js: **const question**
3. Run **npm start**

## Other file loaders

Currently, the code supports .txt & .pdf files. But other file loading is available:
https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/








// Additional enhancements
// 1) Create API layer for taking a REST call with a model parameter
// 2) Model validation: If model does not exist return a message
// 3) Prepare the prompt:
  // 3.1) Set the language (how do we can the language)
  // 3.2) Use the model # in the query


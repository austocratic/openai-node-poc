



//Langchain automatically adds this to the prompt: "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer."
//Therefore the .llm version of the prompt will also include associated documents from Pinecone
//The .pinecone version of the prompt will be used to find the context from Pinecone

export const prompts = {
  warrantySummary: {
    pinecone: `English only. Limited warranty details. Warranty period. Terms and conditions of the warranty.`,
    llm: `Create a list of details about the limited warranty period. Each item in the list should include the length of that warranty period and explain the terms of that warranty.`
  },
  iceBinOperation: {
    pinecone: `English only. Ice maker. Operating instructions`,
    llm: `Create a list information about operating the ice maker.`
  },
  troubleshooting: {
    detergentInCup: {
      pinecone: `English only. Troubleshooting. Detergent in cup`,
      llm: `What is the possible cause and what should I do if there is detergent left in dispenser cups?`
    },
  } 
}



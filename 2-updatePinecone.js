
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


export const updatePinecone = async (client, indexName, docs) => {
  console.log("Retrieving Pinecone index...");
// 1. Retrieve Pinecone index
  const index = client.Index(indexName);
  console.log(`Pinecone index retrieved: ${indexName}`);

// 2. Process each document in the docs array
  for (const doc of docs) {
    console.log(`Processing document: ${doc.metadata.source}`);
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    console.log("Splitting text into chunks...");
// 3. Split text into chunks (documents)
    const chunks = await textSplitter.createDocuments([text]);
    console.log(`Text split into ${chunks.length} chunks`);
    console.log(
      `Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks ...`
    );
// 4. Create OpenAI embeddings for documents
    const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
    );
    console.log("Finished embedding documents");
    console.log(
      `Creating ${chunks.length} vectors array with id, values, and metadata...`
    );

//5. Extract the model # from the file name. This is only for POC. Likely better way to get model #
    const applianceModel = getModel(doc.metadata.source);
    console.log(`Got appliance model ${applianceModel}`)

// 6. Create and upsert vectors in batches of 100
    const batchSize = 100;
    let batch = [];
    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];
      const vector = {
        id: `${txtPath}_${idx}`,
        values: embeddingsArrays[idx],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          txtPath: txtPath,
          model: applianceModel //Custom metadata value to save the model #
        },
      };
      batch.push(vector);
      // When batch is full or it's the last item, upsert the vectors
      if (batch.length === batchSize || idx === chunks.length - 1) {
        await index.upsert({
          upsertRequest: {
            vectors: batch,
          },
        });
        // Empty the batch
        batch = [];
      }
    }
    console.log(`Pinecone index updated with ${chunks.length} vectors`);
  }
};

// Helper function to get the file name out of the source
// Likely a better way to do this in the future.
const getModel = source => {
  const sourceSplit = source.split("/");
  const lastElement = sourceSplit.slice(-1)
  return lastElement[0].split(".")[0]
}
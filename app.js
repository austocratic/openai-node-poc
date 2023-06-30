
//GPT related imports
import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";

// Routing imports
import express from "express";
import routes from './routes.js';

//GPT Stuff
// Load environment variables
dotenv.config();

// Initialize Pinecone client with API key and environment
const client = new PineconeClient();

await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to attach the client to the request
app.use((req, res, next) => {
  req.client = client;
  next();
});

//Access reuest body as req.body
app.use(express.json())

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server started lstening on port: ${PORT}`)
})
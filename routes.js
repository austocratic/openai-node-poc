

import express from "express";
import { warrantySummaryController } from './controllers/warrantySummaryController.js';

const router = express.Router();



router.get("/warranty/summary/:model", warrantySummaryController)

//For testing
router.get("/ping", (req, res) => {
  return res.send({
      status: "Healthy"
  })
});

//Fallback.
router.use((req, res, next)=>{
  res.json({ 
    error: `No route set for path ${req.originalUrl}` 
  })
});

// Export the router so it can be used in our main app file
export default router;




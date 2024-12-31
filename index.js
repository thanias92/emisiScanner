import express from "express";
import multer from "multer";
import { Client } from "@gradio/client";

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Set up multer storage and file filtering
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Wrap the Gradio client initialization in an async function
async function initializeClient() {
  try {
    const hfToken = "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"; // Model Token
    const client = await Client.connect("thanias92/vehicle-classifier", {
      hf_token: hfToken,
    });
    return client;
  } catch (error) {
    console.error("Error initializing Gradio client:", error);
    throw error;
  }
}
// Initialize the client
const client = await initializeClient();

// POST route to handle image upload and prediction
app.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    // Create Blob from the uploaded file buffer
    const exampleImage = new Blob([req.file.buffer]);
    // Send image for prediction
    const result = await client.predict("/predict", { image_file: exampleImage });
    // Send the result back to the client
    res.json(result.data);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Error prcessing image.");
  }
});

// Serve the app
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

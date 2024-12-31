import express from "express";
import multer from "multer";
import { Client } from "@gradio/client";
//import cors from "cors"; // Import CORS middleware

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS to allow requests from your front-end
// app.use(
//   cors({
//     origin: "http://192.168.90.105:8080", // Replace with your frontend's origin
//     //methods: ["GET", "POST"],
//     //llowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// Set up multer storage and file filtering
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Wrap the Gradio client initialization in an async function
async function initializeClient() {
  try {
    const hfToken = "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"; // Replace with your actual Hugging Face Token
    const client = await Client.connect("thanias92/vehicle-classifier", {
      hf_token: hfToken,
    });
    console.log("Gradio client connected successfully");
    return client;
  } catch (error) {
    console.error("Error initializing Gradio client:", error);
    throw error;
  }
}

// Initialize the client and handle connection issues
let client;
initializeClient()
  .then((connectedClient) => {
    client = connectedClient;
  })
  .catch((error) => {
    console.error("Gradio client connection failed:", error);
    process.exit(1); // Stop the server if the client cannot connect
  });

// POST route to handle image upload and prediction
app.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    // Create Blob from the uploaded file buffer
    const exampleImage = new Blob([req.file.buffer]);
    // Send image for prediction
    const result = await client.predict("/predict", {
      image_file: exampleImage,
    });

    // Send the result back to the client
    res.json(result.data); // Result returned as JSON
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Error processing image.");
  }
});

// Serve the app
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

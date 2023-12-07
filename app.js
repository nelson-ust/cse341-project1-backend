const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { MongoClient } = require("mongodb"); // Import MongoClient from mongodb library

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb+srv://admin:Admin123@cluster0.gt4srvz.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define a mongoose schema for the 'Item' model
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});
const Item = mongoose.model("Item", itemSchema);

// Endpoint to handle creating new items (HTTP POST request)
app.post("/items", async (req, res) => {
  try {
    // Extract name and description from the request body
    const { name, description } = req.body;

    // Create a new Item instance
    const newItem = new Item({ name, description });

    // Save the new item to the database
    const savedItem = await newItem.save();

    // Return the saved item in the response
    res.status(201).json(savedItem);
  } catch (error) {
    // Handle errors and send an appropriate response
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to retrieve all items (HTTP GET request)
app.get("/items", async (req, res) => {
  try {
    // Retrieve all items from the database
    const items = await Item.find({});

    // Return the items in the response
    res.status(200).json(items);
  } catch (error) {
    // Handle errors and send an appropriate response
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to update an item by ID (HTTP PUT request)
app.put("/items/:id", async (req, res) => {
  const itemId = req.params.id;
  try {
    // Find the item by ID and update its data
    const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, {
      new: true,
    });

    // Return the updated item in the response
    res.status(200).json(updatedItem);
  } catch (error) {
    // Handle errors and send an appropriate response
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to delete an item by ID (HTTP DELETE request)
app.delete("/items/:id", async (req, res) => {
  const itemId = req.params.id;
  try {
    // Find and delete the item by ID
    const deletedItem = await Item.findOneAndDelete({ _id: itemId });

    // Check if the item was found and deleted successfully
    if (deletedItem) {
      // Return the deleted item in the response
      res.status(200).json(deletedItem);
    } else {
      // If the item was not found, send a 404 error response
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    // Handle errors and send an appropriate response
    res.status(500).json({ error: error.message });
  }
});

// Set up the server to listen on port 3000
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

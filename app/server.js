const express = require("express");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Enable CORS (safe for production)
app.use(cors());

// Parse JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Environment variables from Railway or Docker Compose
const DB_USER = process.env.MONGO_DB_USERNAME;
const DB_PASS = process.env.MONGO_DB_PWD;

// Correct MongoDB URL for Docker Compose / Railway internal networking
const mongoUrl = `mongodb://${DB_USER}:${DB_PASS}@mongodb:27017/?authSource=admin`;

// MongoDB client options
const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// DB + collection
const databaseName = "my-db";
const collectionName = "my-collection";

// API endpoint
app.get("/fetch-data", (req, res) => {
  MongoClient.connect(mongoUrl, mongoClientOptions, (err, client) => {
    if (err) {
      console.error("MongoDB connection error:", err);
      return res.status(500).send({ error: "Database connection failed" });
    }

    const db = client.db(databaseName);
    const query = { myid: 1 };

    db.collection(collectionName).findOne(query, (err, result) => {
      client.close();

      if (err) {
        console.error("MongoDB query error:", err);
        return res.status(500).send({ error: "Query failed" });
      }

      res.send(result || {});
    });
  });
});

// Railway requires 0.0.0.0
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

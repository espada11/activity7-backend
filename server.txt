// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

const origins = (process.env.CLIENT_ORIGINS || "")
  .split(",").map(v => v.trim()).filter(Boolean);

app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json());

// GET / - API Documentation Guide for Markers[cite: 10, 15]
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>ICT251 Campus Maintenance API Guide</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; max-width: 900px; }
        h1, h2 { color: #1456a0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
        th { background: #f4f4f4; }
        code, pre { background: #eee; padding: 2px 6px; border-radius: 4px; }
        pre { padding: 15px; }
      </style>
    </head>
    <body>
      <h1>ICT251 Campus Maintenance API</h1>
      <p><strong>Project Name:</strong> Campus Maintenance Requests Backend</p>
      <p><strong>Student Name:</strong> Pasche Simoonga</p>
      <p><strong>Student Number:</strong> 202509024</p>
      <p><strong>Description:</strong> Independent Node.js & Express REST API managing campus maintenance records[cite: 10].</p>
      
      <h2>Quick Links</h2>
      <ul>
        <li><a href="/health">Database Health Check (/health)</a>[cite: 10]</li>
        <li><a href="/api/records">Get All Records (/api/records)</a>[cite: 10]</li>
      </ul>

      <h2>Required Routes</h2>
      <table>
        <tr><th>Method</th><th>Route</th><th>Description</th></tr>
        <tr><td>GET</td><td>/</td><td>API Documentation Guide[cite: 10]</td></tr>
        <tr><td>GET</td><td>/health</td><td>Server and database health check[cite: 10]</td></tr>
        <tr><td>GET</td><td>/api/records</td><td>Retrieve all records[cite: 10]</td></tr>
        <tr><td>GET</td><td>/api/records/:id</td><td>Retrieve a record by ID[cite: 10]</td></tr>
        <tr><td>POST</td><td>/api/records</td><td>Create a new record[cite: 10]</td></tr>
        <tr><td>PUT</td><td>/api/records/:id</td><td>Update an existing record[cite: 10]</td></tr>
        <tr><td>DELETE</td><td>/api/records/:id</td><td>Delete a record[cite: 10]</td></tr>
      </table>

      <h2>Example POST / PUT Body</h2>
      <pre>{
  "title": "Broken classroom light",
  "category": "Electrical",
  "description": "The light in Room B12 does not switch on.",
  "status": "Pending"
}</pre>
    </body>
    </html>
  `);
});

// GET /health - Database health check[cite: 10]
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "healthy", database: "connected" });
  } catch (error) {
    res.status(503).json({ status: "unhealthy", database: "disconnected", message: error.message });
  }
});

// Mount Record Router[cite: 14]
app.use("/api/records", require("./routes/records"));

// 404 Route Handler[cite: 14, 15]
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global Error Handler[cite: 14]
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Malformed JSON request body." });
  }
  res.status(500).json({ message: error.message || "Internal server error." });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
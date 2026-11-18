// routes/records.js
const router = require("express").Router();
const pool = require("../db");

function validateRecord(body) {
  const { title, category, description, status } = body;

  if (typeof title !== "string" || typeof category !== "string" || typeof description !== "string" || typeof status !== "string") {
    return "All fields must be strings.";
  }

  const tTitle = title.trim();
  const tCategory = category.trim();
  const tDescription = description.trim();
  const tStatus = status.trim();

  if (tTitle.length < 3 || tTitle.length > 80) return "Title must have 3 to 80 characters[cite: 11].";
  if (tCategory.length < 2 || tCategory.length > 40) return "Category must have 2 to 40 characters[cite: 11].";
  if (tDescription.length < 5 || tDescription.length > 300) return "Description must have 5 to 300 characters[cite: 11].";
  
  const validStatuses = ["Pending", "In progress", "Completed"];
  if (!validStatuses.includes(tStatus)) return "Status must be Pending, In progress, or Completed[cite: 11].";

  return null;
}

// GET all records[cite: 10, 14]
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT id, title, category, description, status FROM records ORDER BY id");
    res.status(200).json(result.rows);
  } catch (error) { next(error); }
});

// GET one record[cite: 10, 14]
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Invalid ID." });

    const result = await pool.query("SELECT id, title, category, description, status FROM records WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Record not found." });

    res.status(200).json(result.rows[0]);
  } catch (error) { next(error); }
});

// POST create record[cite: 10, 14]
router.post("/", async (req, res, next) => {
  try {
    const err = validateRecord(req.body);
    if (err) return res.status(400).json({ message: err });

    const { title, category, description, status } = req.body;
    const result = await pool.query(
      "INSERT INTO records (title, category, description, status) VALUES ($1, $2, $3, $4) RETURNING id, title, category, description, status",
      [title.trim(), category.trim(), description.trim(), status.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { next(error); }
});

// PUT update record[cite: 10, 14]
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Invalid ID." });

    const err = validateRecord(req.body);
    if (err) return res.status(400).json({ message: err });

    const { title, category, description, status } = req.body;
    const result = await pool.query(
      "UPDATE records SET title = $1, category = $2, description = $3, status = $4 WHERE id = $5 RETURNING id, title, category, description, status",
      [title.trim(), category.trim(), description.trim(), status.trim(), id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Record not found." });
    res.status(200).json(result.rows[0]);
  } catch (error) { next(error); }
});

// DELETE record[cite: 10, 14]
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Invalid ID." });

    const result = await pool.query("DELETE FROM records WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Record not found." });

    res.status(200).json({ message: "Record deleted." });
  } catch (error) { next(error); }
});

module.exports = router;
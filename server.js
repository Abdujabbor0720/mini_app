import express from "express";
import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

const app = express();
const PORT = process.env.PORT || 3000;

// dist papkani statik qilib beramiz
app.use(express.static(join(__dirname, "dist")));

// SPA bo‘lgani uchun barcha yo‘llar index.html ga yo‘naltiriladi
app.get(/.*/, (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});



app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

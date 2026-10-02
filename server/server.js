const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
dotenv.config({ path: path.resolve(__dirname, '.env') });
const dbConnect = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);

app.get("/api/health", (req, res) => {
 res.status(200).json({
 success: true,
 message: "Blogging Platform API is running",
 });
});
// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


const PORT = process.env.PORT || 5000;

const startServer = async () => {
 await dbConnect();
 console.log('About to start server on port', PORT);
 const server = app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
 });
 server.on('error', (err) => {
 console.error('Server error:', err);
 });
};

startServer().catch(err => {
 console.error('Failed to start server:', err);
 process.exit(1);
});
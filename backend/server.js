import express from "express";
import companyRoutes from "./Routes/company_route.js";

const app = express();

app.use(express.json()); // Middleware to parse JSON
app.use("/api/company", companyRoutes); // Register company routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
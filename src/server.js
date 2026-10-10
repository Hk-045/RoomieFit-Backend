import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/database.js";

await connectDB();

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
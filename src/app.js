import express from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import listingRouter from "./routes/listing.js";
import interestRouter from "./routes/interest.js";

import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/listings", listingRouter);
app.use("/api/interests", interestRouter);

app.use(errorHandler);

export default app;
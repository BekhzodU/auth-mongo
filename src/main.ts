import express, { Express } from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { resolve } from "path";
import router from "./routers/authRouter";
import { errorHandler, unknownPageError } from "./utils/helper";

configDotenv({ path: resolve(__dirname, "../config.env") });

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.use(express.json());
app.use("/", router);
app.all("*", unknownPageError);
app.use(errorHandler);

const run = async () => {
  try {
    await mongoose.connect(process.env.DATABASE || "");
    app.listen(port, () => {
      console.log(`Server is running...`);
    });
  } catch (error) {
    console.log(error);
  }
};

run();

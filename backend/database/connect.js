import mongoose from "mongoose";
import ENV from "../config.js";

async function connect() {
  const db = await mongoose.connect(ENV.MONGO_TESTING_DB);
  console.log("Database Connected");
  return db;
}

export default connect;

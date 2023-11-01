import mongoose from "mongoose";

const connection = async () => {
  if (mongoose.connection.readyState) {
    return mongoose.connection.asPromise();
  }
  await mongoose.connect(`${process.env.DATABASE_URL}`);
};
export default connection;

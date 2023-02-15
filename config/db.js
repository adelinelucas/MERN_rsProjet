import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb://localhost:27017/firstProjetMern",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log("Failed Connection to MongoDB: " + error);
  });

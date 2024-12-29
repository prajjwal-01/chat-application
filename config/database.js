const mongooes = require("mongoose");

const connectDB = () => {
  mongooes
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected Successfully"))
    .catch((err) => {
      console.log("MongoDB connection failed");
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectDB;

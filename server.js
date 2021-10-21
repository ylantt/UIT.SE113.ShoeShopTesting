const dotenv = require("dotenv");
const app = require("./app");

const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 8000;

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`App running on port ${port}`);
}); // start the server

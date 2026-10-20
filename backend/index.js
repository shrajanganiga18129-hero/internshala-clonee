const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { connect } = require("./db");
const router = require("./Routes/index");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("hello this is internshala backend");
});

app.use("/api", router);
connect();

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});

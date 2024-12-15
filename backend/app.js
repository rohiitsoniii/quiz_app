// require("./tracer.js");
const express = require("express");
var cors = require("cors");
const app = express();
const bodyparser = require("body-parser");
const errorMiddleware = require("./middleware/error");
const cookieparser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotEnv = require("dotenv");
dotEnv.config();
const MainRouter = require("./routes");
const corsOptions = {
  origin: "*",
  methods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json({ limit: "1200mb" }));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(cookieparser());

app.use("/api", MainRouter);
app.use(errorMiddleware);

module.exports = app;

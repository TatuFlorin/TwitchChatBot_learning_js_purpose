const express = require("express");
require("dotenv").config({ path: "./../.env" });
const app = express();

const port = process.env.PORT || 3001;

app.use("/auth", require("./routes/auth-routes"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

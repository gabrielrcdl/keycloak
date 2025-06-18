import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Auth Flow Service!");
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

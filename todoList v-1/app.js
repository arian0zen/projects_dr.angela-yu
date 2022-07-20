const date = require(__dirname +'/date.js');

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 80;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.get("/", (req, res) => {
  let day = date();


  res.render("list", { listTitle: day, new_ejs: items });
});

app.post("/", (req, res) => {
  let item = req.body.newItem;
  if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", new_ejs: workItems });
});
// app.post("/work", (req, res) => {
//   let item = req.body.newItem;
//   workItems.push(item);
//   res.redirect("/work");
// });

app.listen(port, () => {
  console.log("listening on port " + port);
});

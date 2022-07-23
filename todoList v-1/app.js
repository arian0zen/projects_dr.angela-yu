const date = require(__dirname +'/date.js');

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");



const ejs = require("ejs");
const port = 80;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolist")

const itemsSchema = {
  name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Eat a lot of Water"
});
const item2 = new Item({
  name: "Cook Food"
});
const item3 = new Item({
  name: "Study AI"
});
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model('List', listSchema);



app.get("/", (req, res) => {
  let day = date();
  Item.find({}, (err, foundItems)=>{

    if (foundItems.length === 0){
      Item.insertMany(defaultItems, (err)=>{
        if(err){
          console.log(err);
        }
        else {
          console.log("successfully added ");
        }
        res.redirect("/");
      })
    } else{
      res.render("list", { listTitle: day, new_ejs: foundItems });
    }

  })


});



app.get("/:customListParams", (req, res)=>{
  const customListParams = _.capitalize(req.params.customListParams);


  List.findOne({name: customListParams}, (err, foundList)=>{
    if(!err) {
      if(!foundList){
        //create a new list
        const list = new List ({
          name: customListParams,
          items: defaultItems
        });
         list.save();
         res.redirect("/"+customListParams);
      } else{
        // show the existing list
        
        res.render("list", { listTitle: foundList.name, new_ejs: foundList.items });
        
      }
    }
  })






})




app.post("/", (req, res) => {
  let itemName = req.body.newItem;
  let listName = req.body.list;
  let day = date();
  
  const item_new = new Item({
    name: itemName,
  });

  if (listName === day){
    item_new.save();
    res.redirect("/");
  } else{
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item_new);
      foundList.save();
      res.redirect("/"+ listName);
    })
  }
  


});

app.post("/delete", (req, res)=>{
  const checkedItemId = req.body.checkbox;
  const listName = req.body.list_Name;
  let day = date();

  if (listName === day) {
    Item.findByIdAndRemove(checkedItemId, (err)=>{
      if (err){
        console.log(err);
      } else{
        console.log("successfully deleted item")
      }
    })
    res.redirect("/");

  } else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList)=>{
      if(!err){
        res.redirect("/"+listName)
      }
    });

  }





})


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

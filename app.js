//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
require('dotenv').config();
const URL = process.env.URL;
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const itemSchema = new mongoose.Schema({
  name: String
 
});

const Item = mongoose.model('Item', itemSchema);
var customeList= null;
var reqParams = "";
const todo_1 = new Item({
  name: 'Make food'
});
const todo_2 = new Item({
  name: 'Cook food'
});
const todo_3 = new Item({
  name: 'Eat food'
});
const defaultItems = [todo_1, todo_2, todo_3];

// Item.insertMany(defaultItems).then(function() {
//   console.log('insert success');
// }).catch(function(error) {
//   console.log(error);
// });


app.get("/favicon.ico", (req, res) => res.status(204));
app.get("/", function(req, res) {
  reqParams = "";
  
const day = date.getDate();
Item.find().then(function(items) {
  if (items.length === 0) {
    Item.insertMany(defaultItems).then(function() {
      console.log('insert success');
      res.redirect("/");
    }).catch(function(error) {
      console.log(error);
    });
  } else {
    var url = "/";
    res.render("list", { listTitle: day, newListItems: items ,url: url});
  }
}).catch(function(error) {
  console.log(error);
});
});
app.post("/delete-item", function(req, res){

  console.log(req.body);
  const checkedItemId = req.body.check;
  let model = Item;
  if (reqParams) {
    // If reqParams is set, use customList model
    model = mongoose.model(reqParams + "_list_item", itemSchema);
  }
  model.findByIdAndRemove(checkedItemId).then(function() {
    console.log('delete success');
    res.redirect(req.headers.referer);
  }).catch(function(error) {
    console.log(error);
  });
  
});



app.post("/", function(req, res){

  const item = req.body.newItem;
  

    const new_todo = new Item({
      name: item
    });
    new_todo.save().then(function() {
      console.log('post insert success');
    }
    ).catch(function(error) {
      console.log(error);
    }
    );
    res.redirect("/");
  
});

app.post("/:list", function(req, res){
  const item = req.body.newItem;
  reqParams = req.params.list;

  
  const new_todo = new customeList({
    name: item
  });
  new_todo.save().then(function() {
    console.log('post insert success');
  }
  ).catch(function(error) {
    console.log(error);
  }
  );
  res.redirect("/"+req.params.list);
});

app.get("/:list", function(req,res){
  console.log(req.params.list);
  reqParams = req.params.list;
  customeList = mongoose.model(reqParams+"_list_item", itemSchema);
  const day = date.getDate();
  customeList.find().then(function(items) {
  if (items.length === 0) {
    customeList.insertMany(defaultItems).then(function() {
      console.log('insert success');
      res.redirect("/"+req.params.list);
    }).catch(function(error) {
      console.log(error);
    });
  } else {
    res.render("list", { listTitle: day, newListItems: items ,url: "/"+req.params.list});
  }
}).catch(function(error) {
  console.log(error);
});
});



app.get("/about", function(req, res){
  res.render("about");
});

app.listen( 3000 || process.env.PORT , function() {
  console.log("Server started on port "+  process.env.PORT || 3000);
});

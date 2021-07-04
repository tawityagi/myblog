//jshint esversion:6
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { request } = require("express");
const { forEach } = require("lodash");
const _ = require("lodash");
const mongoose= require("mongoose");

const homeStartingContent = "Welcome to my blog website! ";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.URL, {useNewUrlParser: true , useUnifiedTopology: true,useFindAndModify: false});

const postSchema = new mongoose.Schema(
  {title: String,content: String},
  {timestamps: true}
);

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req,res) {
  Post.find({}).sort({createdAt: -1}).exec(function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  })
})
app.get("/about", function (req,res) {
  res.render("about");
})
app.get("/contact", function (req,res) {
  res.render("contact");
})
// app.get("/compose", function (req,res) {
//   res.render("compose");
// })
app.get("/posts",function (req,res) {
  res.redirect("/");
})
// app.post("/compose",function (req,res) {
//   const post = new Post ({
//     title: req.body.postTitle,
//     content: req.body.postBody
//   });
//   post.save();
//   res.redirect("/");
// })

app.get("/posts/:postId",function (req,res) {
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    Post.findOne({createdAt : { $gt : post.createdAt }}, function (er, next) {
      Post.find({createdAt : { $lt : post.createdAt }}, function (e, prevPosts) {
        if(err || er || e){
          console.log("Cannot fetch");
        }
        else{
          res.render("post", {
            title: post.title,
            content: post.content,
            nextPost: next,
            prevPost: prevPosts[prevPosts.length - 1]
          });
        }
    })
    })
  });
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started successfully ..");
});

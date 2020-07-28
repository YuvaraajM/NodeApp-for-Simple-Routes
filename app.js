var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express();

require("dotenv/config");
//APP CONFIG:
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
  })
  .then(console.log("Db is Connected!"));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//MONGO SCHEMA:
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

var Blog = new mongoose.model("Blog", blogSchema);
// Blog.create({
//     title:"Summa",
//     image: "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//     body:"This is a sample text"
//     //'Created' is automatically created;
// });

//Home page:
app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log("Error!");
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//New blog route
app.get("/blogs/new", function (req, res) {
  res.render("new");
});

//Post route for new blog
app.post("/blogs", function (req, res) {
  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

//Show route
app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id, function (err, blogFound) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: blogFound });
    }
  });
});

//Edit route:
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, blogFound) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: blogFound });
    }
  });
});

//Update route
app.put("/blogs/:id", function (req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (
    err,
    updatedBlog
  ) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//Delete route
app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen("2000", function () {
  console.log("Server is running!!!");
});

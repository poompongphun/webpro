const express = require("express");
const router = express.Router();

var article = require("../json/article-db");

router.get("/", function (req, res, next) {
  console.log(req.query.search);
  const filteredArticle = article.filter((data) =>
    req.query.search
      ? data.title.toLowerCase().includes(req.query.search.toLowerCase())
      : true
  );
  var data = { title: "Express", article: filteredArticle };
  res.render("index", data);
});

router.get("/blog/:id", function (req, res, next) {
  const singleArticle = article.find((article) => article.id === req.params.id);
  var data = {
    title: "Express",
    article: singleArticle,
  };
  if (singleArticle) {
    res.render("blog", data);
  } else {
    res.send("ไม่พบบทความ");
  }
});

module.exports = router;

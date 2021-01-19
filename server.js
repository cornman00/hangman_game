const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, "public")));

app.get("/api/word", function (req, res) {
  fs.readFile("./wordlist.txt", (err, data) => {
    if (err) throw err;
    let wordList = data.toString().split("\n");
    res.send(wordList);
  });
});

app.listen(port, () => console.log(`It's running on port ${port}`));

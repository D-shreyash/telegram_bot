const express = require("express");
const { getUserIdByUUID } = require("./DB/db");
const bot = require("./bot/bot");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/link/:UUID", (req, res) => {
  const UUID = req.params.UUID;

  getUserIdByUUID(UUID, (err, userId) => {
    if (err) {
      res.status(500).send("Error processing your request.");
    } else if (userId) {
      res.redirect(
        `/uuid-display.html?uuid=${encodeURIComponent(
          UUID
        )}&userid=${encodeURIComponent(userId)}`
      );
    } else {
      res.send(`No user ID found for UUID ${UUID}.`);
    }
  });
});

app.listen(port, () => {
  console.log(`server started at port no ${port}`);
});

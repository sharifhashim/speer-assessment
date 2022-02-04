const express = require("express");
const router = express.Router();
// const {
//   addTweet,
//   getTweet,
//   updateTweet,
//   deleteTweet
// } = require("../db/helpers/dbHelpers.js");

module.exports = ({ addTweet, getTweets, updateTweet, deleteTweet }) => {
  router.post("/", (req, res) => {
    const { tweet, userName } = req.body;
    //const userName = req.session.user.user_name;
    addTweet(userName, tweet)
      .then((tweet) => res.json(tweet))
      .catch((error) => res.json({ error: error.message }));
  });

  router.get("/", (req, res) => {
    //const userName = req.session.user.user_name;
    const { userName } = req.body;
    getTweets(userName)
      .then((tweets) => res.json(tweets))
      .catch((error) => res.json({ error: error.message }));
  });

  router.put("/:tweet_id", (req, res) => {
    const tweetId = req.params.tweet_id;
    //const userName = req.session.user.user_name;
    const { tweet, userName } = req.body;
    updateTweet(tweetId, userName, tweet)
      .then((tweet) => res.json(tweet))
      .catch((error) => res.json({ error: error.message }));
  });

  router.delete("/:tweet_id", (req, res) => {
    const tweetId = req.params.tweet_id;
    deleteTweet(tweetId)
      .then(() => res.json({ message: "Your post successfully deleted" }))
      .catch((error) => res.json({ error: error.message }));
  });

  return router;
};

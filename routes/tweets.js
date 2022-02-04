const express = require("express");
const router = express.Router();

module.exports = ({ addTweet, getTweets, updateTweet, deleteTweet }) => {
  router.post("/", (req, res) => {
    const { tweet, userName } = req.body;
    addTweet(userName, tweet)
      .then((tweet) => res.json(tweet))
      .catch((error) => res.json({ error: error.message }));
  });

  router.get("/", (req, res) => {
    getTweets()
      .then((tweets) => res.json(tweets))
      .catch((error) => res.json({ error: error.message }));
  });

  router.put("/:tweet_id", (req, res) => {
    const tweetId = req.params.tweet_id;
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

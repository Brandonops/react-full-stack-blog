var express = require('express');
var router = express.Router();
const models = require('../models');
const checkAuth = require('../auth/checkAuth')

/* GET home page. */
router.get('/', async (req, res) => {
    const posts = await models.Post.findAll({
      include: [{ model: models.User, attributes: ['username', 'id'] }],
    });
  
    res.json(posts);
  });
router.post('/', checkAuth, async (req, res) => {
    const { user } = req.session
    if (!user) {
        return res.status(401).json({
            error: "Not logged in"
        });
    };

    if (!req.body.title || !req.body.content) {
        return req.status(400).json({
            error: 'Please include all title and content fields'
        });
    };
    //create post 
    const post = await models.Post.create({
        title: req.body.title,
        content: req.body.content,
        UserId: req.session.user.id
    });
    

    "send back new post data"
    res.status(201).json(post);
});

module.exports = router;

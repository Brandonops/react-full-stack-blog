var express = require('express');
var router = express.Router();
const models = require('../models');
const checkAuth = require('../auth/checkAuth')

/* GET posts. */
router.get('/', async (req, res) => {
    const posts = await models.Post.findAll({
      include: [{ model: models.User, attributes: ['username', 'id'] }],
    });
  
    res.json(posts);
  });
  
  router.post('/', checkAuth, async (req, res) => {
    // if any fields missing
    if (!req.body.title || !req.body.content) {
      //   send 400 error
      return req.status(400).json({
        error: 'Please include all title and content',
      });
    }
  
    // create new post
    const post = await models.Post.create({
      title: req.body.title,
      content: req.body.content,
      UserId: req.session.user.id,
    });
  
    // send back new post data
    res.status(201).json(post);
  });
  
  router.post('/:id/comments', checkAuth, async (req, res) => {
    const post = await models.Post.findByPk(req.params.id);
    if (!post) {
      res.status(404).json({
        error: 'Could not find post with that id',
      });
    }
  
    if (!req.body.text) {
      res.status(400).json({
        error: 'please include all required fields',
      });
    }
  
    const comment = await post.createComment({
      text: req.body.text,
      PostId: req.params.id,
      UserId: req.session.user.id,
    });
  
    res.status(201).json(comment);
  });
  
  router.get('/:id/comments', async (req, res) => {
    const post = await models.Post.findByPk(req.params.id);
    if (!post) {
      res.status(404).json({
        error: 'Could not find post with that id',
      });
    }
  
    const comments = await post.getComments({
      include: [{ model: models.User, attributes: ['username', 'id'] }],
    });
  
    res.json(comments);
  });
  
  module.exports = router;
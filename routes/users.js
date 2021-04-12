var express = require('express');
var router = express.Router();
const models = require('../models')
const bcrypt = require('bcrypt')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//POST localhost:3000/api/v1/users
router.post('/register', async (req, res) => {
  if(!req.body.username || !req.body.password) {
    return res.status(401).json({
      error: "Please include username and password"
    })
  }
//check db for existing user
 const user = await models.User.findOne({
    where: {
      username: req.body.username
    }
  })

  //if exists, send error
  if (user) {
    return res.status(400).json({
      error: 'Username already in use'
    })
  }

  //create password
  const hash = await bcrypt.hash(req.body.password, 10)

  //create user
  const newUser = await models.User.create({
    username: req.body.username,
    password: hash,
  })

  return res.status(201).json(newUser)
})


router.post('/login', async (req, res) => {
  if(!req.body.username || !req.body.password) {
    return res.status(401).json({
      error: "Please include username and password"
    })
  }

//check db for existing user
 const user = await models.User.findOne({
    where: {
      username: req.body.username
    }
  })

   //if exists, send error
   if (!user) {
    return res.status(404).json({
      error: 'No user with that username found'
    })
  }

  //check password
  const match = await bcrypt.compare(req.body.password, user.password)

  if (!match) {
    return res.status(401).json({
      error: 'Password incorrect'
    })
  }


  //store user in session
  req.session.user = user;

  //respond with user info
  // res.json(user)


  res.json({
    id: user.id,
    username: user.username,
    updatedAt: user.updatedAt
  })
})



router.get('/logout', (req, res) => {
  //clear user data from session
  req.session.user = null;

  //send success response
  res.json({
    success: 'Logged out successfully'
  })
 })

 router.get('/current', (req, res) => {
   const { user } = req.session;
   if (user) {
     res.json({
      id: user.id,
      username: user.username,
      updatedAt: user.updatedAt
     })
   } else {
     res.status(401).json({
       error: 'Not logged in',
     })
   }
 })



module.exports = router;

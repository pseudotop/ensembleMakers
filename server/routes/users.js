const { User, validate } = require('../models/user');
const { Post } = require('../models/post');
const { Portion } = require('../models/portion');
const { hashPassword } = require('./middlewares');

const express = require('express');
const router = express.Router();
const queryString = require('querystring')

// get all users
router.get('/', async (req, res) => {
  const users = await User.find()
    .populate('posts_host')
    .populate('posts_join')
    .sort('createdAt');

  res.send(users);
});

// get user by id
router.get('/searchById/:id', async(req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({"key": "user", "message": "사용자를 찾을 수 없습니다."});
  res.send(user);
});

// get user by userNumber
router.get('/searchByNum/:id', async(req, res) => {
  let user = await User.findOne({"userNumber": req.params.id});
  if (!user) return res.status(404).json({"key": "user", "message": "사용자를 찾을 수 없습니다."});
  res.send(user)
})

// get user by company name
router.get('/searchByCompany', async(req, res) => {
  const user = await User.find({"company.companyName": {$regex: req.query.companyName, $options: 'ix' }})
  if(!user) return res.status(404).json({"key": "company", "message": "공장 및 회사를 찾을 수 없습니다."});
  res.send(user);
})

// create user
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  
  if (error) return res.status(400).send(error.message);
  
  let rebody = {};
  const password = await hashPassword(req.body.password);
  rebody['password'] = password;
  Object.keys(req.body).map((key) => {    
    if (key === 'password') return;
    else return rebody[key] = req.body[key];
  });
  console.log(rebody);
  let user = new User(rebody);
  user = await user.save();

  res.send(user);
});

// update user
router.patch('/:id', async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.send(user);
});

// delete user
router.delete('/:id', async (req, res) => {
  let user = await User.findByIdAndDelete(req.params.id);

  user.posts_host.forEach(async post_id => {
    await Post.findByIdAndDelete(post_id);
  });
  user.posts_join.forEach(async post_id => {
    await Portion.deleteMany({ post_id: post_id, user_id: user._id });
  });

  res.send(user);
});

module.exports = router;
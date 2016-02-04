var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Users(){
  return knex('users');
}

function Posts(){
  return knex('posts');
}

// get route to create a new post
router.get('/new', function (req, res, next) {
  Users().where("linkedin_id", res.locals.user.id).first().then(function (user){
    if(user){
    res.render('posts/form', {title: "add a post mo-fo", user: user})
    } else {
      res.redirect('/auth/linkedin')
    }
  })
})

// get individual post
router.get('/:post_id/show', function(req, res, next){
  Posts().where('id', req.params.post_id).first().then(function(post){
    Users().where('id', post.author_id).first().then(function(user){
      var profile = res.locals.user
      res.render('posts/show', {post: post, user:user, profile: profile})
    })
  })
})

// edit individual post
router.get('/:post_id/edit', function(req, res, next){
  Posts().where('id', req.params.post_id).first().then(function(post){
    Users().where('id', post.author_id).first().then(function(user){
      var profile = res.locals.user
      res.render('posts/edit', {post: post, user:user, profile: profile, title: "edit your post mo-fo"})
    })
  })
})

// updates edited post to dashboard
router.post('/:post_id/edit', function(req, res, next){
  Posts().where('id', req.params.post_id).update(req.body).then(function(post){
    Users().where('id', post.author_id).first().then(function(user){
      res.redirect('/dashboard');
    });
  })
})

// deletes post from dashboard
router.post('/:post_id/delete', function(req, res, next){
  Posts().where('id', req.params.post_id).del().then(function(result){
      res.redirect('/dashboard');
  })
})

// get comment form page
router.get('/:post_id/comment', function(req, res, next){
  Posts().where('id', req.params.post_id).first().then(function(post){
    Users().where('id', post.author_id).first().then(function(user){
      var profile = res.locals.user
      res.render('posts/comment', {post: post, user:user, profile: profile, title: "make your comment mo-fo"})
    })
  })
})

//post comment back to /post/:post_id/
router.post('/:post_id/comment', function (req, res, next) {
  Posts().where('id', req.params.post_id).first().then(function(post){
    Users().where('linkedin_id', res.locals.user.id).first().then(function(users){
      // console.log(users);
      Posts().insert({
        author_id: users.id,
        body: req.body.body,
        cat_name: req.body.cat_name,
        subject: req.body.subject,
      }).then(function (posts) {
        res.redirect('/posts/'+req.params.post_id+'/show')
      })
    })
  })
})


module.exports = router;

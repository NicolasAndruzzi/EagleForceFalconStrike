var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var Promise = require('bluebird');
var validate = require('../lib/validations');

function Users(){
  return knex('users');
}

function Posts(){
  return knex('posts');
}

function Comments(){
  return knex('comments');
}

// get route to create a new post
router.get('/new', function (req, res, next) {
  Users().where("linkedin_id", res.locals.user.id).first().then(function (user){
    if(user){
      var profile = res.locals.user
      res.render('posts/form', {title: "add a post mo-fo", user: user, profile: profile})
    } else {
      res.redirect('/auth/linkedin')
    }
  })
})

router.get('/:post_id/show', function(req, res, next){
  Posts().where('id', req.params.post_id).first().then(function(post){
    Users().where('id', post.author_id).first().then(function(user){
      Comments().where('post_id', post.id).then(function(comments){
        Promise.all(comments.map(function (comment) {
          return Users().where('id', comment.author_id).first().then(function (user) {
            var author = user.first_name + " " + user.last_name;
            comment.author = author;
            return comment;
          })
        })).then(function (comments) {
          Users().leftJoin("comments", "comments.author_id", "users.id").where("post_id", post.id).then(function (results) {
                      var profile = res.locals.user
                      var commentCount = comments.length
                      res.render('posts/show', {post: post, user:user, profile: profile, comments: comments, commentCount: commentCount, results:results})
                    })
                  })
                })
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
  var errors = validate(req.body)
  var profile = res.locals.user
    if(errors.length){
      res.render('posts/edit', {post: {id: req.params.post_id}, info: req.body, errors: errors, profile: profile, title: "correctly edit your post, mo-fo"})
    } else {
  Posts().where('id', req.params.post_id).update(req.body).then(function(post){
    Users().where('id', post.author_id).first().then(function(user){
      res.redirect('/dashboard');
      });
    })
  }
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
      res.render('comments/form', {post: post, user:user, profile: profile, title: "make your comment mo-fo"})
    })
  })
})

//posts a new comment
router.post('/:post_id/comment', function (req, res, next) {
  Posts().where('id', req.params.post_id).first().then(function(post){
    Users().where('linkedin_id', res.locals.user.id).first().then(function(users){
      Comments().insert({
        post_id: req.params.post_id,
        author_id: users.id,
        body: req.body.body,
      }).then(function (posts) {
        res.redirect('/posts/'+req.params.post_id+'/show')
      })
    })
  })
})

// get individual comment page
router.get('/:post_id/comment/:comment_id/show', function(req, res, next){
  Posts().where('id', req.params.post_id).first().then(function(post){
    Users().where('id', post.author_id).first().then(function(user){
      Comments().where('post_id', req.params.post_id).then(function(comments){
        var profile = res.locals.user
        res.render('comments/show', {post: post, user:user, profile: profile, comments: comments})
      })
    })
  })
})

// edit individual comment form
router.get('/:post_id/comment/:comment_id/edit', function(req, res, next){
  Posts().where('id', req.params.post_id).first().then(function(post){
    Users().where('id', post.author_id).first().then(function(user){
      Comments().where('id', req.params.comment_id).first().then(function(comment){
        var profile = res.locals.user
        res.render('comments/edit', {post: post, user:user, profile: profile, comment: comment, title: "edit your comment mo-fo"})
      })
    })
  })
})

// post edited comment
router.post('/:post_id/comment/:comment_id/', function (req, res, next) {
  Posts().where('id', req.params.post_id).first().then(function(post){
    Users().where('linkedin_id', res.locals.user.id).first().then(function(user){
      Comments().where('id', req.params.comment_id).update(req.body).then(function (comment) {
        res.redirect('/posts/'+req.params.post_id+'/show')
      })
    })
  })
})

// deletes a comment
router.post('/:post_id/comment/:comment_id/delete', function(req, res, next){
  Comments().where('id', req.params.comment_id).first().del().then(function(result) {
    res.redirect('/posts/'+req.params.post_id+'/show');
  })
})

// upvote a post on post page
router.get('/:post_id/upvote', function (req, res, next) {
  Posts().where('id', req.params.post_id).first().then(function (results) {
    var votes = results.upvotes;
    votes += 1;
    Posts().where('id', req.params.post_id).update({
      upvotes: votes
    }).then(function (votes) {
      res.redirect('/posts/'+req.params.post_id+'/show')
    })
  })
})

// downvote post on postpage
router.get('/:post_id/downvote', function (req, res, next) {
  Posts().where('id', req.params.post_id).first().then(function (results) {
    var votes = results.downvotes;
    votes += 1;
    Posts().where('id', req.params.post_id).update({
      downvotes: votes
    }).then(function (votes) {
      res.redirect('/posts/'+req.params.post_id+'/show')
    })
  })
})

// upvote a comment on post show page
router.get('/:post_id/comment/:comment_id/upvote', function (req, res, next) {
  Comments().where('post_id', req.params.post_id).andWhere('id', req.params.comment_id).first().then(function (results) {
    var votes = results.upvotes;
    votes += 1;
    Comments().where('id', req.params.comment_id).update({
      upvotes: votes
    }).then(function (votes) {
      res.redirect('/posts/'+req.params.post_id+'/show')
    })
  })
})

// downvote a comment on post showpage
router.get('/:post_id/comment/:comment_id/downvote', function (req, res, next) {
  Comments().where('post_id', req.params.post_id).andWhere('id', req.params.comment_id).first().then(function (results) {
    var votes = results.downvotes;
    votes += 1;
    Comments().where('id', req.params.comment_id).update({
      downvotes: votes
    }).then(function (votes) {
      res.redirect('/posts/'+req.params.post_id+'/show')
    })
  })
})

module.exports = router;

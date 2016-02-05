var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Users(){
  return knex('users');
}

function Posts(){
  return knex('posts');
}
function Comments(){
  return knex('comments');
}


router.get('/', function (req, res, next) {

  res.send("admin page");
})
// admin route for Super Admin
// router.get('/admin', function (req, res, next) {
//   var linkedinID = req.session.passport.user.id
//   Users().select().then(function (users) {
//     Users().where("linkedin_id", linkedinID).first().then(function (admin) {
//       console.log("^^^^TRUE^^^^");
//       console.log(admin);
//       Posts().select().then(function (posts) {
//         Posts().where("cat_name", "helps").then(function (helps) {
//           Posts().where("cat_name", "interestings").then(function (interestings) {
//             var interestingsNumber = Number(interestings.length);
//             var helpsNumber = Number(helps.length);
//             var userNumber = Number(users.length);
//             var profile = res.locals.user;
//             res.render('admin', {profile: profile, users: users, posts: posts, userNumber: userNumber, helpsNumber: helpsNumber,
//               interestingsNumber: interestingsNumber, admin: admin});
//
//             })
//         })
//       })
//     })
//   })
// })
// =======



module.exports = router;

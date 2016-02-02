// var express = require('express');
// var router = express.Router();
// var knex = require('../db/knex');
//
//
// function Login(){
//   return knex('login');
// }
//
// // temporary login route for custom login, until we have OAuth
// router.get('/', function (req, res, next) {
//     res.render('login')
// });
//
// router.post('/', function (req, res, next) {
//   // if(validate.password(req.body.password) === true){
//   //   res.send("success")
//   // };
//   // console.log(req.body.password)
//   // console.log(req.body.password.length)
//   var password = req.body.password
//   var user_name = req.body.user_name
//   Login().where('id', req.params.id).first().then(function (user) {
//     if(user){
//       Login().where('id', req.params.id).first().then(function (user) {
//         res.redirect('/dashboard/'+req.params.id)
//       });
//     } else if (password.length <= 7) {
//       res.redirect('/')
//     } else if (password.length = 0){
//       res.redirect('/')
//     } else if (user_name.length = 0){
//       res.redirect('/')
//     } else {
//       Login().insert(req.body).then(function (result) {
//         res.redirect('/')
//       })
//     }
//   })
// })
//
// module.exports = router;

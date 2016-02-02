var express = require('express');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex')

function Users(){
  return knex('users');
}

router.get('/linkedin', passport.authenticate('linkedin'), function(req, res, next){

});

router.get('/logout', function (req, res, next) {
  req.session = null;
  res.redirect('/');
})

router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/' }),
function (req, res, next) {
  // if statement to see if user exists , else statement - knex insert into Users table
  Users().where('linkedin_id', res.locals.user.id).first().then(function (user) {
    console.log("****user****");
    console.log(user)
    console.log("****res.locals.user.id****");
    console.log(res.locals.user.id);
    if(res.locals.user.id){
      Users().insert({
        linkedin_id: res.locals.user.id,
        first_name: res.locals.user.name.givenName,
        last_name: res.locals.user.name.familyName
      }, "id").then(function (user) {
        res.cookie("user", res.locals.user.id)
        res.redirect('/');

      })
    }
  })

})

// { provider: 'linkedin',
//   id: 'YKBYNsgTZ-',
//   displayName: 'Thomas Pasque',
//   name: { familyName: 'Pasque', givenName: 'Thomas' },
//   _raw: '{\n  "firstName": "Thomas",\n  "id": "YKBYNsgTZ-",\n  "lastName": "Pasque"\n}',
//   _json: { firstName: 'Thomas', id: 'YKBYNsgTZ-', lastName: 'Pasque' } }

module.exports = router;

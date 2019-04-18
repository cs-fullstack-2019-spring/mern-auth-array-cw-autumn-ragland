var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserCollection = require('../models/UserSchema');

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    UserCollection.findById(id, function (err, user) {
        done(err, user);
    });
});

var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
};
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

router.get('/', (req, res) => {
    if (req.session.username) {
        res.send(req.session.username);
        console.log(req.session.username)
    } else {
        res.send(null);
    }
});

//******************************************************************
//create a user/register
//******************************************************************

//new user strategy
passport.use('signup', new LocalStrategy(
    {passReqToCallback: true},
   function (req,username,password,done) {
       findOrCreateUser = function () {
          UserCollection.findOne({'username':username},(errors,user) => {
              if(user){
                  return done(null,false,{message:'User Exists'});
              }
              else{
                  var newUser = new UserCollection();

                  newUser.username = username;
                  newUser.password = createHash(password);

                  newUser.save((errors) => {
                      if(errors){
                          throw errors;
                      }
                      return done(null,newUser);
                  });
              }
          });
       };
       process.nextTick(findOrCreateUser);
   })
);

//new user routes
router.post('/newuser',
    passport.authenticate('signup',
        {failureRedirect: '/users/failNewUser'}
    ),(req,res) => {
    res.send("Authenticated")
    });
router.get('/failNewUser', (req, res)=>{
    console.log("Failed New User");
});

//******************************************************************
//user sign in/ existing user
//******************************************************************

//sign in strategy
passport.use(new LocalStrategy(
    function(username, password, done) {
        UserCollection.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!isValidPassword(user, password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log(user);
            return done(null, user, { user: user.username });
        });
    }
));

//sign in routes
router.post('/login',
    passport.authenticate('local',
        {failureRedirect: '/users/loginfail' }),

    function(req, res) {
        req.session.username=req.body.username;
        res.send(req.session.username);
        console.log("session username: " + req.session.username)
    });
router.get('/loginfail', (req, res)=>{
    res.send(undefined);
});

//add book to user collection
router.post('/newbook',(req,res) => {
    UserCollection.findOneAndUpdate({username: req.body.username},
        {$push: {books: req.body.books}}, (errors)=>{
            if(errors) res.send(errors);
            else res.send("Book added!");
        });
});

//grab books BROKEN 500
router.get('/search', (req, res) => {
    UserCollection.findOne({username:req.session.username}, (errors, results) => {
        if (errors) {
            res.send(errors);
            console.log('search fail')
        } else {
            res.send(results);
            console.log(results)
        }
    })
});


module.exports = router;

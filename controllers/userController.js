const User = require("../models/User");
const login = (req, res) => {
    res.render('login'); }

const signup =   (req, res) => {
        res.render('signup');
       }


    const authenticate = async (req,res) => {
    const {username,password} = req.body;
      try {
        var user = await User.findOne({ username: username }).exec();
        if(!user) {
            res.redirect("/login");
        }
        user.comparePassword(password, (error, match) => {
            if(!match) {
              res.redirect("/login");
            }
        });
        req.session.user = user;
        res.redirect("/");
    } catch (error) {
      console.log(error)
    }
  };

 const usersignup =  (req, res) => {

    var user = new User({
      username: req.body.username,
      email: req.body.email,
      password:req.body.password,
    });
    user.save((err, docs) => {
      if (err) {
        res.redirect("/signup");
      } else {
          console.log(docs)
        req.session.user = docs;
        res.redirect("/dashboard");
      }
    });
  }



  module.exports = {signup,login,authenticate,usersignup};
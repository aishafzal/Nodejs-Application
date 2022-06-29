const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //hashing the password
mongoose.connect('mongodb://127.0.0.1:27017/DB',{
useNewUrlParser:true,
useUnifiedTopology:true
})
const userSchema = mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

// helpful functions 
//hashing purpose save doc this function willl execute
userSchema.pre('save',function(next){
  if(!this.isModified('password')){
      return next()
  } //if user is creating 1st time it will hash the password
  this.password = bcrypt.hashSync(this.password,10)
  next()
})

//compare password
userSchema.methods.comparePassword = function(plainText,callback){
    return callback(null,bcrypt.compareSync(plainText,this.password))
}

const userModel = mongoose.model('User',userSchema)
module.exports  = userModel;

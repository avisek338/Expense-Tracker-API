const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')
UserSchema = new mongoose.Schema({
      name:{
        type:String,
        require:[true,'Please provide name'],
        minlength:[1,'Please provide name'],
        maxlength:50
      },
      email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please provide a valid email',
        ],
        unique: true,
      },
      password: {
        type: String,
        required: [true, 'Please provide password'],
        match:[/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,'Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character']
      }
})
UserSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})
UserSchema.methods.createJWT = function(){
    return jwt.sign(
        {userId:this._id,name:this.name},
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_LIFETIME
        }
    )
}
UserSchema.methods.comparePassword = function (password){
  return bcrypt.compare(password,this.password)
}

module.exports = mongoose.model('User',UserSchema)





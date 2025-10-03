const mongoose = require('mongoose');
 const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema ({
    name: String,
    email:{
        type: String,
        unique:true
    },
    password:String,
    role: {
        type:String,
        enum:['driver', 'passenger']
    },
    location: {
        type: {
            type: String,
            enum:['point'],
            default: 'Point'
        },
        cordinates: {
            type: [Number],
            default: [0,0]
        }
    }
})


// this is a pre save middleware that runs before a document is save to  the DB
userSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

userSchema.method.comparePassword = async function(password) {
    return brcypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User;
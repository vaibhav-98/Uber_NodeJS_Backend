const jwt = require('jsonwebtoken');
const Uber = require('../model/user')



const authMiddleware = async (req,res,next) => {

    // get token from headeer in the request

    //token is not valid, access will be denied

    //if token is valid, verify the token.

    // req.user = await User.findById(); 
}


module.exports = authMiddleware
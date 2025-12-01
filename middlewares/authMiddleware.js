const jwt = require('jsonwebtoken');
const Uber = require('../models/user')



const authMiddleware = async (req,res,next) => {

    // get token from headeer in the request
    const token = req.header('Authorization')?.replace('Bearer', '');
    
    //token is not valid, access will be denied
    if(!token) return res.status(401).send('Acees Denied');

    //if token is valid, verify the token.
     try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await Uber.findById(verified.id)
        next()
     } catch (error) {
        res.status(400).send('Invalid Token')
     }
    
}


module.exports = authMiddleware
const authService = require('../services/authService')

const register = async(req,res) =>{
    try {
        const {user,token} = await authService.register(req.body);
        res.status(201).send({data:{user, token}, success: true,error:null, message:"user register succefully" })
    } catch (error) {
        res.status(400).send(error.message)
    }
}



const login = async(req,res) =>{
    try {
        
        
         const {email, password} = req.body;
        // console.log({email, password});
         const {user,token } = await authService.login({email , password});
         res.status(201).send({data:{user,token}, success:true, error:null, message: "User loging succesfully"})
    } catch (error) {
         res.status(400).send(error.message)
    }
}


module.exports = {register,login}
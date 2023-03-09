const userModel = require("../model/userModel");
const { isValidEmail, isVaildPass } = require("../validator")
const jwt = require("jsonwebtoken");


//----------------------------------Create User-------------------------------------------

const createUser = async function (req, res) {
  try {
    const data = req.body;
    const { username, email, password ,phone } = data;
       if (Object.keys(data).length == 0) return res.status(400).send("Please Provide the Credential");

// -----------------------Name validation-------------------------------------------------------
      if (!(username)) return res.status(400).send("Name is mandatory");

//--------------------------Phone Validation------------------------------------------------------
      if (!(phone)) return res.status(400).send("Phone is required")
      let uniquePhone = await userModel.findOne({ phone: phone })
      if (uniquePhone) return res.status(400).send({ status: false, message: "Phone is already exist" })

// -----------------------Email validation----------------------------------------------------------
     if (!(email)) return res.status(400).send("Email is mandatory")
     if (!isValidEmail(email.trim())) return res.status(400).send({ status: false, msg: "Please provide a valid Email-Id" })
    let uniqueEmail = await userModel.findOne({ email: email })
     if (uniqueEmail) return res.status(400).send({ status: false, message: "Email is already exist" })

// -----------------------Password validation-------------------------------------------------------
    if (!(password)) return res.status(400).send("Password is required")
    if (!isVaildPass(password.trim())) return res.status(400).send({ status: false, msg: "Please provide a valid Password with min 8 to 15 char with Capatial & special char" })

// ------------------------Create User Data----------------------------------------------------------
    let saveData = await userModel.create(data);
    return res.status(201).send({ status: true, msg: saveData });

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
// --------------------------------Login User-----------------------------------------------------------

let loginUser=async function(req,res){
    try{
        let data = req.body
        const { email, password } = data;
      if(Object.keys(data).length===0) { return res.status(400).send({status:false,message:"Please Provide the Credential"})}
      
     if(!(email)) {
        return res.status(400).send({status:false,message:"Email is mandatory"})}

     if(!(password)) { 
        return res.status(400).send({status:false,message:"Password is mandatory"})}
  
      let userPresent= await userModel.findOne({email:email,password:password})
  
      if(!(userPresent)) {
         return res.status(400).send({status:false,message:"Email or Password is incorrect"})
        }
  
      let token=jwt.sign({
          userId:userPresent._id.toString(),
      
      },"anil",{expiresIn:"2hr"},)
  
      res.setHeader("x-api-key",token)
      res.status(200).send({status:true,token:token})
  
    }
    catch(err){
      res.status(500).send({status:false,messege:err.message})
    }
  };
  // -----------------------------Update User Profile--------------------------------------------
  
  const updateUserProfile= async function (req, res)  {
      try {
          let data = req.body
          let userId = req.params.userId
          const { username, phone,email } = data
          if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Add fields to update" });
          if (username) {
            let findName = await userModel.findOne({ username: username })
            if (findName) return res.status(400).send({ status: false, message: "Name is allrady exist" })
        }
         if (email) {
         if (!isValidEmail(email.trim())) return res.status(400).send({ status: false, msg: "Please provide a valid Email-Id" })
            let findEmail = await userModel.findOne({ email: email })
            if (findEmail) return res.status(400).send({ status: false, message: "Email is allrady exist" })
        }
         if (phone) {
            let checkPhone = await userModel.findOne({ phone: phone })
            if (checkPhone) return res.status(400).send({ status: false, message: "Phone is allrady exist" })
        }

        let updatedData = await userModel.findOneAndUpdate({ _id: userId }, {
            $set: { username: username, phone: phone, email:email }
        }, { new: true, upsert: true })

        return res.status(200).send({ status: true, msg: "User Profile updated successfuly", data: updatedData })

        }catch(err){
            res.status(500).send({status:false,messege:err.message})
        }
    };
    
// -----------------------------------Fetch All User Data------------------------------------------
    
      const getAllUser = async function(req,res){
        try{
             const getUser = await userModel.find()
             return res.status(200).send({ status: true, msg: getUser });
    
        }catch(err){
            res.status(500).send({status:false, messege:err.message})
        }
      };

// ----------------------------------Delete User-----------------------------------------------------

      const deleteUser = async (req, res) => {
        try {
            let userId = req.params.userId
            const delateUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: { isDeleted: true, deletedAt: new Date(Date.now()) }, }, { new: true });
    
            if (delateUser) {
                await userModel.updateMany({ userId: delateUser._id }, { $set: { isDeleted: true } });
                return res.status(200).send({ status: true, msg: "User is deleated successfully", data: delateUser })
            } else {
                return res.status(404).send({ status: false, msg: "No User found for this id" })
            }
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message });
        }
    };
    
//-----------------------------exports module-----------------------------------------------------   
module.exports={ createUser,loginUser,updateUserProfile,getAllUser,deleteUser }

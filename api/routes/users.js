//step 3 continuatuion
import express from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// router.get("/checkauthentication", verifyToken, (req,res,next)=>{
//     res.send("Hello user you are authenticated")
// })

// router.get("/checkuser/:id", verifyUser, (req,res,next)=>{
//     res.send("Hello user you are logged in and you can delete your account")
// })

// router.get("/checkadmin/:id", verifyAdmin, (req,res,next)=>{
//     res.send("Hello admin you are logged in and you can delete all account")
// })
//Update
router.put("/:id", verifyUser, updateUser)

//Delete

router.delete("/:id", verifyUser, deleteUser)

//Get
router.get("/:id", verifyUser, getUser)

//Get All

router.get("/", verifyAdmin, getUsers)


export default router;
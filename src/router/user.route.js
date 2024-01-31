import { Router } from "express";
const user_router = Router();
import { register, login, logout, change_password, change_profile } from "../controller/user.controller.js";
import { ctreate_post, update_post, get_All_post, get_user_Allpost, get_single_post, delete_post } from "../controller/post.controller.js";
import userAuth from "../middelware/authantication.js";
// import register from "../controller/user.controller.js";




user_router.post('/register', register);
user_router.post('/login', login);
user_router.post('/logout', logout);
user_router.patch('/change_password', userAuth, change_password);
user_router.patch('/change_profile', userAuth, change_profile);

user_router.post('/create_post', userAuth, ctreate_post);
user_router.patch('/update_post', userAuth, update_post);
user_router.get('/get_All_post', get_All_post);
user_router.get('/get_user_Allpost', userAuth, get_user_Allpost);
user_router.get('/get_single_post', get_single_post);
user_router.delete('/delete_post', userAuth, delete_post);

// user_router.post('/register', register);


export default user_router;
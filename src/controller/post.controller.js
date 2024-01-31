import RESPONSE from '../helper/response.js';
import path from 'path';
import fs from 'fs';
import db from '../config/db.config.js';
const post = db.post;

function uploadFile(fileObjArray) {
    let image = null;

    if (Array.isArray(fileObjArray)) {
        // Generate a unique filename
        image = `${Date.now()}` + path.extname(fileObjArray[0].originalname);
        let uploadPath = path.join(image, '../src/public/post/', `${Date.now()}` + image);
        var outStream = fs.createWriteStream(uploadPath);
        outStream.write(fileObjArray[0].buffer);
        outStream.end();
    }

    return image;
}

//ctreate_post
const ctreate_post = async (req, res) => {
    try {
        const profileImageName = uploadFile(req.files);
        const authUser = req.user.user_id;

        const { post_name, description } = req.body;

        // Create user
        const post_data = await post.create({
            user_id: authUser,
            post_name,
            photo: profileImageName,
            description,
        });

        //save 
        post.post_name = post_name,
            post.description = description;
        await post_data.save();

        return RESPONSE.success(res, 2013, post_data)

    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999)
    }
};

//update_post
const update_post = async (req, res) => {
    try {

        const authUser = req.user;
        const { post_name, description, postId } = req.body

        const post_find = await post.findByPk(postId);

        //find post
        if (!post_find) {
            return RESPONSE.error(res, 2014, post_find);
        }

        if (authUser.user_id !== post_find.user_id) {
            return RESPONSE.error(res, 2015);
        }

        //save
        post_find.post_name = post_name,
            post_find.description = description,
            await post_find.save();
        return RESPONSE.success(res, 2016, post_find);
    } 

    catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
};

//get_All_post
const get_All_post = async (req, res) => {
    try {
        //find_post
        const post_find = await post.findAll();
        return RESPONSE.success(res, 2017, post_find);
    }

    catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
};

//get_user_Allpost
const get_user_Allpost = async (req, res) => {
    try {
        const authUser = req.user.user_id;
        if (!authUser) {
            return RESPONSE.error(res, 2008, authUser);
        }

        //find_post
        const post_find = await post.findAll({
            where: {
                user_id: authUser,
            },
        });
        return RESPONSE.success(res, 2017, post_find);
    }

    catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
};

//get_single_post
const get_single_post = async (req, res) => {
    try {

        const { postId } = req.body
        const post_find = await post.findByPk(postId);
        return RESPONSE.success(res, 2018, post_find);

    }
    catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
};

//delete_post
const delete_post = async (req, res) => {
    try {
        const { postId } = req.body;
        const authUser = req.user;

        //find post
        const post_find = await post.findByPk(postId);
        if (!post_find) {
            return RESPONSE.error(res, 2014, post_find)
        }

        if (authUser.user_id !== post_find.user_id) {
            return RESPONSE.error(res, 2015);

        }

        //delete_post
        await post_find.destroy();
        return RESPONSE.success(res, 2019);
    }

    catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
};


export { ctreate_post, update_post, get_All_post, get_user_Allpost, get_single_post, delete_post };
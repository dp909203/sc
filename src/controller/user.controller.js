import bcrypt from 'bcrypt';
import Validator from 'validatorjs';
import RESPONSE from '../helper/response.js';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import db from '../config/db.config.js';

const User_info = db.user_info;
const User = db.User;
const UserPassword = db.user_password;
const User_session = db.user_sessions

function uploadFile(fileObjArray) {
    let image = null;

    if (Array.isArray(fileObjArray)) {
        // Generate a unique filename
        image = `${Date.now()}` + path.extname(fileObjArray[0].originalname);
        let uploadPath = path.join(image, '../src/public/register/', `${Date.now()}` + image);
        var outStream = fs.createWriteStream(uploadPath);
        outStream.write(fileObjArray[0].buffer);
        outStream.end();
    }

    return image;
}

//register
const register = async (req, res) => {

    const validation = new Validator(req.body, {
        email: "required|string|email",
        phone_number: "required|digits:10",
        password: [
            "required",
            "regex:/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%?=*&])(?=.*[A-Z]).{8,}$/",
        ],
    });

    //returning error 
    if (validation.fails()) {
        const errorMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(errorMessage));
    }

    try {

        const profileImageName = uploadFile(req.files);

        const existingUser_number = await User_info.findOne({
            where: {
                phone_number: req.body.phone_number
            }
        });
        if (existingUser_number) {
            return RESPONSE.error(res, 2001, existingUser_number)
        }

        const existingUser_email = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (existingUser_email) {
            return RESPONSE.error(res, 2002, existingUser_email)
        }

        const { first_name, last_name, phone_number } = req.body;

        // Create user
        const newUser = await User.create({
            email: req.body.email,
            username: req.body.username
        });

        // Create user_password 
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await UserPassword.create({
            user_id: newUser.id,
            password: hashedPassword,
        });

        // Create user_info
        const userInfo = await User_info.create({ first_name, last_name, phone_number, user_id: newUser.id, profile_photo: profileImageName });
        return RESPONSE.success(res, 2003, userInfo);
    }

    catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999)
    }
};

//login
const login = async (req, res) => {
    // Validation to check format
    const validation = new Validator(req.body, {
        email: "required|string|email",
        password: "required|string",
    });

    // Returning error 
    if (validation.fails()) {
        const errorMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(errorMessage));
    }

    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ where: { email } });

        if (!findUser) {
            return RESPONSE.error(res, 2004, findUser);
        }

        // Compare password
        const userPassword = await UserPassword.findOne({ where: { user_id: findUser.id } });

        if (!userPassword) {
            return RESPONSE.error(res, 2005, userPassword);
        }

        const passwordValid = await bcrypt.compare(password, userPassword.password);

        if (!passwordValid) {
            return RESPONSE.error(res, 2005, passwordValid);
        }

        const existingSession = await User_session.findOne({ where: { user_id: findUser.id } });

        // Create token
        const secretKey = process.env.SECRET_KEY;

        const token = jwt.sign({ id: findUser.id, email: findUser.email }, secretKey, {
            expiresIn: '59m'
        });

        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 10);

        if (existingSession) {

            await existingSession.update({ token, expire_time: expirationTime });
        } else {

            await User_session.create({ user_id: findUser.id, token, expire_time: expirationTime });
        }

        return RESPONSE.success(res, 2006, existingSession);

    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }

};

//logout
const logout = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return RESPONSE.error(res, 2008, authorizationHeader);
        }

        const token = authorizationHeader

        const userSession = await User_session.findOne({ where: { token } });

        if (userSession) {
            await userSession.destroy();
            return RESPONSE.success(res, 2007);
        } else {
            return RESPONSE.error(res, 2008);
        }

    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
};

//change_password
const change_password = async (req, res) => {

    const validation = new Validator(req.body, {
        newPassword: [
            "required",
            "regex:/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%?=*&])(?=.*[A-Z]).{8,}$/",
        ],
    });

    //returning error 
    if (validation.fails()) {
        const errorMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(errorMessage));
    }
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.user_id;

        // Find the user password
        const userPassword = await UserPassword.findOne({ where: { user_id: userId } });

        // Check userPassword exists
        if (!userPassword) {
            return RESPONSE.error(res, 2009, userPassword);
        }

        // Check old password  
        if (!oldPassword || !userPassword.password) {
            return RESPONSE.error(res, 2010);
        }

        const passwordValid = await bcrypt.compare(oldPassword, userPassword.password);

        if (!passwordValid) {
            return RESPONSE.error(res, 2010);
        }

        // Update the password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await userPassword.update({ password: hashedNewPassword });
        return RESPONSE.success(res, 2011);

    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
};


//change_profile
const change_profile = async (req, res) => {

    try {
        const { first_name, last_name, phone_number } = req.body;
        const authUser = req.user.user_id;

        if (!authUser) {
            return RESPONSE.error(res, 2008);
        }

        const userInfo = await User_info.findByPk(authUser);
        if (!userInfo) {
            return RESPONSE.error(res, 2009, userInfo)
        }

        //compare authuser 
        if (userInfo.userId != authUser.id) {
            return RESPONSE.error(res, 2008)
        }

        //update 
        userInfo.first_name = first_name;
        userInfo.last_name = last_name;
        userInfo.phone_number = phone_number;

        await userInfo.save();
        return RESPONSE.success(res, 412, userInfo);

    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
};



export { register, login, logout, change_password, change_profile };

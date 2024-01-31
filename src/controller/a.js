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
            return RESPONSE.error(res, 2005, "Invalid password");
        }

        const passwordValid = await bcrypt.compare(password, userPassword.password);

        if (!passwordValid) {
            return RESPONSE.error(res, 2005, "Invalid password");
        }

        // Check if a session already exists
        const existingSession = await User_session.findOne({ where: { user_id: findUser.id } });

        // Create or update token
        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign({ id: findUser.id, email: findUser.email }, secretKey, {
            expiresIn: '10m'
        });

        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 10);

        if (existingSession) {
            // Update existing session
            await existingSession.update({ token, expire_time: expirationTime });
        } else {
            // Create new session
            await User_session.create({ user_id: findUser.id, token, expire_time: expirationTime });
        }

        return RESPONSE.success(res, 2006, { token });

    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
};


import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import RESPONSE from '../helper/response.js';
import User from '../models/user.js'; // Adjust the path based on your actual file structure
import UserPassword from '../models/userPassword.js'; // Adjust the path based on your actual file structure
import User_session from '../models/userSession.js'; // Adjust the path based on your actual file structure




import jwt from "jsonwebtoken";
import RESPONSE from "../helper/response.js";
import db from "../config/db.config.js";
import config from "../config/config.js"
import Op from "sequelize";
import { log } from "console";

const User_session = db.user_sessions;
const user = db.User;



const userAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        // const token = authorization?.split('Bearer')[1] || null;
        const token = req.headers['authorization'];
        if (!token) {
            return RESPONSE.error(res, 401);
        }


        function verifyToken(token) {
            let jwtResponse = {
                success: true
            }
            try {
                const decoded = jwt.verify(token, config.secretKey);
                jwtResponse.decoded = decoded
            } catch (error) {
                jwtResponse.success = false
                jwtResponse.error = error
            } finally {
                return jwtResponse;
            }
        }

        const decoded = verifyToken(token);
        // console.log('decoded :>> ', decoded);
        if (!decoded.success) {
            return RESPONSE.error(res, 401);
        }

        const is_auth = await User_session.findOne({

            where: {

                token: token,
                // expire_time: {
                //     [Op.gte]: new Date(),
                // },

            },
        });

        if (!is_auth) {
            return RESPONSE.error(res, 2008, is_auth);
        }
        //  console.log("==============>", is_auth);


        req.user = is_auth;
        req.token = is_auth.token;

        next();

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999, error);
    }
};

export default userAuth;

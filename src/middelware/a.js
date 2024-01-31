// import verify from "jsonwebtoken";
// import RESPONSE from "../helper/response.js";
// import db from "../config/db.config.js";
// import config from "../config/config.js"
// import { Op } from "sequelize";

// const User_session = db.user_sessions;
// const user = db.User;

// // function verifyToken(req, res, next) {

// //     // const token = req.headers['authorization'];
// //     if (!token) {
// //         return res.status(401).json({ error: 'Authentication required' });
// //     }

// //     jwt.verify(token, config.secretKey, async (error, user) => {

// //         if (!User_session) {
// //             return res.status(403).json({ error: 'Invalid session token' });
// //         }

// //         req.user = user;
// //         next();
// //     });


// // };
// // console.log("===================>");

// function verifyToken(token) {
//     try {
//         const decoded = jwt.verify(token, config.secretKey);

//         return decoded;
//     } catch (error) {
//         return null;
//     }
// }





// const userAuth = async (req, res, next) => {
//     try {
//         const { authorization } = req.headers;
//         const token = authorization?.split('Bearer ')[1] || null;
//         // console.log("authorization========>",authorization);
//         if (!token) {
//             return RESPONSE.error(res, 1009, 401);
//         }

//         const decode = verifyToken(token);
//         if (!decode) {
//             return RESPONSE.error(res, 1009, 401);
//         }

//         // Find user session
//         const is_auth = await User_session.findOne({
//             where: {
//                 token,
//                 expire_time: {
//                     [Op.gte]: new Date(),
//                 },
//                 logout_time: null,
//             },       
//             include: [
//                 {
//                     model: user,
//                     where: {
//                         is_verify: true,
//                         is_active: true,
//                     },
//                     attributes: ['id', 'email', 'username'],
//                 },
//             ],
//         });


//         if (!is_auth) {
//             return RESPONSE.error(res, 1009, 401);
//         }

//         req.user = is_auth.user.toJSON();
//         req.token = is_auth.token;
//         next();
//     } catch (error) {
//         return RESPONSE.error(res, 1009, 401, error);
//     }
// };

// export default userAuth;

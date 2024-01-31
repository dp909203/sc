const MESSAGES = {
    401: "You are unauthorised",
    9999: "Something went wrong!",

    2001: 'Number already exists',
    2002: 'Email already exists',
    2003: 'Register successfully',
    2004: 'This email is not available',
    2005: 'Invalid password',
    2006: 'login successfully',
    2007: 'Logout successfully',
    2008: 'Invalid session',
    2009: 'user not find',
    2010: 'old password not match',
    2011: 'Password update successfully',
    2012: 'update successfully',

    2013: 'post upload successfully',
    2014: 'post not found',
    2015: 'permission denied ',
    2016: 'post update successfully',
    2017: 'get All post',
    2018: 'single post get',
    2019: 'post delete successfully',


    // 1001: 'The email has already been taken',
    // 1010: 'Register successfully',
    // 1008: 'This email is not available',
    // 1002: 'User doesnt exist',
    // 1001: 'Invalid password',
    // 1004: 'login successfully',
    // 1016: 'Email or number already exists',

    // 1003: 'Old password does not match',
    // 1006: 'Password reset successfully',
    // 1007: 'Authentication required',
    // 1009: 'Invalid session token',
    // 1011: 'Post created successfully',
    // 1012: 'Post not found',
    // 1013: 'Post retrieved successfully',
    // 1014: 'Post update successfully',
    // 1015: 'You do not have permission ',
    // 1017: 'post delete successfully',
    // 1018: 'No files uploaded',
    // 1019: 'File upload failed',
    // 1020: 'Unauthorized: Missing token',
    // 1021: 'Unauthorized: Invalid token',
    // 1022: 'User logged out successfully',
    // 1023: 'USer delete successfully'
};

const getMessage = (messageCode) => {
    if (isNaN(messageCode)) {
        return messageCode;
    }
    return messageCode ? MESSAGES[messageCode] : "";
};

export default getMessage;
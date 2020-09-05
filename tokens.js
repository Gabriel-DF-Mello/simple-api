const { sign } = require("jsonwebtoken");

const createAccessToken = (userId, userPermit) => {
    return sign({id:userId, permit:userPermit}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
}

const createRefreshToken = (userId, userPermit) => {
    return sign({id:userId, permit:userPermit}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });
}

const sendAccessToken = (res, req, accesstoken) => {
    res.send({
        accesstoken
    })
}

const sendRefreshToken = (res, refreshtoken) => {
    res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/refresh_token'   
    })
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken
}
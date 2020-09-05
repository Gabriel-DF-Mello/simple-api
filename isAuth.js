const { verify } = require("jsonwebtoken");

const isAuth = (req) => {
    const authorization = req.headers['authorization'];
    if(!authorization) throw new Error("Você não está logado");

    const token = authorization.split(' ')[1];
    const user = verify(token, process.env.ACCESS_TOKEN_SECRET);
    return user;
}

const isAdmin = (req) => {
    const authorization = req.headers['authorization'];
    if(!authorization) throw new Error("Você não está logado");

    const token = authorization.split(' ')[1];
    const user = verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(!user.permit) throw new Error("Você não tem permissão para acessar isso.");
    return user;
}

module.exports = {
    isAuth,
    isAdmin
}
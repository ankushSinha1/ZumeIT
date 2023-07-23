import jwt from "jsonwebtoken"

//A function that generates a access token
export const tokenGen = (data) => {
    return jwt.sign({data},process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'})
}
//A function that generates a refresh token
export const refreshTokenGen = (data) => {
    return jwt.sign({data}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'})
}
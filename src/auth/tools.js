import jwt from 'jsonwebtoken'

const generateJWT = payload => new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1 week' }, (err, token) => {
        if (err) reject(err)
        resolve(token)
    })
)

export const verifyJWT = token => new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) reject(err)
        resolve(decodedToken)
    })
)

export const JTWAuthenticate = async user => {
    const accessToken = await generateJWT({ _id: user._id })
    return accessToken
}
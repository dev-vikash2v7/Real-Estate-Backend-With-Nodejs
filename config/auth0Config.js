import {auth} from 'express-oauth2-jwt-bearer'

// console.log(process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https://eazyhome-backend.vercel.app')

const jwtCheck = auth({
    audience: process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https://eazyhome-backend.vercel.app',
    // audience: 'http://localhost:3000' ,
    issuerBaseURL: "https://dev-0tg7d6jf1g8rypyh.us.auth0.com/",
    tokenSigningAlg: "RS256"
})

export default jwtCheck
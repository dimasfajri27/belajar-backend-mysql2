// Memanggil library dan konfigurasi
const jtw = require("jsonwebtoken") /* require("jsonwebtoken") mengambil library jsonwebtoken. 
jwt adalah variabel yang digunakan untuk mengakses fungsi dari library tersebut.
Library ini membantu membuat dan memverifikasi JWT.*/
require(`dotenv`).config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET belum diset di .env");

module.exports = function auth(req, res, next) {
    try{
        // ambil header Authorization : Bareer (token)
        const authHeader = req.headers["authorization"];
        if(!authHeader) return res.status(401).json({message : "No token proviedd"});  
        
        const parts = authHeader.split(" ");
        if(parts.length !== 2 || parts[0] !== "Bearer"){
            return res.status(401).json({message : "Invalid Authorization Header Format"});
        }
        const token = parts[1];

        // verifikasi token
        jtw.verify(token, jwtSecret, (error, decoded) => {
            if(error) return res.status(401).json ({message : "Invalid Token"});
            
            // else kalo valid
            // simpan payload berupa data user
            req.user = {id : decoded.id, email : decoded.email};
            next();
        })
    }catch(error){
        next(error);
    }
}
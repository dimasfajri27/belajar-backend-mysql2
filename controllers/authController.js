const pool = require("../config/db");
const bcrypt = require('bcrypt');
const { json } = require("express");
const jwt = require("jsonwebtoken");
require(`dotenv`).config();

// cek apakah jwt token kita ada
const jwtSecret = process.env.JWT_SECRET;
if(!jwtSecret) throw new Error("JWT_SECRET belum diset di .env")

const SALT_ROUNDS = 10; //bcrypt salt rounds

module.exports ={
    // register POST
    //  post //api/auth/register
register : async (req, res, next) => {
    try{
        const {email, password, name} = req.body;
        
        // validasi sederhana
        if(!email || !password) return res.status(400).json({message : "Email & Password Wajib"})
        if(password.length < 6 ) return res.status(400).json({messgae : "Password minimal 6 karakter"});


        // cek apakah user sudah ada
        const [existing] = await pool.execute("SELECT id FROM users WHERE email =?",[email]);
        if(existing.length > 0){
            res.status(409).json({message : "Email sudah terdaftar"});
        }

        // else kalo belum ada berarti bisa register/insert
        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        // insert ke tabel users
        const [result] = await pool.execute(
            "INSERT INTO users (email, name, password) VALUES (?,?,?)",
            [email, name || null, hashed]
        )

        const insertedID = result.insertId;
        return res.status(201).json({id : insertedID, email, name : name || null});

    }catch(error){
        next(error);
    }
},

// POST /api/auth/login
login : async (req, res, next) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password) return res.status(400),json({message : "Email dan Password wajib"});

        // ambil data user nya apakah dia sudah daftar
        const [rows] = await pool.execute("SELECT * FROM users WHERE email =?", [email]);
        if(rows.length === 0) return res.status(401).json({Message:"Invalid Credentials"});

        const user = rows[0];

        // bandingkan password
        const match = await bcrypt.compare(password,user.password);
        if(!match) return res.status(401).json({message : "Invaid Creadentials"});

        // Generate JWT
        const payload = {id : user.id, email : user.email};

        const token = jwt.sign(payload, jwtSecret, {expiresIn : "1h"}); //1 hour

        return res.json({
            message : "Login Berhasil",
            token,
            user : {id : user.id, email : user.email, name : user.name}
        });


    }catch(error){
        next(error);
    }
}
}
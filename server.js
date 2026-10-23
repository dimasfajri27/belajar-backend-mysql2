require(`dotenv`).config();
const express = require("express");
const app = express();

// import routes
const auth = require("./routes/authRoutes");
const category = require("./routes/categoryRoutes");
const movie = require("./routes/movieRoutes");

// middlware global untuk parsing json
app.use(express.json());

// mount roters
app.use("/api/auth", auth);
app.use("/api/category", category)
app.use("/api/movie", movie)

// basic eror handling
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500).json({error : error.message || "Internl Server Error"});
});

// start
const PORT = process.env.PORT || 3000
app.listen(PORT, () =>{
    console.log("Server berjalan pada port" + PORT);
    
});
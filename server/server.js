require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const foodRoutes = require('./routes/foodRoutes')
const userRoutes = require('./routes/userRoutes')
const app = express()

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
app.use("/api/food", foodRoutes)
app.use("/api/user", userRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected successfully to port", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    } )

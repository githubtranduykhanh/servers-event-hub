const express = require('express')
require('dotenv').config()
const cors = require('cors')

const app = express()

const initRoutes = require('./src/routers')
const {dbConnect} = require('./src/configs/dbConnect')

app.use(cors({
    origin:'*' || process.env.URL_CLIENT,
    credentials:true //Lưu cookie trên trình duyệt cùng với cấu hình withCredentials:true axios
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

dbConnect()
initRoutes(app)

const port = process.env.PORT || 8888

app.listen(port,()=>{console.log('Server is runing on the port '+ port)})
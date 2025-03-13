import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
dotenv.config()

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);

//common middleware
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

app.use(cookieParser());

const connectDB = async () => {
    try {
        const connectingDB = await mongoose.connect(`${process.env.MONGODB_URL}/Email`);
        console.log(`MongoDB connected successfully:: ${connectingDB.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection error in database folder:: ${error}`);
        process.exit(1);
    }
}

const dataSchema = new mongoose.Schema({
    name: String,
    message: String,
    email: String,
    subject: String
})

const dataModel = mongoose.model("Data", dataSchema)

app.post('/api/v1/sendEmail', async (req, res) => {
    const { name, email, subject, message } = req.body
    try {
        const newData = await dataModel.create({
            name,
            message,
            email,
            subject
        })

        res.status(200).json(newData)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
    }
})

const port = process.env.PORT || 5000

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
})
.catch((error) => {
    console.log("Connection error while setting it up in index.js file", error);
    process.exit(1);
})


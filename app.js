import express from "express";
import cors from 'cors';
import { APP_PORT } from "./config/index.js";
// require('dotenv').config();
import  { connectDB } from "./database/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import './cron.js';
const app = express();

connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    console.log("fdsfdj");
    res.send("Welcome to site..");
});
app.use('/api',routes);
app.use(errorHandler);
const PORT = process.env.PORT || APP_PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
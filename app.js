import express from "express";
import cors from 'cors';
import { APP_PORT } from "./config/index.js";
// require('dotenv').config();
import  { connectDB } from "./database/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import { File } from "./model/index.js";
import './cron.js';
// import path from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
app.get('/file', async (req, res) => {
    //file located at maindir/logs/applelog.txt
    // const file = path.join(__dirname, 'logs/applelog.txt');
    // res.sendFile(file);
    try {
        const document = await File.fetchByName('applelog.txt');
        if (!document) {
          return res.status(404).send('File not found');
        }
        res.send(document.content);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
})
app.get('/jws', (req, res) => {
    // console.log("fdsfdj");
    res.render("new_jws");
});
app.use(errorHandler);
const PORT = process.env.PORT || APP_PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
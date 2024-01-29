const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieparser = require('cookie-parser');
require('./config/dbconnection');
const fileUpload = require('express-fileupload');
const status = require('express-status-monitor')

const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const chapterRoutes = require('./routes/chapterRoutes');

const PORT = process.env.PORT || 8000
const app = express();

app.use(status());
app.use(fileUpload());
app.use(express.urlencoded({extended: false}));
app.use(cookieparser());
app.use(cors());
app.use('/public', express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.send('Welcome');
});

app.use(userRoutes);
app.use(courseRoutes);
app.use(chapterRoutes);


// Create server
app.listen(PORT, ()=>{
    console.log(`server listening on ${PORT}`);
});

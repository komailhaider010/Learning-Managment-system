const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieparser = require('cookie-parser');
require('./config/dbconnection');
const status = require('express-status-monitor')

const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const commentsRoutes = require('./routes/commentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const ordersRoutes = require('./routes/orderRoutes');



const PORT = process.env.PORT || 8000
const app = express();

app.use(status());
app.use(express.urlencoded({extended: false}));
app.use(cookieparser());
app.use(cors());
app.use('/public', express.static(__dirname + '/public'));

// User webhook before express.json() to get raw body for Stripe signature verification
app.use("/api/webhook", webhookRoutes);
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Welcome To Learning Management System API');
});

app.use("/api/user",userRoutes);
app.use(courseRoutes);
app.use("/api/payment", paymentRoutes);
app.use(chapterRoutes);
app.use(commentsRoutes);
app.use(reviewRoutes);
app.use("/api/orders", ordersRoutes);


// Create server
app.listen(PORT, ()=>{
    console.log(`✅ server listening on http://localhost:${PORT}`);
});

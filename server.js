
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');


dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/orders',require('./routes/orderRoutes'));

app.use('/api/otp', require('./routes/otpRoutes'));

app.use('/api/contact', require('./routes/contact'));

app.get('/',(req, res) => {
    res.send("Laundry Backend API Running ✅");
    
})



const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
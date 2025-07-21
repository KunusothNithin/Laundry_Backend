const Otp = require('../models/Otp');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const generateOtp = require('../utils/generateOtp');


const sendOtp = async (req, res) => {
    const {email} = req.body;

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    
    await Otp.create({email, otp: hashedOtp});

    await sendEmail(email,"Your Laundry OTP",`Your OTP is: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully" });
};

const verifyOtp = async (req, res) => {
    const {email, otp} = req.body;

    const otpRecord = await Otp.findOne({email});
    if(!otpRecord){
        return res.status(400).json({message: "OTP expired or not found"});
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp);

    if (!isValid) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
    await Otp.deleteMany({email});

    res.status(200).json({ message: "OTP verified successfully" });
};

module.exports = {sendOtp, verifyOtp};
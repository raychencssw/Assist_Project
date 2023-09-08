const express = require('express');
const crypto = require('crypto');
const uuid = require('uuid');
const nodemailer = require('nodemailer');
const User = require('./models/user');
const ResetToken = require('./models/resettokens');
const bcrypt = require("bcrypt");
const router = express.Router();
require('dotenv').config();
const emailApi = process.env.BREVO_EMAIL_API


function sendResetEmail(email, token, user) {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
            user: 'jitbaner@usc.edu',
            pass: emailApi,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    const resetLink = `http://localhost:4200/reset-password/${token}`;
    const mailOptions = {
        from: 'no_reply@assistproject.org',
        to: email,
        subject: 'Password Reset Link',
        text: `Click on the following link to reset your password: ${resetLink}`,
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ', error);
            return res.status(500).json({ message: 'failed to create token!' })
        } else {
            console.log('Email sent: ', info.response);
            return res.status(200).json({ message: 'token created' })
        }
    });

}

router.post('/forgot-password', async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    const token = uuid.v4();
    try {
        const temp = new ResetToken({
            token: token,
            email: email
        })
        await temp.save()
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create reset token.' });
    }
    sendResetEmail(email, token, user);
})
router.get('/forgot-password/verify-token/:token', async (req, res) => {
    const token = req.params.token
    try {
        const foundToken = await ResetToken.findOne({ token: token })
        if (!foundToken) {
            return res.status(400).json({ message: 'token expired' })
        }
        res.status(200).json({ message: 'Token found' })
    } catch (err) {
        return res.status(500).json({ message: 'internal server error' })
    }
})
router.post('/forgot-password/set-password', async (req, res) => {
    try {
        const foundToken = await ResetToken.findOne({ token: req.body.token })
        const email = foundToken.email
        const user = await User.findOne({ email: email })
        user.password = user.generateHash(req.body.password)
        await user.save()
        console.log("PASSWORD CHANGED")
        res.status(200).json({ message: 'Password changed!' })
    } catch (error) {
        res.status(400).json({ message: 'internal server error!' })
    }


})

module.exports = router;
const express = require('express');
const crypto = require('crypto');
const uuid = require('uuid');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const router = express.Router();
require('dotenv').config();
const emailApi = process.env.BREVO_EMAIL_API



router.post('/send-email', async (req, res) => {
    const email = req.body.email
    const mailOptions = {
        from: 'no_reply@assistproject.org',
        to: email,
        subject: 'Confirmation: Thanks for being a supervisor from ASSIST PROJECT',
        text: `You have supervised the event successfully!`

    }; const transporter = nodemailer.createTransport({
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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ', error);
            return res.status(500).json({ message: 'failed to create token!' })
        } else {
            console.log('Email sent: ', info.response);
            return res.status(200).json({ message: 'token created' })
        }
    })

})
router.post('/send-email-unsupervise', async (req, res) => {
    const email = req.body.email
    const mailOptions = {
        from: 'no_reply@assistproject.org',
        to: email,
        subject: 'Confirmation for unsurpervising the event from ASSIST PROJECT',
        text: `You have unsupervised the event successfully!`

    }; const transporter = nodemailer.createTransport({
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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ', error);
            return res.status(500).json({ message: 'failed to create token!' })
        } else {
            console.log('Email sent: ', info.response);
            return res.status(200).json({ message: 'token created' })
        }
    })

})
module.exports = router;
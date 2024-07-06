const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors');
const prisma = new PrismaClient();
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const oauth2Client = new google.auth.OAuth2(
    'YOUR_CLIENT_ID',
    'YOUR_CLIENT_SECRET',
    'YOUR_REDIRECT_URL'
);
oauth2Client.setCredentials({
    refresh_token: process.env.token_uri,
});

app.post('/referrals', async (req, res) => {
    const { referrerFullName, referrerEmail, refereeFullName, refereeEmail, relationshipToReferee, positionBeingReferred, reasonForReferral, permissionGranted } = req.body;

    // Validate data
    if (!referrerFullName || !referrerEmail || !refereeFullName || !refereeEmail || !relationshipToReferee || !positionBeingReferred || !reasonForReferral || !permissionGranted) {
        return res.status(400).send({ error: 'All fields are required.' });
    }

    try {
        const referral = await prisma.referral.create({
            data: {
                referrerFullName,
                referrerEmail,
                refereeFullName,
                refereeEmail,
                relationshipToReferee,
                positionBeingReferred,
                reasonForReferral,
                permissionGranted,
            },
        });

        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'djdiptayan1@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.client_secret,
                refreshToken: process.env.token_uri,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: 'djdiptayan1@gmail.com',
            to: referrerEmail,
            subject: 'Referral Confirmation',
            text: `Thank you for referring ${refereeFullName}. We will review your referral and get back to you shortly.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        });
        const response_back = { message: "Data saved successfully!" }
        res.status(200).send(response_back);
    } catch (error) {
        console.error(process.env.token_uri);
        res.status(500).send({ error: 'Something went wrong. Please try again.', error });
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

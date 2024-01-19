const express = require('express');
const twilio = require('twilio');
const { VoiceResponse } = require('twilio').twiml;
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio(accountSid, authToken);

router.post('/incoming-call', async (req, res) => {
    const incomingNumber = req.body.To; // The Twilio number that received the call

    try {
        // Fetch forwarding number(s) from Supabase
        const { data, error } = await supabase
            .from('numbers')
            .select('forwardingnumbers, state')
            .eq('twilionumber', incomingNumber)
            .single();

        if (error) throw error;

       // Create a new TwiML response
        const response = new VoiceResponse();
        const dial = response.dial();

         if (data.state === 'party') {
            // In party mode, auto-press '9'
            response.say('Welcome! You are being let in to the party.', { voice: 'alice' });
            response.play({ digits: '9' });

        // Assuming the array contains the numbers to be dialed simultaneously
       } else {

        if (data.forwardingnumbers && data.forwardingnumbers.length) {
            data.forwardingnumbers.forEach(number => {
                dial.number(number);
            });
        } else {
            throw new Error('No forwarding numbers found');
        }


       } 



        res.type('text/xml');
        res.send(response.toString());
    } catch (error) {
        console.error('Error handling incoming call:', error);
        const response = new VoiceResponse();
        response.say('An error occurred, please try again later.');
        res.type('text/xml');
        res.send(response.toString());
    }
});

router.post('/generate-twilio-number', async (req, res) => {
    console.log(req.body); // Log the request body

    try {
        let purchasedNumber;
        if (req.body.phoneNumber) {
            // If specific phone number is provided
            purchasedNumber = await twilioClient.incomingPhoneNumbers.create({
                phoneNumber: req.body.phoneNumber,
                voiceUrl: 'https://cryptic-atoll-21443-886e803f0062.herokuapp.com/incoming-call'
            });
        } else if (req.body.areaCode) {
            // If area code is provided
            purchasedNumber = await twilioClient.incomingPhoneNumbers.create({
                areaCode: req.body.areaCode,
                voiceUrl: 'https://cryptic-atoll-21443-886e803f0062.herokuapp.com/incoming-call'
            });
        } else {
            throw new Error('Phone number or area code is required');
        }

        const { data, error } = await supabase
            .from('numbers')
            .insert([{ twilionumber: purchasedNumber.phoneNumber }])
            .single();

        if (error) {
            throw error;
        }

        res.json({ message: 'Number added successfully', number: purchasedNumber.phoneNumber });


    } catch (err) {
        console.error('Error generating Twilio number:', err);
        res.status(500).send('Error generating Twilio number');
    }
});


module.exports = router;
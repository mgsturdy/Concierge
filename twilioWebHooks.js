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
const twilioClient = new Twilio(accountSid, authToken);

router.post('/incoming-call', async (req, res) => {
    const incomingNumber = req.body.To; // The Twilio number that received the call

    try {
        // Fetch forwarding number(s) from Supabase
        const { data, error } = await supabase
            .from('numbers')
            .select('forwardingnumbers')
            .eq('twilionumber', incomingNumber)
            .single();

        if (error) throw error;

        // Assuming the first number in the array is the one to forward to
        const forwardingNumber = data.forwardingnumbers[0];
        if (!forwardingNumber) {
            throw new Error('No forwarding number found');
        }

        // Connect the call to the forwarding number
        const response = new VoiceResponse();
        response.dial(forwardingNumber);

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

module.exports = router;
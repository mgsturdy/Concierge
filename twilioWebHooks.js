const express = require('express');
const { Twilio } = require('twilio');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.https://jtgkxwnakhicsfgvrcxr.supabase.co;
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0Z2t4d25ha2hpY3NmZ3ZyY3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU1NDc5NjQsImV4cCI6MjAyMTEyMzk2NH0.URmmPVhb4-7ULd9TqTlOeXgBK4siZ7eeLTfKgFwQJ30;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Twilio client
const accountSid = process.env.AC2f8a9c528f2352ef4be1a9ddb5d842e7;
const authToken = process.env.e1978824a4166bbc9539ed2dd104db17;
const twilioClient = new Twilio(accountSid, authToken);

router.post('/incoming-call', async (req, res) => {
    const incomingNumber = req.body.To; // The Twilio number that received the call

    try {
        // Fetch forwarding number(s) from Supabase
        const { data, error } = await supabase
            .from('Numbers')
            .select('ForwardingNumbers')
            .eq('TwilioNumber', incomingNumber)
            .single();

        if (error) throw error;

        // Assuming the first number in the array is the one to forward to
        const forwardingNumber = data.ForwardingNumbers[0];
        if (!forwardingNumber) {
            throw new Error('No forwarding number found');
        }

        // Connect the call to the forwarding number
        const response = new Twilio.twiml.VoiceResponse();
        response.dial(forwardingNumber);

        res.type('text/xml');
        res.send(response.toString());
    } catch (error) {
        console.error('Error handling incoming call:', error);
        const response = new Twilio.twiml.VoiceResponse();
        response.say('An error occurred, please try again later.');
        res.type('text/xml');
        res.send(response.toString());
    }
});

module.exports = router;
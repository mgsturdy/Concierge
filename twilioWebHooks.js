const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.https://jtgkxwnakhicsfgvrcxr.supabase.co;
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0Z2t4d25ha2hpY3NmZ3ZyY3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU1NDc5NjQsImV4cCI6MjAyMTEyMzk2NH0.URmmPVhb4-7ULd9TqTlOeXgBK4siZ7eeLTfKgFwQJ30;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/log-call', async (req, res) => {
    // Your logic to log the call
    // ...
});

module.exports = router;

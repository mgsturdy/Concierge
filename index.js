const express = require('express');
const bodyParser = require('body-parser');
const twilioWebHooks = require('./twilioWebHooks');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Twilio was here');
});

// Use the Twilio webhook routes
app.use(twilioWebHooks);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
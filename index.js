const express = require('express');
const bodyParser = require('body-parser');
const twilioWebhooks = require('./twilioWebhooks');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Use the Twilio webhook routes
app.use('/twilio', twilioWebHooks);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

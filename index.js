const express = require('express');
const bodyParser = require('body-parser');
const twilioWebHooks = require('./twilioWebHooks');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the root directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Use the Twilio webhook routes
app.use(twilioWebHooks);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

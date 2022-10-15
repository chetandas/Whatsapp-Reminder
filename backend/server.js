const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');
// const session = require('express-session');
var cors = require('cors')

const app = express();

const port =5000;

app.use(cors()) // Use this after the variable declaration
// view engine
app.set('views','./views') //express.static(path.join(__dirname, 'views')))
app.set('view engine', 'ejs');

// body-parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/chat',(req,res)=>{
    console.log(req.body);
    const twilio = require('twilio');
    const client = twilio(
    'AC2871e3794bfae67f1841592548420669',
    '46d4ddc5d97f3d0b18624f92535833c3'
    );
    client.messages
    .create({
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+917989119833',
    body: `${req.body.todo}`,
    mediaUrl: 'https://bit.ly/whatsapp-image-example',
    })
    .then(message => {
    console.log(message.sid);
    res.send(message.sid);
    })
    .catch(err => {
    console.error(err);
    res.send(err);
    });
})

app.listen(port,(req,res)=>{
    console.log(`Listening at http://localhost:${port}`);
})     
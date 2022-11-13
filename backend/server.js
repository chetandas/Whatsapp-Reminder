const dotenv=require('dotenv');//we use .env file to hide all our essential details lyk databse pwds,auth id etc..
const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');
// const session = require('express-session');
var cors = require('cors')
const mysql = require('mysql2')//this is for including mysql database
const app = express();//this is lyk assume instance using which we place all our request on different routes
const port = 5000;//port on which our backend will run and handle all our requests

dotenv.config({path:'./config.env'});
app.use(cors()) // Use this after the variable declaration and this is for middleware
// view engine
app.set('views', './views') //express.static(path.join(__dirname, 'views')))
app.set('view engine', 'ejs');

// body-parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

//now we will declare a variable using which we will make all the connections and queries and all
const db = mysql.createConnection({//cfreate a connection with sql database
    user: 'root',
    host: 'localhost',
    password: process.env.db_pwd,
    database: 'reminderapp'
})

//syntax is we need to mention the route in express for api request
//making a post request to add reminder
//here in this we have request and response request is the data sent from frontend and response is wat we get after making api request
app.post('/addreminder', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const remindtime = req.body.remindtime;

    //now write a query to add it into ur database
    db.query('INSERT INTO reminderdb (id,name,remindtime) VALUES (?,?,?)', [id, name, remindtime]
        , (err, result) => {
            if (err)//if der is any error while making sql query then display it
            {
                console.log(err);
            }
            else//send a respone to client who made the query the below msg
            {
                res.send("Data Inserted Successfully");
            }
        });
})

app.get('/getreminders', (req, res) => { //below this is a callback function
    db.query("SELECT *FROM reminderdb", (err, result) => {
        if (err) {
            console.log(err);//if there is any error then display it
        }
        else//if there is no error then send the result to frontend
        {
            // console.log(result);
            res.send(result);
        }
    })
})

app.delete('/deletereminder/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM reminderdb WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send("Reminder deleted successfully");
        }
    })
})
app.post('/chat', (req, res) => {
    console.log(req.body);
    const twilio = require('twilio');
    const client = twilio(
        process.env.account_sid,
        process.env.auth_token
    );
    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            to: process.env.phn_no,
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
app.listen(port, (req, res) => {
    console.log(`Listening at http://localhost:${port}`);
})     

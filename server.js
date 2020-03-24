const express = require('express')
const bodyParser = require('body-parser')
const mongoClient = require('mongodb').MongoClient
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Connection URL
//var dbUrl = "mongodb+srv://dbadmin:password@123@cluster0-lriqg.azure.mongodb.net/quotesdb?retryWrites=true&w=majority";
var dbUrl = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false";

// Database Name
const dbName = 'quotesdb';

mongoClient.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, (err, dbClient) => {
    if (err) {
        console.log('Database error: ' + err);
    } else {
        console.log('Connected successfully to server');

        app.listen(3001, () => {
            console.log('listening on 3001');
        });

        //Connect Database
        const db = dbClient.db(dbName);

        app.post('/quotes', (req, res) => {
            db.collection('quotes').insertOne(req.body, (err, result) => {
                if (err) return console.log(err)

                console.log('saved to database')
                res.redirect('/')
            })
        });

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray((err, result) => {
                if (err) return console.log(err)
                // renders index.ejs
                res.render('index.ejs', { quotes: result })
            })
        });
    }
});



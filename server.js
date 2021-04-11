// imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('db/quotes.db');

//mounts BodyParser as middleware - every request passes through it
app.use(bodyParser.urlencoded({ extended: true })); 


var quotes = [
    {
        id: 1,
        quote: "The best is yet to come",
        author: "Unknown",
        year: 2000
    },
    {
        id: 2,
        quote: "This is a quote",
        author: "First Last",
        year: 1930
    },
    {
        id: 3,
        quote: "This is another quote",
        author: "First2 Last2",
        year: 1910
    }
];

//Create table

db.run('CREATE TABLE Quotes (ID Integer PRIMARY KEY AUTOINCREMENT, Quote TEXT, Author TEXT, Year INT)', function(err){
    if(err){
        console.log(err.message);
    }
    else{
        db.run('INSERT INTO Quotes (Quote, Author, Year) VALUES ("The best is yet to come.", "Unknown", 2000)');
        db.run('INSERT INTO Quotes (Quote, Author, Year) VALUES ("This is a quote.", "First Last", 1930)');
        db.run('INSERT INTO Quotes (Quote, Author, Year) VALUES ("This is another quote", "First2 Last2", 1910)');
    }
});

// ROUTES

app.get('/', function(req, res) {
    res.send("Get request received at '/' ");
});

app.get('/quotes', function(req, res){
    if(req.query.year){
        db.all('SELECT * FROM Quotes WHERE Year = ?', [req.query.year], function(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                console.log("Return a list of quotes from the year: " + req.query.year);
                res.json(rows);
            }
        });
    }
    else{
        db.all('SELECT * FROM Quotes', function(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                for( var i = 0; i < rows.length; i++){
                    console.log(rows[i].Quote);
                }
                res.json(rows);
            }
        });
    }
});

app.get('/quotes/:id', function(req, res){
    db.get('SELECT * FROM Quotes WHERE ID = ?', [req.params.id], function(err, row){
        if(err){
            res.send(err.message);
        }
        else{
            console.log("return quote with the ID: " + req.params.id);
            res.json(row);
        }
    });
});

app.post('/quotes', function(req, res){
    console.log("Insert a new quote: " + req.body.Quote);
    db.run('INSERT INTO Quotes (Quote, Author, Year) VALUES (?, ?, ?)', [req.body.Quote, req.body.Author, req.body.Year], function(err){
        if(err){
            res.send(err.message);
        }
        else{
            res.send('Inserted quote with id: ' + this.lastID);
        } 
    });   
});

app.listen(3000, function(){
    console.log('Listening on Port 3000');
});


const express = require('express');
const bodyParser = require('body-parser');
const harakiri = require('harakiri');
const fs = require('fs');
const Trie = require('./trie.js');
const app = express();
const port = 5000

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/insert', (req, res) => {
    let words = req.body.inputField;
    const pattern = /[a-z]+(\s[a-z]+)*$/;
    if (!pattern.test(words)) { //checking for invalid input
        res.write('Please go back and insert list of words first')
        res.end();
    } else {
        let names = words.split(" ");
        createTree(names); // creating the Trie from the array of words
        res.sendFile(__dirname + '/find.html');
    }
});

// Path to show result of matched words
app.post('/find', (req, res) => {
    let list = findWords(req.body.name); // returned list of matched words
    if (list.length >= 1) {
        res.send(list) // currently sending the whole array itself
    } else {
        res.send('No matches found. Why not go back and try again?')
    }
});

// Error handling for Express
app.use((err, res) => {
    fs.appendFile('error.txt', err.stack, err => { // logging errors in a file
        if (err) throw err;
    })
    res.status(500).send('Oops! Something went wrong ¯\_(ツ)_/¯. It\'s probably not your fault tho!');
});

// Instantiating the Trie fn
const T = new Trie();

// Function to create Trie tree
const createTree = array => {
    try {
        for (let i = 0; i < array.length; i++) {
            T.insert(array[i]);
        }
    } catch (error) {
        console.error(error)
        fs.appendFile('error.txt', error, err => {
            if (err) throw err;
        })
    }
};

// Function to find words from Trie
const findWords = str => {
    try {
        let list = T.autoComplete(str);
        return list;
    } catch (error) {
        console.error(error);
        fs.appendFile('error.txt', error, err => {
            if (err) throw err;
        })
    }
};

// Server init
app.listen(port, () => { 
    harakiri();
    console.log(`Example app listening on port ${port}!`)
});
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Trie = require('./trie.js');
const app = express()
const port = 5000

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/insert', (req, res) => {
    let words = req.body.inputField;
    if (!/[a-z]+(\s[a-z]+)*/.test(words)) { //checking for invalid input
        res.write('Please go back and insert list of words first')
        res.end();
    } else {
        let names = words.split(" ");
        createTree(names);                  // creating the Trie from the array of words
        res.sendFile(__dirname + '/find.html');
    }
});

// Path to show result of matched words
app.post('/find', (req, res) => {
    let list = findWords(req.body.name); //returned list of matched words
    // res.send(list);
    if (list.length >= 1) {
        res.send(list)                   // currently sending the whole array itself
    } else {
        res.send('No matches found. Why not go back and try again?')
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    fs.appendFile('error.txt', err.stack, (err) => {        // logging errors in a file
        if (err) throw err;
    })
    res.status(500).send('Oops! Something went wrong ¯\_(ツ)_/¯. It\'s probably not your fault tho!');
});

// Instantiating the Trie fn
let T = new Trie();

// Function to create Trie tree
const createTree = array => {
    for (let i = 0; i < array.length; i++) {
        T.insert(array[i]);
    }
};

// Function to find words from Trie
const findWords = str => {
    let list = T.autoComplete(str);
    return list;
};

// Server init
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

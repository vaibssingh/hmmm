const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Trie = require('./trie.js');
const app = express()
const port = 5000

try {
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    })

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.post('/insert', (req, res) => {
        let words = req.body.inputField;
        if (!/^[a-z\s]+\,[a-z\s]+$/g.test(words)) { //checking for invalid input
            res.write('Please go back and insert list of words first')
            res.end();
        } else {
            let names = words.split(" ");

            console.log('arrr', names);

            createTree(names); // creating the Trie from the array of words
            res.sendFile(__dirname + '/find.html');
        }
    })

    // Path to show result of matched words
    app.post('/find', (req, res) => {
        let list = findWords(req.body.name); //returned list of matched words
        res.send(list);
    });

    // Instantiating the Trie fn
    let T = new Trie();

    // Function to create Trie tree
    const createTree = array => {
        for (let i = 0; i < array.length; i++) {
            T.insert(array[i]);
        }
    }

    // Function to find words from Trie
    const findWords = str => {
        let list = T.autoComplete(str);
        return list;
    }

    // Error handling
    const throwError = message => {
        let err = new Error();
        err.message = message;
        return err;
    }

    // Function to write logs to file
    const writeLog = log => {
        fs.appendFile('errors.txt', log, (err) => {
            if (err) throw err;
        })
    }
    // Server init
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));

} catch (error) {
    throw error;
}
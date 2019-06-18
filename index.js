// implement your API here
const express = require('express'); // 'CommonJS' way of importing packages 
// equivalent to import express from 'express';

const server = express(); // creates an http web server

const db = require('./data/hubs-model.js');

//Middleware
server.use(express.json());

// Endpoints

server.get('/', (req, res) => {
    // name is not importand (could be request, response), position is
    res.send('Hello World!');
    // .send() is a helper method that is part of the response object
})

server.get('/now', (req, res) => {
    const now = new Date().toISOString();
    res.send(now);
});

// GET
server.get('/hubs', (req, res) => {
    // db.find() returns a promise that resolves to a list of existing hubs
    db.find()
        .then(hubs => {
            res.status(200).json(hubs);
        })
        .catch(err => {
            // we ran into an error getting the hubs
            // use the catch-all 500 status code
            res.status(500).json({
                success: false,
                err
            });
        });
})

//POST
server.post('/hubs', (req, res) => {
    const hubInfo = req.body; // need to use express.json() middleware

    db.add(hubInfo)
        .then(hub => {
            // hub was added successfully
            res.status(201).json({ success: true, hub });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                err
            });
        });
})

//DELETE
server.delete('/hubs/:id', (req, res) =>{
    const { id } = req.params;

    db.remove(id)
        .then(deleted => {
            if (deleted) {
                // .end() ends the request and send a response with the specified status code
                // 204 (no content) commonly used for DELETE as there is no need to send anything back
                res.status(204).end();
            } else {
                res.status(404).json({
                    success: false,
                    message: 'I cannot find the hub you are looking for'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                err
            })
        });
})

//PUT 
server.put('/hubs/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
  
    db.update(id, changes)
      .then(updated => {
        if (updated) {
          res.status(200).json({ success: true, updated });
        } else {
          res.status(404).json({
            success: false,
            message: 'I cannot find the hub you are looking for',
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          err,
        });
      });
  });

// GET by ID
server.get('/hubs/:id', (req, res) => {
    db.findById(req.params.id)
      .then(hub => {
        if (hub) {
          res.status(200).json({
            success: true,
            hub,
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'We cannot find the hub you are looking for',
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          err,
        });
      });
  });

// make the web server listen for incoming traffic on port 4000
server.listen(4000, () => {
    // this callback function run after the server starts successfully
    console.log('\n*** Server Running on http://localhost:4000 ***\n')
})
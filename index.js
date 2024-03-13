// import express
const express = require("express");

// create express application stored in the app variable
const app = express();

// define basic api data
let data = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

// get base url
app.get("/", (request, response) => {
    response.send("<h1>Persons API...</h1>");
});

// set api url to api data
app.get("/api/persons", (request, response) => {
    // set the api with response.json()
    response.json(data);
});

// Define a port to listen to it
const PORT = 3001;

// Listen to the port
app.listen(PORT);
console.log(`Server running on port ${PORT}`);

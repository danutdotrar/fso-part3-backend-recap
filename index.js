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

// @@ GET Request
// @@ Route '/info'
app.get("/info", (request, response) => {
    const date = new Date();
    const infoData = `<p>Phonebook has info for ${data.length} people</p>
    <p>${date}</p>`;

    // send the info data with the response
    response.send(infoData);
});

// @@ GET Request for single resource
// @@ Route '/api/persons/:id'
app.get("/api/persons/:id", (request, response) => {
    // get the id from the url params to search it in the api
    const id = Number(request.params.id);

    // find the resource in the api with the params id === resource id
    const singleResource = data.find((person) => person.id === id);

    // if the resource exists, send the json with that resource
    if (singleResource) {
        // show that singleResource with response.json()
        response.json(singleResource);
    } else {
        response.status(404).end();
    }
});

// Define a port to listen to it
const PORT = 3001;

// Listen to the port
app.listen(PORT);
console.log(`Server running on port ${PORT}`);

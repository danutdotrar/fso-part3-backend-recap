// import express
const express = require("express");

// create express application stored in the app variable
const app = express();

// to access data easily, we use express.json()
app.use(express.json());

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

// @@ DELETE Request for single resource
// @@ Route '/api/persons/:id'
// @@ Response - 204 and .end() to transmit that no more data will be sent
app.delete("/api/persons/:id", (request, response) => {
    // get the id from the request.params.id
    const id = Number(request.params.id);

    // iterate over api and filter the person with the id === id from params
    data = data.filter((person) => person.id !== id);

    // we need to set a response, so it will be status 204 (no content) and end() which signals that no more data is sent with the response
    response.status(204).end();
});

// @@ POST request
// @@ Route '/api/persons/'
// @@ Response will be the new object created
app.post("/api/persons", (request, response) => {
    // we need the body request from request.body
    const body = request.body;
    // set the id of body with the length of data + 1
    body.id = data.length + 1;

    // check if name already exists in api
    const nameExists = data.some((person) => person.name === body.name);

    // check if name and number exists
    if (!body.name || !body.number) {
        response.status(400).json({ error: "Name or number doesnt exist" });
    } else if (nameExists) {
        response.status(400).json({ error: "Name must be unique" });
    } else {
        // add the body to the api with concat
        data = data.concat(body);

        // we need to respond to the request
        // set the response of .json(body)
        response.json(body);
    }
});

// Define a port to listen to it
const PORT = 3001;

// Listen to the port
app.listen(PORT);
console.log(`Server running on port ${PORT}`);

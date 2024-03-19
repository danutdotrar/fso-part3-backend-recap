// import express
const express = require("express");

// import morgan middleware
const morgan = require("morgan");

// create express application stored in the app variable
const app = express();

// to access data easily (from request.body in POST request for example), we use express.json() which is a middleware
app.use(express.json());

// define a custom token to log request body
morgan.token("req-body", (req, res) => JSON.stringify(req.body));

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms - Body: :req-body"
    )
);

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

    // filter method keeps the items in the array that satisfy the condition
    // keep the persons with the id !== with the id from the params
    // iterate over api and filter the person with the id === id from params
    data = data.filter((person) => person.id !== id);

    // we need to set a response, so it will be status 204 (no content) and end() which signals that no more data is sent with the response
    response.status(204).end();
});

// @@ POST request
// @@ Route '/api/persons/'
// @@ Response will be the new object created
app.post("/api/persons", (request, response) => {
    // we need the body request from request.body (use express.json() to access it)
    const body = request.body;
    // set the id of body with the length of data + 1

    // define new person with the body's keys and values
    const newPerson = {
        name: body.name,
        number: body.number,
        id: data.length + 1,
    };

    // check if name already exists in api
    const nameExists = data.some((person) => person.name === body.name);

    // check if name and number exists
    if (!body.name || !body.number) {
        // return is essential otherwise the code will run and execute until the end
        return response
            .status(400)
            .json({ error: "Name or number doesnt exist" });
    } else if (nameExists) {
        return response.status(400).json({ error: "Name must be unique" });
    } else {
        // add the body to the api with concat
        data = data.concat(newPerson);

        // we need to respond to the request
        // set the response of .json(body)
        response.json(newPerson);
    }
});

// catch request to non-existing routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// Define a port to listen to it
const PORT = 3001;

// Listen to the port
app.listen(PORT);
console.log(`Server running on port ${PORT}`);

// HTTP standard vorbeste despre 2 proprietati, safety si idempotency.
// Safety se refera la faptul ca datele nu sunt schimbate in urma requestului (**GET**)
// Idempotency se refera la faptul ca oricate requesturi ar fi facute, rezultatul este acelasi (de exemplu, GET, PUT, DELETE, HEAD).
// POST nu are proprietatea safety si nu este idempotent, deoarece schimba datele (not safety) si schimba si rezultatul cu fiecare request facut (not idempotent)

// Middleware sunt functii care sunt folosite pentru gestionarea obiectelor request si response
// Middleware are 3 parametrii, request, response si next
// Functiile middleware sunt apelate in ordinea in care sunt folosite cu metoda use (app.use(nmiddleware)) a express server-ului
// Json parser-ul trebuie actionat prima data, ca sa putem folosi functiile middleware
// Middleware trebuie sa fie folosite inaintea routes daca vrem sa fie executate inaintea route event handler.

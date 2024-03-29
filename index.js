require("dotenv").config();

// import the Person model
const Person = require("./models/person");

// import express
const express = require("express");

// import morgan middleware
const morgan = require("morgan");

// import cors
const cors = require("cors");

// create express application stored in the app variable
const app = express();

// use cors
app.use(cors());

// to access data easily (from request.body in POST request for example), we use express.json() which is a middleware
app.use(express.json());

// define a custom token to log request body
morgan.token("req-body", (req, res) => JSON.stringify(req.body));

// use morgan with string
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms - Body: :req-body"
    )
);

// define error handler with next
const errorHandler = (error, request, response, next) => {
    if (error.name === "CastError") {
        return response.status(400).json({ error: "malformatted id" });
    }

    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

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
    // find in the database the persons
    Person.find({}).then((result) => {
        // set the api with response.json()
        response.json(result);
    });
});

// @@ POST request
// @@ Route '/api/persons/'
// @@ Response will be the new object created
app.post("/api/persons", (request, response, next) => {
    // we need the body request from request.body (use express.json() to access it)
    const body = request.body;

    // define new person based on the model Person
    const person = new Person({
        name: body.name,
        number: body.number,
    });

    // save the person to the db with the save()
    person
        .save()
        .then((result) => {
            response.json(result);
        })
        .catch((error) => next(error));

    // // define new person with the body's keys and values
    // const newPerson = {
    //     name: body.name,
    //     number: body.number,
    //     id: data.length + 1,
    // };

    // // check if name already exists in api
    // const nameExists = data.some((person) => person.name === body.name);

    // // check if name and number exists
    // if (!body.name || !body.number) {
    //     // return is essential otherwise the code will run and execute until the end
    //     return response
    //         .status(400)
    //         .json({ error: "Name or number doesnt exist" });
    // } else if (nameExists) {
    //     return response.status(400).json({ error: "Name must be unique" });
    // } else {
    //     // add the body to the api with concat
    //     data = data.concat(newPerson);

    //     // we need to respond to the request
    //     // set the response of .json(body)
    //     response.json(newPerson);
    // }
});

// @@ GET Request
// @@ Route '/info'
app.get("/info", (request, response) => {
    const date = new Date();

    Person.find({}).then((result) => {
        const numberOfPersons = result.length;
        const infoData = `<p>Phonebook has info for ${numberOfPersons} people</p>
        <p>${date}</p>`;

        // send the info data with the response
        response.send(infoData);
    });
});

// @@ GET Request for single resource
// @@ Route '/api/persons/:id'
app.get("/api/persons/:id", (request, response, next) => {
    // get the id from the url params to search it in the api
    const id = request.params.id;

    // find the resource in the api with the params id === resource id
    // const singleResource = data.find((person) => person.id === id);
    Person.findById(id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                return response.status(404).end();
            }
        })
        .catch((error) => {
            next(error);
        });

    // if the resource exists, send the json with that resource
    // if (singleResource) {
    // show that singleResource with response.json()
    // response.json(singleResource);
    // } else {
    // response.status(404).end();
    // }
});

// @@ UPDATE request for single resource
// @@ Route '/api/persons/:id'
// @@ return the updated person
app.put("/api/persons/:id", (request, response) => {
    // get the id from the url
    const id = request.params.id;

    // get the body
    const body = request.body;

    // define a new updated obj with the data from the body req
    const updatedPerson = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(id, updatedPerson, {
        new: true,
        runValidators: true,
    }).then((result) => {
        response.json(result);
    });
});

// @@ DELETE Request for single resource
// @@ Route '/api/persons/:id'
// @@ Response - 204 and .end() to transmit that no more data will be sent
app.delete("/api/persons/:id", (request, response, next) => {
    // get the id from the request.params.id
    const id = request.params.id;

    // filter method keeps the items in the array that satisfy the condition
    // keep the persons with the id !== with the id from the params
    // iterate over api and filter the person with the id === id from params
    // data = data.filter((person) => person.id !== id);

    // use Person model and findByIdAndDelete
    Person.findByIdAndDelete(id)
        .then((result) => {
            // we need to set a response, so it will be status 204 (no content) and end() which signals that no more data is sent with the response
            response.status(204).end();
        })
        .catch((error) => {
            next(error);
        });
});

// catch request to non-existing routes
// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);
app.use(errorHandler);

// Define a port to listen to it
const PORT = process.env.PORT;

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

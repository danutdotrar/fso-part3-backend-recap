// import mongoose
const mongoose = require("mongoose");

// define url
const url = process.env.MONGODB_URI;
console.log("connecting to the url...");

// connect to the url
mongoose
    .connect(url)
    .then((result) => {
        console.log("connected to the url ", url);
    })
    .catch((error) => {
        console.log("error connecting: ", error);
    });

// define the schema - schema will tell mongodb how the objects are structured in the db
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

// format the returned schema
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        (returnedObject.id = returnedObject._id),
            delete returnedObject._id,
            delete returnedObject.__v;
    },
});

// define the model based on that schema
const Person = mongoose.model("Person", personSchema);

// export the model so that we can use it in the index
module.exports = Person;

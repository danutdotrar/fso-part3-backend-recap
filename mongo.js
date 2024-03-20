// import mongoose
const mongoose = require("mongoose");

// define url and access password from process.argv[2]
const password = process.argv[2];
const personName = process.argv[3];
const personNumber = process.argv[4];

const url = `mongodb+srv://morarasudanut:${password}@cluster0.ggaidd0.mongodb.net/phonebookRecap?retryWrites=true&w=majority&appName=Cluster0`;

// connect to url
mongoose.connect(url).then((result) => console.log("connected to url"));

// definim mongoose schema care va spune db cum vor fi structurate obiectele
const newPerson = new mongoose.Schema({
    name: String,
    number: Number,
});

// definim un model care va folosi schema
const Person = mongoose.model("Person", newPerson);

// cream un obiect nou pe baza modelului
const person = new Person({
    name: personName,
    number: personNumber,
});

// salvam person in database
// person.save().then((result) => {
//     console.log(
//         `added ${personName} number ${personNumber} to phonebook mongoDB`
//     );
//     // inchidem conexiunea
//     mongoose.connection.close();
// });

if (process.argv.length < 4) {
    // find all persons and log them
    Person.find({}).then((result) => {
        console.log("phonebook:");
        result.forEach((person) =>
            console.log(`${person.name} - ${person.number}`)
        );
    });
}

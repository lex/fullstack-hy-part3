const mongoose = require("mongoose");

const url = process.env.DB_URL;

if (!url) {
  console.log("please define DB_URL");
  return;
}

mongoose.connect(url);
mongoose.Promise = global.Promise;

const Person = mongoose.model("Person", {
  name: String,
  number: String
});

if (process.argv.length === 2) {
  console.log("puhelinluettelo:");
  Person.find({})
    .then(res => {
      console.log(res.map(p => `${p.name} ${p.number}`).join("\n"));
    })
    .then(() => {
      mongoose.connection.close();
    });
} else {
  const name = process.argv[2];
  const number = process.argv[3];

  const person = new Person({
    name,
    number
  });

  person.save().then(response => {
    console.log(`lisättiin henkilö ${name} numero ${number} luetteloon`);
    mongoose.connection.close();
  });
}

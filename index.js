const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const Person = require("./models/person");

morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

app.use(bodyParser.json());
app.use(
  morgan(":method :url :body :status :res[content-length] - :response-time ms")
);
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then(persons => res.json(persons.map(Person.format)))
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: "something went wrong" });
    });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(Person.format(person));
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: "something went wrong" });
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  Person.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: "something went wrong" });
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    res.status(400).json({ error: "no name supplied" });
    return;
  }

  if (!body.number) {
    res.status(400).json({ error: "no number supplied" });
    return;
  }

  const person = new Person({ name: body.name, number: body.number });

  person
    .save()
    .then(savedPerson => {
      res.json(Person.format(savedPerson));
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: "something went wrong" });
    });
});

app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const person = { name: body.name, number: body.number };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson));
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: "something went wrong" });
    });
});

app.get("/info", (req, res) => {
  Person.find({})
    .then(persons => {
      res.send(
        `<p>there are ${persons.length} person${
          persons.length === 1 ? "" : "s"
        } in the phone book</p><p>${new Date()}</p>`
      );
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: "something went wrong" });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

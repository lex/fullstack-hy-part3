const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

app.use(bodyParser.json());
app.use(
  morgan(":method :url :body :status :res[content-length] - :response-time ms")
);
app.use(cors());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  }
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const person = Object.assign({}, req.body);

  if (!person.name) {
    res.status(400).json({ error: "no name supplied" });
    return;
  }

  if (!person.number) {
    res.status(400).json({ error: "no number supplied" });
    return;
  }

  if (persons.filter(p => p.name === person.name).length === 1) {
    res.status(400).json({ error: "name must be unique" });
    return;
  }

  person.id = ~~(Math.random() * 100000);
  persons.push(person);
  res.json(person);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>there are ${persons.length} person${
      persons.length === 1 ? "" : "s"
    } in the phone book</p><p>${new Date()}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const url = process.env.DB_URL;

mongoose.connect(url);
mongoose.Promise = global.Promise;

const personSchema = new Schema({
  name: { type: String, unique: true },
  number: String
});

personSchema.statics.format = function(person, cb) {
  return { id: person._id, name: person.name, number: person.number };
};

const Person = mongoose.model("Person", personSchema);

module.exports = Person;

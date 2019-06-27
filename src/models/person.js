var mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true,
    unique: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  }
});

const Person = mongoose.model('Person', personSchema);

export default Person;

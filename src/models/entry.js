var mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  starttime: {
    type: Date,
    required: true
  },
  endtime: {
    type: Date,
    required: true
  }
});

const entrySchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    require: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  contacts: [{
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  }],
  devices: [{
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  }],
  periods: {
    type: [periodSchema],
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  ownership: {
    type: Schema.Types.ObjectId,
    ref: 'Ownership',
    required: true
  },
  comments: {
    type: String,
    required: true
  },
  files: {
    type: [String]
  }
});

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;

var mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  starttime: {
    type: Date,
    required: true
  },
  endtime: {
    type: Date,
    required: true
  },
  people: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  }],
  vehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  }],
});

const entrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  }],
  devicemodels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeviceModel',
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
    type: mongoose.Schema.Types.ObjectId,
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

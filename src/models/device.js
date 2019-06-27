var mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  models: {
    type: [modelSchema],
    required: false
  }
});

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brands: {
    type: [brandSchema],
    required: false
  }
});

const Device = mongoose.model('Device', typeSchema)

export default Device;

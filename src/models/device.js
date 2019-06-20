var mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;

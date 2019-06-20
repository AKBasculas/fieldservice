var mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;

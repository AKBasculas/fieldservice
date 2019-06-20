var mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;

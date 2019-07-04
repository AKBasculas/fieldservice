var mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeviceBrand',
    required: true
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeviceType',
    required: true
  }
});

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

export const DeviceType = mongoose.model('DeviceType', typeSchema);
export const DeviceBrand = mongoose.model('DeviceBrand', brandSchema);
export const DeviceModel = mongoose.model('DeviceModel', modelSchema);

var mongoose = require('mongoose');

const ownershipSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true
  }
});

const Ownership = mongoose.model('Ownership', ownershipSchema);

export default Ownership;

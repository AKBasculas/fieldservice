var mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  }
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;

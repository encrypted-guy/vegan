const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let contacts_info = new Schema({
    name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String
    }
});
let contacts = mongoose.model('contacts', contacts_info);
module.exports = contacts;
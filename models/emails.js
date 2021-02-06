const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let emails_info = new Schema({
    email: {
        type: String,
        required: true
    },
    time: {
        type: String
    }
});
let emails = mongoose.model('emails', emails_info);
module.exports = emails;
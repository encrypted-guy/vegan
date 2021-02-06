const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let posts_info = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    imgurl: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    file_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "uploads.files"
    }
});
let posts = mongoose.model('posts', posts_info);
module.exports = posts;
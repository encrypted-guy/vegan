const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const Gridfsstorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// additional database
const URL = 'mongodb://localhost/VEGAN';
const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});


// creating the storage
let storage = new Gridfsstorage({
    url: URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (error, buffer) => {
                if(error){
                    console.log(`ERROR: cant crypt the file | ${error}`);
                    return reject(error);
                }else{
                    const filename = file.fieldname+'-'+buffer.toString('hex') + path.extname(file.originalname);
                    const fileinfo = {
                        filename: filename,
                        bucketName: 'uploads'
                    }
                    resolve(fileinfo);
                }
            });
        });
    }
});
const upload = multer({
    storage: storage
});
module.exports = gfs;
module.exports = upload;
// .single('file')
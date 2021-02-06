const mongoose = require('mongoose');

const URL = process.env.MONGO_URL;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(URL);
const conn = mongoose.connection;
conn.on('error', error => {
    console.log('error connecting database');
});


conn.once('open', () => {
    console.log('DB connection successfull');
});

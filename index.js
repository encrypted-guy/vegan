const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
//db
require('./config/db');

// middle wares
app.set('view engine',"ejs");
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.set('json spaces', 3);
app.use('/public',express.static('public'));



//routes
app.use('/admin', require('./routes/Admin')); // all admin
app.use('/', require('./routes/client')); // all client
app.use('/', require('./routes/images')); // images routes


app.listen(process.env.PORT, () => {
    console.log(`server running on ${process.env.PORT}`);
})
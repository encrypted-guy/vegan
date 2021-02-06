const express = require('express');
const router = express.Router();
const upload = require('../config/image');
const posts = require('../models/posts');
const emails = require('../models/emails');
const contacts = require('../models/contact');

router.get('/', (req, res) => {
    posts.count({}, function( error, count){
        if(error){
            console.log(`ERROR: cant count the number ${error}`);
        }else{
            res.render('admin', {
                top_title: 'ADMIN',
                count: count
            });
        }
    })

});

// admin all posts------------------------------------
router.get('/all', (req, res) => {
    posts.find({}, (error, post) => {
        if(error){
            console.log(`ERROR: cant get the all post to admin page | ${error}`);
        }else{
            res.render('admin_all', {
                top_title: 'ADMIN',
                post: post
            });
        }
    })
});

// add post-------------------------------------------
router.get('/add', (req, res) => {
    res.render('admin_add', {
        top_title: 'ADMIN'
    });
});
router.post('/add', upload.single('file'), (req, res) => {
    console.log(req.file);
    console.log(req.body);

    let date_info = new Date;
    let date_into = (date_info.getMonth()+1) + '/' + date_info.getDate() + '/' +  date_info.getFullYear();


    const filename = req.file.filename;
    const imgurl = `/image/${req.file.filename}`;
    const contentType = req.file.contentType;
    const file_id = req.file.id;
    const date = date_into;
    const title = req.body.title;
    const description = req.body.description;
    let new_post = new posts({
        title: title,
        date: date,
        description: description,
        filename: filename,
        imgurl: imgurl,
        contentType: contentType,
        file_id: file_id
    });
    new_post.save(error => {
        if(error){
            console.log(`ERROR: cant save the data to DB | ${error}`);
        }else{
            console.log('SUCCESS: data saved to DB');;
            res.redirect('/admin/all');
        }
    });
});

//edit post--------------------------------------------
router.get('/edit/:id', (req, res) => {
    res.render('admin_edit', {
        top_title: 'ADMIN'
    });
});
router.post('/edit/:id', (req, res) => {

    let post_update = {};
    post_update.title = req.body.title;
    post_update.description = req.body.discription;

    let query = {_id: req.params.id};
    posts.update(query, post_update, (error, updated) => {
        if(error){
            console.log(`ERROR: cant update the edited post | ${error}`);
        }else{
            console.log(`SUCCESS: post updated`);
            res.redirect(`/admin/all`);
        }
    });

});


//delete post

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

router.get('/delete/:id', (req, res, next) => {
    posts.findById(req.params.id, (error, post) => {
        if(error){
            console.log(`ERROR: cant get the item to delete`);
        }else{
            // const _id = post._id;
            const file_id = post.file_id;
            post.remove((error, deleted) => {
                if(error){
                    console.log(`ERROR: cant delete the fruits | ${error}`);
                }else{
                    gfs.remove({_id: file_id, root: 'uploads'}, (error, gridStore) => {
                        if(error){
                            return res.status(404).json({err: err});
                        }
                        res.redirect('/admin/all');
                        console.log(`SUCCESS: deleted`);
                    });
                }
            });

        }
    });
});
// email list
router.get('/emails', (req, res) => {
    emails.find({}, (error, email) => {
        if(error){
            console.log(`ERROR: cant get the email list | ${error}`);
        }else{
            res.render('admin_email', {
                top_title: 'ADMIN',
                email: email
            })
        }
    });
});

// contact
router.get('/requests', (req, res) => {
    contacts.find({}, (error, contact) => {
        if(error){
            console.log(`ERROR: cant get the contact list | ${error}`);
        }else{
            res.render('requests', {
                top_title: 'ADMIN',
                contact: contact
            })
        }
    });
});

module.exports = router;
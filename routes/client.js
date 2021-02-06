const express = require('express');
const router = express.Router();
const async = require('async');
const posts = require('../models/posts');
const emails = require('../models/emails');
const contacts = require('../models/contact');

router.get('/', (req, res) => {
    posts.find({}, (error, post) => {
        if(error){
            console.log(`ERROR: cant send the posts | ${error}`);
        }else{
            res.render('index', {
                post: post
            });
        }
    }); 
});
// each post
router.get('/post/:id', (req, res) => {
    
    let local = {};
    async.parallel([
        each_post => {
            posts.findById(req.params.id, (error, post) => {
                if(error){
                    console.log('ERROR: cant send each post to each');
                }else{
                    local.post = post;
                }
                each_post();
            });
        },allposts => {
            posts.countDocuments({}, (error, count) => {
                var random  = Math.floor(Math.random() * count/2);
                var doc = posts.find({}).skip(random).limit(4);
                doc.find({}, (error, posts) => {
                    if(error){
                        console.log('cannoct send the all posts to home to post to post');
                    }else{
                        local.all_posts = posts;
                        allposts();
                    }
                });
                
            });
        }
    ], error => {
        if(error){
            console.log(`ERROR: error on each async function`);
        }else{
            res.render('each_post', {
                post: local.post,
                all_posts: local.all_posts
            });
        }
    })
});

// all posts
router.get('/all-posts', (req, res) => {
    posts.find({}, (error, post) => {
        if(error){
            console.log(`ERROR: cant send the posts | ${error}`);
        }else{
            res.render('all_posts', {
                posts: post
            });
        }
    }); 
});

// about
router.get('/about-us', (req,res) => {
    res.render('about');
});

// email collect
router.post('/email/list', (req , res) => {

    console.log(req.body.text);
    const url = req.url;
    let email = req.body.email;
    let date_info = new Date;
    let date_into = (date_info.getMonth()+1) + '/' + date_info.getDate() + '/' +  date_info.getFullYear();

    console.log(url);

    let new_email = new emails({
        email: email,
        time: date_into
    });
    new_email.save(error => {
        if(error){
            console.log(`ERR0R: cant save the email | ${error}`);
        }else{
            console.log('SUCCESS: email saved');
            res.redirect('back');
        }
    });
});

// contact form
router.get('/contact-us', (req, res) => {
    posts.countDocuments({}, (error, count) => {
        var random  = Math.floor(Math.random() * count/2);
        var doc = posts.find({}).skip(random).limit(4);
        doc.find({}, (error, posts) => {
            if(error){
                console.log('cannoct send the all posts to home to post to post');
            }else{
                res.render('contact', {
                    all_posts: posts
                })
            }
        });
        
    });
});
router.post('/contact', (req, res) => {
    let date_info = new Date;
    let date_into = (date_info.getMonth()+1) + '/' + date_info.getDate() + '/' +  date_info.getFullYear();

    const name = req.body.name;
    const Email = req.body.Email;
    const description = req.body.description;
    const date = date_into;

    let new_contact = new contacts({
        name,
        Email,
        description,
        date
    });
    new_contact.save(error => {
        if(error) {
            console.log(`ERROR: cant submit the contact form | ${error}`);
        }else{
            console.log('SUCCESS: contac form submitted');
            res.redirect('back');
        }
    });

});

module.exports = router;
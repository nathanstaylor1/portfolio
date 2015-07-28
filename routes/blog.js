var    express = require('express');
var    router = express.Router();
var    mongoose = require('mongoose'); //mongo connection
var    bodyParser = require('body-parser'); //parses information from POST
var    methodOverride = require('method-override'); //used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));

//build the REST operations at the base for blogposts
//this will be accessible from http://127.0.0.1:3000/blogposts if the default route for / is left unchanged
router.route('/')
    //GET all blogposts
    .get(function(req, res, next) {
        //retrieve all blogposts from Monogo
        mongoose.model('BlogPosts').find({}, null, {sort: {created: -1}}, function (err, posts) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/blogposts folder. We are also setting "blogposts" to be an accessible variable in our jade view
                    html: function(){
                        res.render('blogposts/index', {
                              title: 'nst:blog = All posts;',
                              "posts" : posts,
                              "link" : "blogposts"
                          });
                    },
                    //JSON response will show all blogposts in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
                });
              }     
        });
    })
    


// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('BlogPosts').findById(id, function (err, post) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blogpost);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('BlogPosts').findById(req.id, function (err, post) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + post._id);
        var postCreated = post.created.toISOString();
        postCreated = postCreated.substring(0, postCreated.indexOf('T'))
        res.format({
          html: function(){
              res.render('blogposts/show', {
                "title": 'nst:blog = ' + post.title,
                "created" : postCreated,
                "post" : post,
                "link" : "blogposts"
              });
          },
          json: function(){
              res.json(post);
          }
        });
      }
    });
  });


//allow comments
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes

    var author = req.body.author || "Anonymous"
    var comment = req.body.comment;

    var updateContents = {
        $push:{
          comments: {
            body: comment, 
            author: author, 
            posted: Date.now()
          }
        }
      };

   //find the document by ID
        mongoose.model('BlogPosts').findById(req.id, function (err, post) {
            //update it
            post.update(updateContents, function (err, postID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              } 
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                              res.redirect("/blogposts/" + post._id );
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(post);
                         }
                      });
               }
            })
        });
});



module.exports = router;

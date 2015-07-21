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
        mongoose.model('BlogPosts').find({}, function (err, posts) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/blogposts folder. We are also setting "blogposts" to be an accessible variable in our jade view
                    html: function(){
                        res.render('blogposts/index', {
                              title: 'All my posts',
                              "posts" : posts,
                              "admin" : true,
                              "link": "blogadmin"
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
    //POST a new blogpost
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var title = req.body.title;
        var content = req.body.content;
        //call the create function for our database
        mongoose.model('BlogPosts').create({
            title : title,
            created : Date.now(),
            content : content
        }, function (err, post) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //blogpost has been created
                  console.log('POST creating new blogpost: ' + post);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("blogposts");
                        // And forward to success page
                        res.redirect("/blogadmin");
                    },
                    //JSON response will show the newly created blogpost
                    json: function(){
                        res.json(blogposts);
                    }
                });
              }
        })
    });


/* GET New Blog page. */

router.get('/new', function(req, res) {
    res.render('blogposts/new', { title: 'Add New blogpost' });
});

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
                "created" : postCreated,
                "post" : post,
                "admin": true,
                "link" : "blogadmin"
              });
          },
          json: function(){
              res.json(post);
          }
        });
      }
    });
  });

//GET the individual blogpost by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the blogpost within Mongo
    mongoose.model('BlogPosts').findById(req.id, function (err, post) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the blogpost
            console.log('GET Retrieving ID: ' + post._id);
            //format the date properly for the value to show correctly in our edit form
          var postCreated = post.created.toISOString();
          postCreated = postCreated.substring(0, postCreated.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('blogposts/edit', {
                          title: 'post' + post._id,
                        "created" : postCreated,
                          "post" : post
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(post);
                 }
            });
        }
    });
});

router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var title = req.body.title;
    var content = req.body.content;
    var author = "Nathan"
    var comment = req.body.comment;
    var deleteComment = req.body.deleteComment;


    // decide action to take on the database
    if (content || title) 
      var updateContents = {
        title: title,
        content: content
      };
    else if (comment)
      var updateContents = {
        $push:{
          comments: {
            body: comment, 
            author: author, 
            posted: Date.now()
          }
        }
      };
    else if (deleteComment)
      var updateContents = {
        $pull:{
          comments: {
            _id: deleteComment
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
                              res.redirect("/blogadmin/" + post._id + (deleteComment == undefined ? "/" : "/edit") );
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

//DELETE a post by ID
router.delete('/:id/edit', function (req, res){
    //find post by ID
    mongoose.model('BlogPosts').findById(req.id, function (err, post) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            post.remove(function (err, post) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + post._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/blogadmin");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : post
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;

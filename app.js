var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    methodOverride = require('method-override'),
    app = express();


mongoose.connect("mongodb://localhost/poem_app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// Creating schema for poems
var poemSchema = new mongoose.Schema({
    title: String,
    content: String,
    created: {type: Date, default: Date.now},
    styling: String
});

var Poem = mongoose.model("Poem", poemSchema);

// ==============
// ROUTES SECTION
// ==============

// INDEX ROUTE
app.get('/', function(req, res){
     Poem.find({}, function(err, poems){
        if(err){
            console.log(err);
        } else {
            res.render('index', {poems: poems});
        }
    });
});

// NEW ROUTE
app.get('/new', function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post('/', function(req, res){
    Poem.create(req.body.poem, function(err, newPoem){
        if(err){
            res.render('new');
            console.log('error');
        } else{
            res.redirect('/');
        }
    });
});

// SHOW ROUTE
app.get('/:id', function(req, res) {
    Poem.findById(req.params.id, function(err, foundPoem){
        if(err){
            res.redirect('/');
        } else {
            res.render('show', {poem: foundPoem});
        }
    }); 
});


// EDIT ROUTE
app.get('/:id/edit', function(req, res){
    Poem.findById(req.params.id, function(err, foundPoem){
        if(err){
            res.redirect('/');
        } else{
            res.render("edit", {poem: foundPoem});
        }
    });
});
// UPDATE ROUTE
app.put("/:id", function(req, res){
    Poem.findByIdAndUpdate(req.params.id, req.body.poem, function(err, updatedPoem){
        if(err){
            res.redirect('/');
        } else {
            res.redirect("/" + req.params.id);
        }
    });
});


// DELETE ROUTE
app.delete("/:id", function(req, res){
   Poem.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect('/:id');
       } else{
            res.redirect('/');
        }
   }); 
});   


// Listen to server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Poem App has started!');
});
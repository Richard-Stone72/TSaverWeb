
/**
 * Module dependencies.
 */

 
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , mongoose = require('mongoose');

var app = module.exports = express.createServer()
  , db = mongoose.connect('mongodb://localhost/TSaverWeb-development')
  , Document = require('./models.js').Document(db);
  
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function() {
  app.use(express.logger({ format: ':method :uri' }));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  //db = mongoose.connect('mongodb://localhost/TSaverWeb-development');
});

app.Document = Document;

app.get('/', function(req, res) {
  res.redirect('/documents')
  console.log("redirecting / to /documents");
});

// Document list
app.get('/documents.:format?', function(req, res) {
  Document.find({}, function(err, documents) {
  
    documents = documents.map(function(d) {
      return { title: d.title, id: d._id, description: d.description, image: d.image };
    });
    console.log("Total Documents: " + documents.length);
    switch (req.params.format) {
      case 'json':
        res.send(documents.map(function(d) {
          return d.__doc;
        }));
      break;

      default:
        res.render('documents/index', {
        documents: documents
        });
    }
  });
});

app.get('/documents/:id.:format?/edit', function(req, res) {
  Document.findById(req.params.id, function(d) {
    res.render('documents/edit.jade', {
      locals: { d: d }
    });
  });
});

app.get('/documents/new', function(req, res) {
  res.render('documents/new.jade', {
    locals: { d: new Document() }
  });
});

// Create document 
app.post('/documents.:format?', function(req, res) {
  var d = new Document(req.body.document);
  d.save(function() {
    switch (req.params.format) {
      case 'json':
        res.send(d.__doc);
       break;

       default:
        res.redirect('/documents');
    }
  });
});

// Read document
app.get('/documents/:id.:format?', function(req, res) {
  Document.findById(req.params.id, function(d) {
    switch (req.params.format) {
      case 'json':
        res.send(d.__doc);
      break;

      default:
        res.render('documents/show.jade', {
          locals: { d: d }
        });
    }
  });
});

// Update document
app.put('/documents/:id.:format?', function(req, res) {
  Document.findById(req.body.document.id, function(d) {
    d.title = req.body.document.title;
    d.data = req.body.document.data;
    d.save(function() {
      switch (req.params.format) {
        case 'json':
          res.send(d.__doc);
         break;

         default:
          res.redirect('/documents');
      }
    });
  });
});

// Delete document
app.del('/documents/:id.:format?', function(req, res) {
  Document.findById(req.params.id, function(d) {
    d.remove(function() {
      switch (req.params.format) {
        case 'json':
          res.send('true');
         break;

         default:
          res.redirect('/documents');
      } 
    });
  });
});

if (!module.parent) {
  http.createServer(app).listen(3000);
  console.log("Express server listening on port 3000");
}


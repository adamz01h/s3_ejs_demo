var express = require('express'); //set require
var app = express(); //bind express
var path = require('path'); //path
const fs = require('fs'); //filestream
var pages = 'views/pages'; //pages dir
var node_server_port = 8085; //node js server port

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public'))); //set the static path as /public as our rednder folder
// use res.render to load up an ejs view files dynamic renders
fs.readdir(pages, function (err, files) {
  for (var i = files.length - 1; i >= 0; i--){ //read all file in the "pages" dir
    var file = files[i];
    if(file =='index.ejs'){ //index is special so we do something special 
      app.get('/', function(req, res) {
        res.render('pages/index'); //set render out
      });
      render_page(app, 'index', 'pages/index'); //create the html version of the page
    }else{
      var file_name = file.replace(/\.[^/.]+$/, ""); //remove the .ejs ext and just get the filename
      app.get(`/${file_name}`, function(req, res) { 
        res.render(`pages/${file_name}`); //set render out
      });
      render_page(app, file_name, `pages/${file_name}`); //create the html version of the page
    }//end if/else index check
  }//end for
});

app.listen(node_server_port); //start server
console.log(`NodeJS Server is listening on port ${node_server_port}`); //console log

// will also prerender pages for AWS
let render_page = (app, filename, pageTemplate) => new Promise(
 (resolve, reject) => {
    app.render(pageTemplate, '', (err, renderedPage) => {
        fs.writeFile(`public/${filename}.html`, renderedPage, (err) => {
            if (err) throw err;
            else {
                resolve() //resolve Promise
            }
        });
    })
 }
);

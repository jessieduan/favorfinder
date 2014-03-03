
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var index = require('./routes/index');
var profile = require('./routes/profile');
var requests = require('./routes/requests');
var appointments = require('./routes/appointments');
var settings = require('./routes/settings');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var login = require('./routes/login');
var profile = require('./routes/profile');
var postings = require('./routes/postings');

var app = express();

var hbs = handlebars.create({
	defaultLayout: 'main',
	partialsDir: 'views/partials/'
});

// all environments
// 3000 doesn't work for me, so I'm changing it to 1234
app.set('port', process.env.PORT || 1234);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', index.view);
app.get('/testB', index.view);
app.get('/profile', profile.view);
app.get('/profile/:id', profile.view);
app.get('/settings', settings.view);

app.get('/add_user', login.add_user);
app.get('/view_users', login.view_users);
app.get('/login', login.view);
app.get('/post_login', login.login);
app.get('/logout', login.logout);
app.get('/reset_data', login.reset);


app.post('/add_posting', postings.add);
app.get('/view_postings', postings.view);
app.get('/find_posting/:id', postings.find_posting);
app.post('/claim/:id', postings.claim);
app.post('/unclaim/:id', postings.unclaim);
app.post('/complete/:id', postings.complete);
app.post('/uncomplete/:id', postings.uncomplete);
app.post('/comment/:id', postings.comment);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//Handlebars.registerPartial('header', header.handlebars);

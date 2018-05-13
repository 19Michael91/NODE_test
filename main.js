var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.json());

var port = 8080;

var users = [
		{ username: 'admin', password: '12345' },
		{ username: 'foo', password: 'bar' },
		{ username: 'user', password: 'test' }
];

var sessionHandler = require('./js/session_handler');
var store = sessionHandler.createStore();

app.use(cookieParser());

app.use(session({
	store: store,
	resave: false,
	saveUninitialized: true,
	secret: 'supersecret'
}));

app.set('views', path.join(__dirname, 'pages'));
app.set('views engine', 'ejs');

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', function(req, res){
	var foundUser;
	for (var i = 0; i < users.length; i++) {
		var u = users[i];
		if(u.username == req.body.username && u.password == req.body.password){
			foundUser = u.username;
		}
	};
	if (foundUser !== undefined){
		req.session.username = req.body.username;
		res.send('Login successful: ' + 'sessionID ' + req.session.id + '; user: ' + req.session.username);
	} else {
		res.status(401).send('Login error');
	}
});

app.get('/logout', function(req, res){
	req.session.username = '';
	res.send('logged out!');
});

app.get('/admin', function(req, res){
	if (req.session.username == 'admin'){
		res.render('admin_page')
	} else {
		res.status(403).send('Access Denied!');
	}
});

app.get('/user', function(req, res){
	if (req.session.username.length > 0){
		res.render('user_page')
	} else {
		res.status(403).send('Access Denied!');
	}
});

app.get('/guest', function(req, res){
	res.render('guest_page')
});

app.listen(port, function(){
	console.log('app running on port ' + port);
});

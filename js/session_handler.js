var coockieParser = require('cookie-parser');
var session = require('express-session');
var MSSQLStore = require('connect-mssql')(session);
var mssql = require('mssql');

module.exports = {
	createStore: function(){
		var config = {
			user: 'test',
			password: '12345',
			server: 'localhost',
			database: 'testdb',
			port: '1433',
			pool: {
				max: 10,
				min: 0,
				idleTimeoutMillis: 3000,
			}
		}
		return new MSSQLStore(config);
	}
}

const express = require('express');
const morgan = require('morgan');
const redis = require('redis');
const config = require('./config');

const app = express();
app.use(morgan('tiny'));

const redisClient = redis.createClient({host: config.redis.host});

redisClient.on('error', err => {
	console.error(err);
});

app.get('/', (req, res) => {
	redisClient.get('count', (err, result) => {
		if (err) {
			console.error(err);
			return res.send(500);
		}
		res.json({count: result});
	});
});

app.post('/', (req, res) => {
	let count = redisClient.incr('count');
	redisClient.get('count', (err, result) => {
		if (err) {
			console.error(err);
			return res.send(500);
		}
		res.json({count: result});
	});
});

var server = app.listen(config.port, () => {
	console.log(`Example app listening on port ${server.address().port}!`);
});

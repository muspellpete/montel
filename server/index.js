const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database(':memory:');

app.use(express.json());

db.serialize(() => {

	db.run('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');

});

app.get('/test', (req, res) => {
	db.all('SELECT * FROM test', [], (err, rows) => {
		if(err) return res.status(500).json({error: err.message});
		res.json(rows);
	});
});

app.listen(3001, () => console.log('Backend running on port 3001'));

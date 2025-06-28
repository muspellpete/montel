const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const db = new sqlite3.Database(':memory:');

app.use(express.json());
app.use(cors());

db.serialize(() => {

	db.run('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');
	db.run('INSERT INTO test (name) VALUES ($1)', ["test"]);

});

app.get('/test', (req, res) => {
	db.all('SELECT * FROM test', [], (err, rows) => {
		if (err) {
			return res.status(500).json({error: err.message});
		}

		return res.json(rows);
	});
});

app.listen(3001, () => console.log('Backend running on port 3001'));

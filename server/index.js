const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const db = new sqlite3.Database(':memory:');

app.use(express.json());
app.use(cors());

db.serialize(() => {

	// Just to verify database connection
	db.run('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');
	db.run('INSERT INTO test (name) VALUES ($1)', ["test"]);

	// Note that type is simply text, having a separate table for type is overkill
	// assuming we never let the user input the type manually
	// TODO: should verify inputs in case user changes input in forms etc.
	db.run(`CREATE TABLE car (
		id INTEGER PRIMARY KEY, 
		type TEXT NOT NULL, 
		registration TEXT NOT NULL UNIQUE
	)`);
	
	db.run(`CREATE TABLE booking (
		id INTEGER PRIMARY KEY, 
		booking_number TEXT NOT NULL,
		car_id INTEGER NOT NULL,
		ssn TEXT NOT NULL,
		active BOOLEAN NOT NULL DEFAULT TRUE,
		FOREIGN KEY (car_id) REFERENCES car(id)
	)`);
	
	db.run('INSERT INTO car (type, registration) VALUES ("small", "ABC123")');
	db.run('INSERT INTO car (type, registration) VALUES ("small", "ABC124")');
	db.run('INSERT INTO car (type, registration) VALUES ("combi", "ABC125")');
	db.run('INSERT INTO car (type, registration) VALUES ("truck", "ABC126")');
});

// Test endpoint to verify database connection
app.get('/test', (req, res) => {
	db.all('SELECT * FROM test', [], (err, rows) => {
		if (err) {
			return res.status(500).json({error: err.message});
		}

		return res.json(rows);
	});
});

// Endpoint to get all cars
app.get('/cars', (_, res) => {
	db.all('SELECT * FROM car', [], (err, rows) => {
		if(err) {
			return res.status(500).json({error: err.message});
		}

		return res.json(rows);
	});
});

// Get all bookings for a specific car based on registration number
app.get('/booking', (req, res) => {
	db.all('SELECT booking.* FROM booking JOIN car ON car.id = booking.car_id WHERE car.registration = ?', [req.query.registration], (err, rows) => {
		if(err) {
			return res.status(500).json({error: err.message});
		}

		return res.json(rows);
	});
});

app.post('/booking', (req, res) => {
	const { booking_number, car_id, ssn } = req.body;

	if (!booking_number || !car_id || !ssn) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	const statement = db.prepare('INSERT INTO booking (booking_number, car_id, ssn, active) VALUES (?, ?, ?, TRUE)');
	statement.run(booking_number, car_id, ssn, function(err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.status(201).json({ id: this.lastID });
	});
	
	statement.finalize();
});

// Finish booking by updating the booking with the given booking number
app.put('/booking', (req, res) => {
	const booking_number = req.query.bookingNumber;

	if (!booking_number) {
		return res.status(400).json({ error: 'Missing booking number' });
	}

	const statement = db.prepare('UPDATE booking SET active = FALSE WHERE booking_number = ?');
	statement.run(booking_number, function(err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.status(200).json({ message: 'Booking updated successfully' });
	});
	
	statement.finalize();
})

app.delete('/clear_all_booking', (req, res) => {
	const statement = db.prepare('DELETE FROM booking');
	statement.run(function(err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.status(200).json({ message: 'All bookings cleared successfully' });
	});
	
	statement.finalize();
})


app.listen(3001, () => console.log('Backend running on port 3001'));

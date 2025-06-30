import React from 'react';

function CarReturn() {
	return <div>
		<h2>Car Return</h2>
		<button onClick={returnCarClick}>Return car</button>
		<button onClick={clearAllBookingsClick}>Clear all bookings</button>
	</div>
}

function clearAllBookingsClick() {
	if (!window.confirm("Are you sure you want to clear all bookings? This action cannot be undone.")) {
		return;
	}

	fetch('http://localhost:3001/clear_all_booking', {
		method: 'DELETE'
	}).then(response => {
		if(!response.ok) {
			throw new Error('Failed to clear bookings. Please try again later.');
		}
		
		alert('All bookings cleared successfully!');
	}).catch(error => {
		alert(error.message);
	});
}

function returnCarClick() {
	const booking = prompt("Input booking number to return car");
	if (!booking) {
		alert("Booking number is required to return a car.");
		return;
	}
	
	fetch(`http://localhost:3001/booking?bookingNumber=${encodeURIComponent(booking)}`, {
		method: 'PUT'
	}).then(response => {
		if(!response.ok) {
			throw new Error('Failed to return the car. Please check the booking number and try again.');
		}
		
		alert('Car returned successfully!');
	}).catch(error=> {
		alert(error.message);
	})
}

export default CarReturn;

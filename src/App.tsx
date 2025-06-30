import {useEffect, useState} from 'react';
import {Booking, Car} from '../shared/types';
import Header from './Header';
import './App.css';

function App() {
	const [cars, setCars] = useState<[Car, boolean][]>([]);
	useEffect(() => { 
		
		fetch('http://localhost:3001/cars')
		.then(response => {
			console.log(response);
			return response.json();
		})
		.then(json => {
			// For each car we need to check if it is available by
			// querying the booking endpoint for each car
			const carWithAvailabilityPromises = json.map((car: Car) => {
				return fetch(`http://localhost:3001/booking?registration=${car.registration}`)
					.then(response => response.json())
					.then((bookings: Booking[] | null) => {
						// If all bookings are inactive, the car is available
						const isAvailable = bookings === null || bookings.every(booking => !booking.active);
						console.log(isAvailable);
						
						return isAvailable;
						
						
					});
			});
			
			// Wait for all fetches to complete
			return Promise.all(carWithAvailabilityPromises)
				.then(availability => {
					// Combine car and availability into a tuple
					const carsWithAvailability = json.map((car: Car, index: number) => [car, availability[index]] as [Car, boolean]);
					setCars(carsWithAvailability);
				});
		})
		.catch(error => console.log(error));
	}, []);

  return (

	  <div>
	  <Header />
	  <table><tbody>
	  
	  {
		  cars.map(([car, available]) => <tr key={car.id}>
			  <td>{car.registration}</td>
			  <td><button disabled={!available} onClick={handleBooking(car)}>Book</button></td>
			  <td>Available: {available ? "yes" : "no"}</td>
			</tr>)
	  }

	  </tbody></table></div>
  );
}

function handleBooking(car: Car) {
	return () => {
		const ssn = prompt("Enter your social security number (SSN):");
		// generate hash for booking number to make sure its unique but not possible to guess or figure out a sequence for
		const bookingNumber = btoa(`${car.registration}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`);
		
		if (ssn) {
			fetch('http://localhost:3001/booking', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					car_id: car.id,
					ssn: ssn,
					booking_number: bookingNumber
				})
			})
			.then(response => response.json())
			.then(booking => {
				alert(`Booking successful! Booking ID: ${booking.id}`);
			})
			.catch(error => {
				console.error('Error booking the car:', error);
				alert('Failed to book the car. Please try again later.');
			});
		} else {
			alert("SSN is required to book a car.");
		}
	};
}

export default App;

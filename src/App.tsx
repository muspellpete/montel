import {useEffect, useState} from 'react';
import {Booking, Car} from '../shared/types';
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
			// Default to not being available until we can check
			setCars(json.map((car: Car) => [car, false] as [Car, boolean]));
			console.log(json);
		})
		.catch(error => console.log(error));
	}, []);

  return (

	  <div><table><tbody>
	  
	  {
		  cars.map(([car, available]) => <tr key={car.id}>
			  <td>{car.registration}</td>
			  <td><button disabled={!available}>Book</button></td>
			  <td>Available: {available ? "yes" : "no"}</td>
			</tr>)
	  }

	  </tbody></table></div>

  );
}

export default App;

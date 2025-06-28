import React, {useEffect, useState} from 'react';
import './App.css';

type Test = {
	id: number;
	name: string;
}

function App() {


	const [test, setTest] = useState<Test[]>([]);
	useEffect(() => { 
		fetch('http://localhost:3001/test')
		.then(response => {
			console.log(response);
			return response.json();
		})
		.then(json => {
			setTest(json);
			console.log(json);
		})
		.catch(error => console.log(error));
	}, []);

  return (

	  <div>From database: {test.map(testEntry => testEntry.name)}</div>
  );
}

export default App;

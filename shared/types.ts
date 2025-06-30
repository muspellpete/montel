/**
 * Used to determine price of car rental
 */
export enum CarType {
	Small = 'small',
	Combi = 'combi',
	Truck = 'truck'
}

/**
 * A physical car
 */
export interface Car {
	id: number;
	type: CarType;
	registration: string; // Registration number of the car
	currentlyBooked: boolean; // Only one person can book a car at a time (hopefully never changes)
}

/**
 * An instance of booking of a specific car, assuming it is available.
 */
export interface Booking {
	id: number;
	bookingNumber: string;
	car: Car;
	ssn: string; // Customer social security number
}

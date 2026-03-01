export interface BikeOption {
  id: string;
  name: string;
  description: string;
  speed: number;       // 1-10
  handling: number;    // 1-10
  acceleration: number; // 1-10
  imagePath: string;
  color: string;
  maxSpeed: number;    // actual max speed in km/h
  accelerationRate: number; // units per second
  turnSpeed: number;   // radians per second
}

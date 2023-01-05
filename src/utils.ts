import { Coordinate } from "./types";

export function coordToId(coord: Coordinate): string {
	const [row, col] = coord;

	return `${row}-${col}`;
}

export function idToCoord(id: string): Coordinate {
	const [row, col] = id.split("-").map((elem) => Number(elem));

	return [row, col];
}

export function mod(n: number, m: number) {
	return ((n % m) + m) % m;
}

export function randomNumber(range: number) {
	return Math.floor(Math.random() * range);
}

export function randomCoordinate(xRange: number, yRange: number): Coordinate {
	return [randomNumber(xRange), randomNumber(yRange)];
}

export function toggleClassById(id: string, className: string) {
	const element = document.getElementById(id) as HTMLElement;
	element.classList.toggle(className);
}

export function coordEqual([x1, y1]: Coordinate, [x2, y2]: Coordinate) {
	return x1 == x2 && y1 == y2;
}

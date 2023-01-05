import { Coordinate } from "./types";
import {
	coordEqual,
	coordToId,
	mod,
	randomCoordinate,
	toggleClassById
} from "./utils";

// grab DOM elements
const currentPlayerDisplay = document.querySelector(
	"#current-player"
) as HTMLElement;
const currentScoreDisplay = document.querySelector(
	"#current-score"
) as HTMLElement;
const startButton = document.querySelector("#start-button") as HTMLElement;
const resetButton = document.querySelector("#reset-button") as HTMLElement;
const gameGrid = document.querySelector("#game-grid") as HTMLElement;

// constants
const gridSize = 21;
const tickSpeed = 300;

// initialize state
type Snake = Array<Coordinate>;

const midpoint = Math.floor(gridSize / 2);

const starterSnake: Snake = [
	[midpoint + 1, midpoint],
	[midpoint, midpoint],
	[midpoint - 1, midpoint]
];

let isFinished = false;
let score = 0;
let snake: Snake = [...starterSnake];
let apples: Array<Coordinate> = [randomCoordinate(gridSize, gridSize)];

// setup key listener
document.addEventListener("keydown", (event) => {
	const key = event.code;
	lastDirection = currentDirection;

	switch (key) {
		case "ArrowUp":
			if (lastDirection == "down") {
				break;
			}
			currentDirection = "up";
			break;

		case "ArrowDown":
			if (lastDirection == "up") {
				break;
			}
			currentDirection = "down";
			break;

		case "ArrowLeft":
			if (lastDirection == "right") {
				break;
			}
			currentDirection = "left";
			break;

		case "ArrowRight":
			if (lastDirection == "left") {
				break;
			}
			currentDirection = "right";
			break;
	}
});

// setup grid
gameGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
gameGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

for (let row = 0; row < gridSize; row++) {
	for (let col = 0; col < gridSize; col++) {
		// create grid element
		const gridElement = document.createElement("div");

		// generate id
		const id = coordToId([row, col]);

		// set element attributes
		gridElement.id = id;
		gridElement.style.height = `${600 / gridSize - 2}px`;
		gridElement.style.width = `${600 / gridSize - 2}px`;
		gridElement.classList.add("grid-cell");

		// add grid element to gameGrid
		gameGrid?.appendChild(gridElement);
	}
}

function displayScore() {
	currentScoreDisplay.innerText = `Your current score is: ${score}`;
}

// function to make snake move
type Direction = "up" | "down" | "left" | "right";

let lastDirection: Direction = "up";
let currentDirection: Direction = "up";

function checkApples(newHead: Coordinate) {
	for (let i = 0; i < apples.length; i++) {
		const apple = apples[i];

		if (coordEqual(newHead, apple)) {
			const oldAppleId = coordToId(apple);
			toggleClassById(oldAppleId, "apple-cell");
			apples.splice(i, 1);
			const newApple = randomCoordinate(gridSize, gridSize);
			apples.push(newApple);
			const newAppleId = coordToId(newApple);
			toggleClassById(newAppleId, "apple-cell");

			score++;
			displayScore();

			return true;
		}
	}

	return false;
}

function executeMovement(newHead: Coordinate) {
	const selfIntersection = snake.find((snakeCell) =>
		coordEqual(snakeCell, newHead)
	);

	if (selfIntersection) {
		isFinished = true;
		return;
	}

	const ateApple = checkApples(newHead);

	if (!ateApple) {
		const oldTail = snake.shift()!;
		const oldTailId = coordToId(oldTail);
		toggleClassById(oldTailId, "snake-cell");
	}

	snake.push(newHead);
	const newHeadId = coordToId(newHead);
	toggleClassById(newHeadId, "snake-cell");
}

function moveSnake(currentDirection: Direction) {
	const currentHead = snake.at(-1)!;
	const [headRow, headCol] = currentHead;

	let newHead: Coordinate;

	switch (currentDirection) {
		case "up":
			newHead = [mod(headRow - 1, gridSize), headCol];
			executeMovement(newHead);

			break;
		case "down":
			newHead = [mod(headRow + 1, gridSize), headCol];
			executeMovement(newHead);

			break;
		case "left":
			newHead = [headRow, mod(headCol - 1, gridSize)];
			executeMovement(newHead);

			break;
		case "right":
			newHead = [headRow, mod(headCol + 1, gridSize)];
			executeMovement(newHead);

			break;
	}
}

// show snake
for (const snakeCell of snake) {
	const id = coordToId(snakeCell);
	const snakeCellElement = document.getElementById(id) as HTMLElement;
	snakeCellElement.classList.add("snake-cell");
}

// show apple
for (const appleCell of apples) {
	const id = coordToId(appleCell);
	const appleCellElement = document.getElementById(id) as HTMLElement;
	appleCellElement.classList.add("apple-cell");
}

function gameLoop() {
	setTimeout(() => {
		window.requestAnimationFrame(() => {
			moveSnake(currentDirection);
			if (!isFinished) {
				gameLoop();
			}
		});
	}, tickSpeed);
}

displayScore();
gameLoop();

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/input.txt', 'utf8' );

const UP = { x: 0, y: -1 };
const RIGHT = { x: 1, y: 0 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };

const DIRECTIONS = [ UP, RIGHT, DOWN, LEFT ];

const guard = {
	position: { x: 0, y: 0 },
	direction: UP
};
const positionRegistry = [];

const map = input
				.split('\n')
				.map( ( thisRow, rowNumber ) => thisRow
													.split('')
													.map( ( thisCell, columnNumber ) => {
															if ( thisCell === '^' ) {
																guard.position.x = columnNumber;
																guard.position.y = rowNumber;
																guard.direction = UP;
															}
															return thisCell;
														})
					);

const MAX_X = map[0].length - 1;
const MAX_Y = map.length - 1;

const turnRight = direction => {
	const currentIndex = DIRECTIONS.indexOf( direction );
	return DIRECTIONS[ ( currentIndex + 1 ) % DIRECTIONS.length ];		// just because it's fun :-D
}

const positionIsBlocked = position => {
	return map[position.y][position.x] === '#';		// annoyingly, the y comes first in the map
}

const translatePosition = ( position, direction ) => {
	return { x: position.x + direction.x, y: position.y + direction.y };
}

const positionIsOutOfBounds = position => {
	return position.x < 0 || position.y < 0 || position.x > MAX_X || position.y > MAX_Y;
}

const registerPosition = position => {
	if ( ! positionRegistry.find( examinePosition => position.x == examinePosition.x && position.y == examinePosition.y ) ) {
		positionRegistry.push( position );
	}
}

const move = guard => {

	const newPosition = translatePosition( guard.position, guard.direction );

	if ( positionIsOutOfBounds( newPosition ) ) {
		return false;
	}

	if ( positionIsBlocked( newPosition ) ) {
		guard.direction = turnRight( guard.direction );
		move( guard );
		return true;
	}

	guard.position = newPosition;
	registerPosition( guard.position );
	return true;
}

registerPosition( guard.position );
while ( move( guard ) ) {}

console.log( positionRegistry );
console.log( positionRegistry.length );
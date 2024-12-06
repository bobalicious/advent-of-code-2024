const fs = require('fs');
const input = fs.readFileSync( __dirname + '/input.txt', 'utf8' );

const UP = { x: 0, y: -1 };
const RIGHT = { x: 1, y: 0 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };

const DIRECTIONS = [ UP, RIGHT, DOWN, LEFT ];

const startingGuard = {
	position: { x: 0, y: 0 },
	direction: UP
};

const map = input
				.split('\n')
				.map( ( thisRow, rowNumber ) => thisRow
													.split('')
													.map( ( thisCell, columnNumber ) => {
															if ( thisCell === '^' ) {
																startingGuard.position.x = columnNumber;
																startingGuard.position.y = rowNumber;
																startingGuard.direction = UP;
															}
															return thisCell;
														})
					);

const MAX_X = map[0].length - 1;
const MAX_Y = map.length - 1;

let newObstacle = { x: undefined, y: undefined };

const turnRight = direction => {
	const currentIndex = DIRECTIONS.indexOf( direction );
	return DIRECTIONS[ ( currentIndex + 1 ) % DIRECTIONS.length ];		// just because it's fun :-D
}

const positionIsBlocked = position => {
	return map[position.y][position.x] === '#'									// annoyingly, the y comes first in the map
			|| ( newObstacle?.x == position.x && newObstacle?.y == position.y );
}

const translatePosition = ( position, direction ) => {
	return { x: position.x + direction.x, y: position.y + direction.y };
}

const positionIsOutOfBounds = position => {
	return position.x < 0 || position.y < 0 || position.x > MAX_X || position.y > MAX_Y;
}

const registerVisit = ( guard, pathRegistry ) => {
	if ( ! pathRegistry.some( examine => guard.position.x == examine.position.x && guard.position.y == examine.position.y ) ) {
		pathRegistry.push( { position: guard.position, direction: guard.direction } );
	}
}

const guardInLoop = ( guard, previousPath ) =>
	previousPath.some( examine =>
		guard.position.x == examine.position.x
		&& guard.position.y == examine.position.y
		&& guard.direction.x == examine.direction.x
		&& guard.direction.y == examine.direction.y
	);

let loopsDetected = 0;

const move = ( guard, pathRegistry ) => {

	if ( guardInLoop( guard, pathRegistry ) ) {
		console.log( 'Loop detected!' );
		loopsDetected++;
		return false;
	}

	registerVisit( guard, pathRegistry );

	const newPosition = translatePosition( guard.position, guard.direction );

	if ( positionIsOutOfBounds( newPosition ) ) {
		return false;
	}

	if ( positionIsBlocked( newPosition ) ) {
		guard.direction = turnRight( guard.direction );
		return move( guard, pathRegistry );
	}

	guard.position = newPosition;
	return true;
}

const walkRoute = ( startingGuard, pathRegistry ) => {
	const guard = { ...startingGuard };
	while ( move( guard, pathRegistry ) ) {}
}

const originalPathRegistry = [];

walkRoute( startingGuard, originalPathRegistry );

originalPathRegistry.forEach( thisPathEntry => {
	newObstacle = thisPathEntry.position;
	console.log( 'Checking obstable at:', newObstacle );
	walkRoute( startingGuard, [] );
});

console.log( loopsDetected );

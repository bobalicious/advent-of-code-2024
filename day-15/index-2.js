console.time( 'initialisation' );

const files = {
	tiny: 'tiny-input.txt',
	test: 'test-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

let robotLocation;

const map = [];

const none = '.';
const wall = '#';
const box = 'O';
const robot = '@';

const displacements = {
	'^': { x: 0, y: -1 },
	'v': { x: 0, y: 1 },
	'<': { x: -1, y: 0 },
	'>': { x: 1, y: 0 }
}

const [ mapInput, movementsInput ] = input.split( '\n\n' );

mapInput
	.split( '\n' )
	.map( ( row, y ) => {
		const rowArray = row.split( '' );
		rowArray.forEach( ( cell, x ) => {
			if ( cell === robot ) {
				robotLocation = { x, y };
			}
			map[ x ] = map[ x ] || [];
			map[ x ][ y ] = cell;
		});
		return rowArray;
	});

const movements = Array.from( movementsInput.split( '' ) ).filter( movement => Object.keys( displacements ).includes( movement ) );

const moveEntity = ( location, displacement ) => {
	const newLocation = { x: location.x + displacement.x, y: location.y + displacement.y };
	map[ newLocation.x ][ newLocation.y ] = map[ location.x ][ location.y ];
	map[ location.x ][ location.y ] = '.';
	return newLocation;
}

const moveEntities = ( locations, displacement ) => {
	console.log( 'move...', locations, 'by', displacement );
	locations.forEach( location => moveEntity( location, displacement ) );
}

const entityAt = location => {
	return map[ location.x ][ location.y ];
}

const canMove = ( location, displacement ) => {

	const newLocation = { x: location.x + displacement.x, y: location.y + displacement.y };
	const entityAtNewLocation = entityAt( newLocation );

	if ( entityAtNewLocation === wall ) {
		console.log( 'canMove?  No - wall' );
		return false;
	}

	if ( entityAtNewLocation === box ) {

		const boxesThatNeedToMove = canMove( newLocation, displacement );

		if ( boxesThatNeedToMove !== false ) {
			return [ ...boxesThatNeedToMove, newLocation ];
		}
		return false;
	}

	return [];
}

const moveRobot = ( location, displacement ) => {

	boxesThatNeedToMove = canMove( location, displacement );

	if ( boxesThatNeedToMove !== false ) {
		moveEntities( boxesThatNeedToMove, displacement );
		return moveEntity( location, displacement );
	}

	return location;
}

const allBoxLocations = () => {
	const boxLocations = [];
	map.forEach( ( column, x ) => {
		column.forEach( ( cell, y ) => {
			if ( cell === box ) {
				boxLocations.push( { x, y } );
			}
		});
	});
	return boxLocations;
}

const renderMap = () => {
	let mapStrings = [];
	map.forEach( ( column, x ) => {
		column.forEach( ( cell, y ) => {
			mapStrings[ y ] = mapStrings[ y ] || '';
			mapStrings[ y ] += entityAt( { x, y } ) === robot ? robot : cell;
		});
	});
	return mapStrings.join( '\n' );
}

console.timeEnd( 'initialisation' );
console.time( 'processing' );

movements
	.forEach( movement => {
		console.log( renderMap() );
		robotLocation = moveRobot( robotLocation, displacements[ movement ] );
	} );

console.log( renderMap() );

const total = allBoxLocations().reduce( ( total, boxLocation ) => {
	return total + ( boxLocation.x + ( boxLocation.y * 100 ) );
}, 0 );

console.log( total );
console.timeEnd( 'processing' );
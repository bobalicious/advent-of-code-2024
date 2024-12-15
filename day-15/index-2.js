console.time( 'initialisation' );

const files = {
	tiny: 'tiny-input.txt',
	tiny2: 'tiny2-input.txt',
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
const boxLeft = '[';
const boxRight = ']';
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
				robotLocation = { x: x*2, y };
			}
			const x1 = x*2;
			const x2 = x1 + 1;
			map[ x1 ] = map[ x1 ] || [];
			map[ x2 ] = map[ x2 ] || [];

			map[ x1 ][ y ] = cell == box ? boxLeft : cell;
			map[ x2 ][ y ] = cell == box ? boxRight : cell == robot ? none : cell;
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
	locations.forEach( location => moveEntity( location, displacement ) );
}

const entityAt = location => {
	return map[ location.x ][ location.y ];
}

const deduplicateThings = things => {
	const deduped = [];
	things.forEach( thisThing => {
		if ( ! deduped.some( thisDedupedThing => thisDedupedThing.x === thisThing.x && thisDedupedThing.y === thisThing.y ) ) {
			deduped.push( thisThing );
		}
	});
	return deduped;
}

const canMove = ( location, displacement ) => {

	const newLocation = { x: location.x + displacement.x, y: location.y + displacement.y };
	const entityAtNewLocation = entityAt( newLocation );

	if ( entityAtNewLocation === wall ) {
		return false;
	}

	if ( displacement.y === 0 ) {

		// horizontal movement follows the same rules as individual boxes

		if ( entityAtNewLocation === boxLeft || entityAtNewLocation === boxRight ) {
			const boxesThatNeedToMove = canMove( newLocation, displacement );
			if ( boxesThatNeedToMove !== false ) {
				return [ ...boxesThatNeedToMove, newLocation ];
			}
			return false;
		}
	} else {
		// vertical movement needs to check if the whole box can move

		if ( entityAtNewLocation === boxLeft || entityAtNewLocation === boxRight ) {

			let leftSideOfBoxLocation;
			let rightSideOfBoxLocation;

			if ( entityAtNewLocation === boxLeft ) {
				leftSideOfBoxLocation = { x: newLocation.x, y: newLocation.y };
				rightSideOfBoxLocation = { x: newLocation.x + 1, y: newLocation.y };
			} else {
				leftSideOfBoxLocation = { x: newLocation.x - 1, y: newLocation.y };
				rightSideOfBoxLocation = { x: newLocation.x, y: newLocation.y };
			}

			const boxesThatNeedToMoveForLeft = canMove( leftSideOfBoxLocation, displacement );
			const boxesThatNeedToMoveForRight = canMove( rightSideOfBoxLocation, displacement );

			if ( boxesThatNeedToMoveForLeft !== false && boxesThatNeedToMoveForRight !== false ) {
				const thingsToMove = [];
				if ( boxesThatNeedToMoveForLeft.length ) {
					thingsToMove.push( ...boxesThatNeedToMoveForLeft );
				}
				if ( boxesThatNeedToMoveForRight.length ) {
					thingsToMove.push( ...boxesThatNeedToMoveForRight );
				}
				thingsToMove.push( leftSideOfBoxLocation, rightSideOfBoxLocation );
				return deduplicateThings( thingsToMove );
			}
			return false;
		}
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
			if ( cell === boxLeft ) {
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
		robotLocation = moveRobot( robotLocation, displacements[ movement ] );
	} );

console.log( renderMap() );

const total = allBoxLocations().reduce( ( total, boxLocation ) => {
	return total + ( boxLocation.x + ( boxLocation.y * 100 ) );
}, 0 );

console.log( total );
console.timeEnd( 'processing' );
console.time( 'initialisation' );

const files = {
	test: 'test-input.txt',
	full: 'input.txt'
}

const properties = {
	test: {
		bytesToProcess: 12,
		gridSize: 6
	},
	full: {
		bytesToProcess: 1024,
		gridSize: 70
	}
}

const file = files[ process.argv[2] ] || files.full;
const { bytesToProcess, gridSize } = properties[ process.argv[2] ] || properties.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const wall = '#';
const none = '.';

const MAX_X = gridSize + 1;
const MAX_Y = gridSize + 1;
const MAX_COST = 999999999999999;

const startLocation = { x: 0, y: 0 };
const targetLocation = { x: gridSize, y: gridSize };
const map = Array( MAX_X ).fill(0).map( () => Array( MAX_Y ).fill( none ) );

const cheapestCosts = Array( MAX_X ).fill(0).map( () => Array( MAX_Y ).fill( MAX_COST ) );	// indexed by x, y

const moveCost = 1;
const possibleMoves = [
	{ x: 0, y: -1 },
	{ x: -1, y: 0 },
	{ x: 0, y: 1 },
	{ x: 1, y: 0 }
];

const byteDrops = input
					.split( '\n' )
					.map( cell => {
						const [ x, y ] = cell.split( ',' );
						return { x: parseInt( x ), y: parseInt( y ) };
					});

const clearMap = () => {
	map.forEach( ( col, xIndex ) => {
		col.forEach( ( cell, yIndex ) => {
			map[ xIndex ][ yIndex ] = none;
		});
	});
}

const clearCheapestCosts = () => {
	cheapestCosts.forEach( ( col, xIndex ) => {
		col.forEach( ( cell, yIndex ) => {
			cheapestCosts[ xIndex ][ yIndex ] = MAX_COST;
		});
	});
}

const buildMap = numberOfBytes => {
	clearMap();
	for ( let i = 0; i < numberOfBytes; i++ ) {
		const byte = byteDrops[ i ];
		map[ byte.x ][ byte.y ] = wall;
	}
}

const cheapestEndCost = () => {
	const cost = cheapestCosts[ startLocation.x ]?.[ startLocation.y ];
	return cost || 999999999999999;
}

const entityAt = location => {
	return map[ location.x ]?.[ location.y ];
}

const canMoveTo = location => {
	return entityAt( location ) === none;
}

const moveLocation = ( location, move ) => {
	return {
		x: location.x + move.x,
		y: location.y + move.y
	};
}

const registerCost = ( location, cost ) => {
	const currentCheapest = cheapestCosts[ location.x ][ location.y ];
	if ( currentCheapest && currentCheapest <= cost ) {
		return false;
	}
	cheapestCosts[ location.x ][ location.y ] = cost;
	return true;
}

const workOutCheapestCostsFrom = ( location, currentCost ) => {

	if ( location.x === startLocation.x && location.y === startLocation.y ) {
		return [];
	}

	if ( currentCost > cheapestEndCost() ) {
		return [];
	}

	const nextToCheck = [];

	// go in each direction
	possibleMoves.forEach( move => {
		const newLocation = moveLocation( location, move );
		if ( canMoveTo( newLocation ) ) {
			if ( registerCost( newLocation, currentCost + moveCost ) ) {
				nextToCheck.push( { location: newLocation, currentCost: currentCost + moveCost } );
			}
		}
	});

	return nextToCheck;
};

const solveMaze = () => {
	clearCheapestCosts();

	const movesToCheck = [
		{ location: targetLocation, currentCost: 0 },
	];

	while ( movesToCheck.length ) {
		const next = movesToCheck.shift();
		movesToCheck.push( ...workOutCheapestCostsFrom( next.location, next.currentCost ) );
	}
	return cheapestEndCost();
}

console.timeEnd( 'initialisation' );
console.time( 'processing' );

let highestPass = bytesToProcess;
let lowestFail = byteDrops.length;

while ( highestPass + 1 !== lowestFail ) {

	const currentByte = Math.floor( ( highestPass + lowestFail ) / 2 );
	buildMap( currentByte );
	const solveCost = solveMaze();

	if ( solveCost === MAX_COST ) {
		lowestFail = currentByte;
	} else {
		highestPass = currentByte;
	}
}

console.log( byteDrops[ highestPass ] );

console.timeEnd( 'processing' );
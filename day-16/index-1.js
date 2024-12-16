console.time( 'initialisation' );

const files = {
	tiny: 'tiny-input.txt',
	test: 'test-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const reindeer = 'S';
const target = 'E';
const wall = '#';
const none = '.';

const reindeerStartLocation = { x: 0, y: 0 };
const reindeerStartDirection = 3;
const targetLocation = { x: 0, y: 0 };
const map = [];
const cheapestCosts = [];	// indexed by x, y, direction

const moveCost = 1;
const possibleMoves = [
	{ x: 0, y: -1 },
	{ x: -1, y: 0 },
	{ x: 0, y: 1 },
	{ x: 1, y: 0 }
];

const turnCost = 1000;

const cheapestEndCost = () => {
	const cost = cheapestCosts[ reindeerStartLocation.x ]?.[ reindeerStartLocation.y ]?.[ reindeerStartDirection ];
	return cost || 999999999999999;
}

input
	.split( '\n' )
	.map( ( row, y ) => {
		const rowArray = row.split( '' );
		rowArray.forEach( ( cell, x ) => {
			if ( cell === reindeer ) {
				reindeerStartLocation.x = x;
				reindeerStartLocation.y = y;
			}
			if ( cell === target ) {
				targetLocation.x = x;
				targetLocation.y = y;
			}
			map[ x ] = map[ x ] || [];
			map[ x ][ y ] = cell;

			cheapestCosts[ x ] = cheapestCosts[ x ] || [];
			cheapestCosts[ x ][ y ] = [];
		});
		return rowArray;
	});

const entityAt = location => {
	return map[ location.x ]?.[ location.y ];
}

const canMoveTo = location => {
	return entityAt( location ) !== wall;
}

const moveLocation = ( location, direction ) => {
	return {
		x: location.x + ( possibleMoves[ direction ].x * -1 ),
		y: location.y + ( possibleMoves[ direction ].y * -1 )
	};
}

const registerCost = ( location, direction, cost ) => {
	const currentCheapest = cheapestCosts[ location.x ][ location.y ][ direction ];
	if ( currentCheapest && currentCheapest <= cost ) {
		return false;
	}
	cheapestCosts[ location.x ][ location.y ][ direction ] = cost;
	return true;
}

const renderCosts = () => {

	cheapestCosts.forEach( ( col, xIndex ) => {
		col.forEach( ( cell, yIndex ) => {
			if ( cell.length ) {
				console.log( xIndex, yIndex, cell);
			}
		});
	});
}

const workOutCheapestCostsFrom = ( location, direction, currentCost ) => {

	if ( location.x === reindeerStartLocation.x && location.y === reindeerStartLocation.y && direction === ( ( reindeerStartDirection + 2 ) % 4 ) ) {
		return [];
	}

	if ( currentCost > cheapestEndCost() ) {
		return [];
	}

	const nextToCheck = [];

	const forwardMove = moveLocation( location, direction );
	if ( canMoveTo( forwardMove ) ) {
		if ( registerCost( forwardMove, direction, currentCost + moveCost ) ) {
			nextToCheck.push( { location: forwardMove, direction: direction, currentCost: currentCost + moveCost } );
		}
	}

	const leftTurn = ( direction + 3 ) % 4;
	if ( registerCost( location, leftTurn, currentCost + turnCost ) ) {
		nextToCheck.push( { location: location, direction: leftTurn, currentCost: currentCost + turnCost } );
	}

	const rightTurn = ( direction + 1 ) % 4;
	if ( registerCost( location, rightTurn, currentCost + turnCost ) ) {
		nextToCheck.push( { location: location, direction: rightTurn, currentCost: currentCost + turnCost } );
	}
	return nextToCheck;
};

console.timeEnd( 'initialisation' );
console.time( 'processing' );

const movesToCheck = [
	{ location: targetLocation, direction: 0, currentCost: 0 },
	{ location: targetLocation, direction: 1, currentCost: 0 },
	{ location: targetLocation, direction: 2, currentCost: 0 },
	{ location: targetLocation, direction: 3, currentCost: 0 },
];

movesToCheck
	.forEach( move => {
		registerCost( move.location, move.direction, move.currentCost );
	}
);

while ( movesToCheck.length ) {
//	console.log( movesToCheck.length, 'moves to check', cheapestEndCost() );
	const next = movesToCheck.shift();
	movesToCheck.push( ...workOutCheapestCostsFrom( next.location, next.direction, next.currentCost ) );
}

renderCosts();
console.log( reindeerStartLocation, reindeerStartDirection );
const total = cheapestEndCost();

console.log( total );
console.timeEnd( 'processing' );
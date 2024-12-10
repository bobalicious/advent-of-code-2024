const startTime = new Date().getTime();

const files = {
	test: 'test-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const indexes = [];
const map = [];

input
	.split( '\n' )
	.map( ( row, y ) => {
		row.split( '' )
			.map( cell => parseInt( cell ) )
			.forEach( ( cell, x ) => {

				const cellRepresentation = {
					x: x,
					y: y,
					routesFrom: cell === 9 ? 1 : 0,
					value: cell
				};

				indexes[ cell ] = indexes[ cell ] || [];
				indexes[ cell ].push( cellRepresentation );

				map[ x ] = map[ x ] || [];
				map[ x ][ y ] = cellRepresentation;
			})
		});

const routeDirections = [
	{ x: 0, y: -1 },
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
	{ x: -1, y: 0 }
]

const getRouteCountFrom = ( cell ) => {
	return routeDirections
				.reduce( ( total, direction ) => {
					const neighbour = map[ cell.x + direction.x ]?.[ cell.y + direction.y ];
					return total + ( neighbour?.value === cell.value + 1 ? neighbour.routesFrom : 0 );
				}, 0 );
}

const getTotalRating = () => {
	return indexes[0].reduce( ( total, cell ) => total + cell.routesFrom, 0 );
}

const initialisedTime = new Date().getTime();

// start at 8, because all the 9s are already counted as 1
for ( let i=8; i>=0; i-- ) {
	for ( let j=0; j<indexes[ i ].length; j++ ) {
		indexes[ i ][ j ].routesFrom = getRouteCountFrom( indexes[ i ][ j ] );
	};
}

const total = getTotalRating();

const endTime = new Date().getTime();

console.log( 'Initialisation time:', initialisedTime - startTime, 'milliseconds' );
console.log( 'Processing time:', endTime - initialisedTime, 'milliseconds' );
console.log( total );
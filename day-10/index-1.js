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
					canReach: cell === 9 ? [{ x: x, y: y }] : null,
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

const combineReachables = ( a, b ) => {
	const combined = [ ...a ];
	b.filter( thisB => { return ! a.find( c => c.x === thisB.x && c.y === thisB.y ) } )
		.forEach( thisB => combined.push( thisB ) );
	return combined;
}

const getReachableFrom = ( cell ) => {
	return routeDirections
				.reduce( ( reachables, direction ) => {
					const neighbour = map[ cell.x + direction.x ]?.[ cell.y + direction.y ];
					if ( neighbour?.value === cell.value + 1 ) {
						reachables = combineReachables( reachables, neighbour.canReach );
					}
					return reachables;
				}, [] );
}

const getTotalRoutes = () => {
	return indexes[0].reduce( ( total, cell ) => total + cell.canReach.length, 0 );
}

const initialisedTime = new Date().getTime();

// start at 8, because all the 9s are already counted as 1
for ( let i=8; i>=0; i-- ) {
	for ( let j=0; j<indexes[ i ].length; j++ ) {
		indexes[ i ][ j ].canReach = getReachableFrom( indexes[ i ][ j ] );
	};
}

const total = getTotalRoutes();

const endTime = new Date().getTime();

console.log( 'Initialisation time:', initialisedTime - startTime, 'milliseconds' );
console.log( 'Processing time:', endTime - initialisedTime, 'milliseconds' );
console.log( total );
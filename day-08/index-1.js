const startTime = new Date().getTime();

const files = {
	test: 'test-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const antennas = new Map();
const antinodes = [];

let MAX_X = 0
let MAX_Y = 0;

const addAntenna = ( antennaType, position ) => {

	if ( !antennas.has( antennaType ) ) {
		antennas.set( antennaType, [] );
	}
	antennas.get( antennaType ).push( position );
}

const getPairs = positions => {

	pairs = [];
	for ( let i = 0; i < positions.length; i++ ) {
		for ( let j = i + 1; j < positions.length; j++ ) {
			pairs.push( {
				a: positions[i],
				b: positions[j]
			})
		}
	}
	return pairs;
}

const registerAntinode = position => {

	if ( position.x < 0 || position.x >= MAX_X || position.y < 0 || position.y >= MAX_Y ) return;

	if ( ! antinodes[ position.x ] ){
		antinodes[ position.x ] = [];
	}
	antinodes[ position.x ][ position.y ] = true;
}

const countAntinodes = () => antinodes.reduce( ( total, thisRow ) => thisRow.reduce( total => total + 1, total ), 0 );

const calculateAntinodes = pair => {

	const xDiff = pair.a.x - pair.b.x;
	const yDiff = pair.a.y - pair.b.y;
	const antinodes = [
		{ x: pair.a.x + xDiff, y: pair.a.y + yDiff },
		{ x: pair.b.x - xDiff, y: pair.b.y - yDiff },
	];
	return antinodes;
}

input
	.split( '\n' )
	.forEach( ( thisRow, y ) => {
		MAX_X = thisRow.length;
		MAX_Y++;
		thisRow.split( '' )
			.forEach( ( thisCell, x ) => {
				if ( thisCell !== '.' ) {
					addAntenna( thisCell, { x: x, y: y } );
				}
			})
		});

const initialisedTime = new Date().getTime();

antennas.forEach( positions => {
	getPairs( positions )
		.forEach( pair => calculateAntinodes( pair )
								.forEach( position => registerAntinode( position ) )
		)
});


const total = countAntinodes();


const endTime =new Date().getTime();

console.log( 'Initialisation time:', initialisedTime - startTime, 'milliseconds' );
console.log( 'Processing time:', endTime - initialisedTime, 'milliseconds' );
console.log( total );
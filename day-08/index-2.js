const startTime = new Date().getTime();

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/input.txt', 'utf8' );

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

const findCommonFactor = ( a, b ) => {

	if ( a > b ) {
		[a, b] = [b, a];
	}

	for ( let potentialFactor = Math.floor( a / 2 ); potentialFactor > 1; potentialFactor-- ) {
		if ( a % potentialFactor === 0 && b % potentialFactor === 0 ) {
			return potentialFactor;
		}
	}
	return 1;

}

const reduceVector = vector => {

	const commonFactor = findCommonFactor( Math.abs( vector.x ), Math.abs( vector.y ) );
	return {
		x: vector.x / commonFactor,
		y: vector.y / commonFactor
	}
}

const calculateAntinodesInDirection = ( baseNode, vector ) => {

	const antinodes = [];
	let x = baseNode.x + vector.x;
	let y = baseNode.y + vector.y;

	while( x < MAX_X && x >= 0 && y < MAX_Y && y >= 0 ) {
		antinodes.push( { x: x, y: y } );
		x += vector.x;
		y += vector.y;
	}
	return antinodes;
}

const calculateAntinodes = pair => {

	const xDiff = pair.a.x - pair.b.x;
	const yDiff = pair.a.y - pair.b.y;

	const reducedVector = reduceVector( { x: xDiff, y: yDiff } );

	const antinodes = [ pair.a, pair.b ];	// every antenna in a pair is an antinode
	antinodes.push( ...calculateAntinodesInDirection( pair.a, reducedVector ) );
	antinodes.push( ...calculateAntinodesInDirection( pair.b, { x: reducedVector.x * -1, y: reducedVector.y * -1 } ) );

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

const endTime = new Date().getTime();

console.log( 'Initialisation time:', initialisedTime - startTime, 'milliseconds' );
console.log( 'Processing time:', endTime - initialisedTime, 'milliseconds' );
console.log( total );
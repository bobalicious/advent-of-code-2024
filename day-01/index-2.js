const fs = require('fs');

const input = fs.readFileSync( __dirname + '/input.txt', 'utf8' );

const array1 = [];
const array2 = [];

input.split('\n').forEach( line => {
	const found = line.match( /(\d*)\s+(\d*)/ );
	array1.push( parseInt( found[1] ) );
	array2.push( parseInt( found[2] ) );
});

array1.sort( (a, b) => a - b );
array2.sort( (a, b) => a - b );

let similarity = 0;
let array2Index = 0;

array1.forEach( ( array1Value ) => {
	while( array2Index < array2.length && array2[array2Index] <= array1Value ) {
		if ( array2[array2Index] === array1Value ) {
			similarity += array1Value;
		}
		array2Index++;
	}
});

console.log( similarity );
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

let difference = 0;
array1.forEach( ( value, index ) => {
	difference += Math.abs( value - array2[index] );
});

console.log( difference );
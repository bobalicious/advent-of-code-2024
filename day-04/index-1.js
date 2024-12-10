const startTime = new Date().getTime();


const fs = require('fs');
const input = fs.readFileSync( __dirname + '/input.txt', 'utf8' );

const lines = input.split( '\n' );

const directions = [
	{ x: 1, y: -1 },
	{ x: 1, y: 0 },
	{ x: 1, y: 1 },
	{ x: 0, y: -1 },
	{ x: 0, y: 1 },
	{ x: -1, y: -1 },
	{ x: -1, y: 0 },
	{ x: -1, y: 1 }
];

const checkForWord = ( x, y, direction, word ) => {

	if ( word.length === 0 ) {
		return true;
	}

	if ( lines[y]?.[x] !== word[0] ) {
		return false;
	}

	return checkForWord( x + direction.x, y + direction.y, direction, word.substring(1) );
}

const searchString = 'XMAS';
let count = 0;

const initialisedTime = new Date().getTime();

lines.forEach( ( thisLine, lineNumber ) => {

	Array.from( thisLine ).forEach( ( thisChar, charNumber ) => {
		directions.forEach( thisDirection => {
			if ( checkForWord( charNumber, lineNumber, thisDirection, searchString ) ) {
				count++;
			}
		})
	})
});

const endTime = new Date().getTime();

console.log( 'Initialisation time:', initialisedTime - startTime, 'milliseconds' );
console.log( 'Processing time:', endTime - initialisedTime, 'milliseconds' );
console.log( count );
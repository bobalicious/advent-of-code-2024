const fs = require('fs');
const input = fs.readFileSync( __dirname + '/input.txt', 'utf8' );

const lines = input.split( '\n' );
const lineLength = lines.length;

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

const getCharAt = ( x, y ) => {
	return lines[y][x];
}

const checkForWord = ( x, y, direction, word ) => {

	if ( word.length === 0 ) {
		return true;
	}

	if ( x<0 || x>=lineLength || y<0 || y>=lines.length ) {
		return false;
	}

	if ( getCharAt( x, y ) !== word[0] ) {
		return false;
	}

	return checkForWord( x + direction.x, y + direction.y, direction, word.substring(1) );
}

let count = 0;
lines.forEach( ( thisLine, lineNumber ) => {

	const searchString = 'XMAS';

	Array.from( thisLine ).forEach( ( thisChar, charNumber ) => {
		directions.forEach( thisDirection => {
			if ( checkForWord( charNumber, lineNumber, thisDirection, searchString ) ) {
				count++;
			}
		})
	})
});

console.log( count );
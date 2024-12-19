console.time( 'initialisation' );

const files = {
	longsingle: 'long-single-input.txt',
	tiny: 'tiny-input.txt',
	test: 'test-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const [ towelsRaw, patternsRaw ] = input.split( '\n\n' );

const towels = towelsRaw.split( ', ' );
const patterns = patternsRaw.split( '\n' );

const fullTowelsIndex = {};

towels.forEach( towel => {
	let indexPoint = fullTowelsIndex;
	Array.from( towel ).forEach( ( char, charIndex ) => {
		const newTowelIndex = ( charIndex === towel.length - 1 ? fullTowelsIndex : {} );
		if ( !indexPoint[ char ] ) {
			indexPoint[ char ] = [];
		}
		indexPoint[ char ].push( newTowelIndex );
		indexPoint = newTowelIndex;
	});
});

const failurePatterns = {};

const checkPattern = ( pattern, thisPatternTowelIndex, towels, thisTowel ) => {


	if ( fullTowelsIndex === thisPatternTowelIndex && thisTowel.length ) {
		towels.push( thisTowel );
		thisTowel = '';
	}

	if ( failurePatterns[ pattern ] && ! thisTowel.length ) {
		console.log( 'Skipping', pattern );
		return false;
	}


	if ( pattern.length === 0 ) {
		return ( thisTowel.length === 0 );
	}

	const char = pattern[0];

	if ( thisPatternTowelIndex[ char ] ) {
		const result = thisPatternTowelIndex[ char ].some( towelIndex => checkPattern( pattern.slice( 1 ), towelIndex, towels, thisTowel + char ) );
		if ( ! result && ! thisTowel.length ) {
			failurePatterns[ pattern ] = true;
		}
		return result;
	}
	if ( ! thisTowel.length ) {
		failurePatterns[ pattern ] = true;
	}
	return false;
};

console.timeEnd( 'initialisation' );
console.time( 'processing' );

console.log( towels );
const total = patterns.reduce( ( total, pattern, index ) => {
//	console.log( 'Checking towel', index, pattern );
	return total + ( pattern,checkPattern( pattern, fullTowelsIndex, [], '' ) ? 1 : 0 );
}, 0);
console.log( total );

// patterns.forEach( pattern => {
// 	console.log( checkPattern( pattern, fullTowelsIndex, [], '' ), pattern );
// });
console.timeEnd( 'processing' );
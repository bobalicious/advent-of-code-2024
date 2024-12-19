console.time( 'initialisation' );

const files = {
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

const patternVariations = {
}

const cache = ( pattern, count ) => {
	patternVariations[ pattern ] = count;
}

const inCache = pattern => {
	return patternVariations[ pattern ] !== undefined;
}

const cached = pattern => {
	return patternVariations[ pattern ];
}

const checkPattern = ( pattern, thisPatternTowelIndex, towels, thisTowel ) => {

	if ( fullTowelsIndex === thisPatternTowelIndex && thisTowel.length ) {
		towels.push( thisTowel );
		thisTowel = '';
	}

	if ( inCache( pattern ) && ! thisTowel.length ) {
		return cached( pattern );
	}

	if ( pattern.length === 0 ) {
		return ( thisTowel.length === 0 );
	}

	const char = pattern[0];

	if ( thisPatternTowelIndex[ char ] ) {
		const result = thisPatternTowelIndex[ char ]
							.reduce( ( total, towelIndex ) => {
								return total + checkPattern( pattern.slice( 1 ), towelIndex, towels, thisTowel + char )
							}, 0 );
		if ( ! thisTowel.length ) {
			cache( pattern, result );
		}
		return result;
	}

	if ( ! thisTowel.length ) {
		cache( pattern, 0 );
	}
	return 0;
};

console.timeEnd( 'initialisation' );
console.time( 'processing' );

const total = patterns.reduce( ( total, pattern, index ) => {
	return total + ( pattern,checkPattern( pattern, fullTowelsIndex, [], '' ) );
}, 0);
console.log( total );

// patterns.forEach( pattern => {
// 	console.log( checkPattern( pattern, fullTowelsIndex, [], '' ), pattern );
// });
console.timeEnd( 'processing' );
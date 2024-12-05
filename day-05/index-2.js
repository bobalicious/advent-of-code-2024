const fs = require('fs');
const input = fs.readFileSync( __dirname + '/input.txt', 'utf8' );

const fileParts = input.split('\n\n');

const rawRules = fileParts[0]
					.split('\n')
					.map( thisRule => thisRule.split('|')
										.map( thisValue => value = parseInt( thisValue )  )
					);

const updates = fileParts[1]
					.split('\n')
					.map( thisUpdate => thisUpdate.split(',')
										.map( thisValue => value = parseInt( thisValue )  )
					);


const requiredPreceedingPages = [];
rawRules.forEach( thisRule => {
	const preceedingPage = thisRule[0];
	const thisPage = thisRule[1];

	if ( !requiredPreceedingPages[ thisPage ] ) {
		requiredPreceedingPages[ thisPage ] = [];
	}
	requiredPreceedingPages[ thisPage ].push( preceedingPage );
});

const findRequiredPrecedingPages = pageBeingPrinted => {
	return requiredPreceedingPages[ pageBeingPrinted ] || [];
}

const passesRules = thisUpdate => {

	for ( let i = 0; i < thisUpdate.length; i++ ) {

		const thisPage = thisUpdate[i];
		const preceedingPages = thisUpdate.slice( 0, i );
		const requiredPreceedingPages = findRequiredPrecedingPages( thisPage );

		for ( let j = 0; j < requiredPreceedingPages.length; j++ ) {
			const requiredPage = requiredPreceedingPages[j];
			if ( thisUpdate.includes( requiredPage ) && ! preceedingPages.includes( requiredPage ) ) {
				return false;
			}
		}
	}
	return true;
}

const failsRules = thisUpdate => {
	return ! passesRules( thisUpdate );
}

const compagePagesBasedOnRules = ( thisPage, otherPage ) => {
	if ( requiredPreceedingPages[ thisPage ]?.includes( otherPage ) ) {
		return -1;
	}

	if ( requiredPreceedingPages[ otherPage ]?.includes( thisPage ) ) {
		return 1;
	}

	return 0;
}

const sortPagesToPassRules = thisUpdate => {
	return thisUpdate.sort( compagePagesBasedOnRules );
}

const findMiddlePage = thisUpdate => {
	return thisUpdate[ Math.floor( thisUpdate.length / 2 ) ];
}

const result = updates
					.filter( failsRules )
					.map( sortPagesToPassRules )
					.reduce( ( acc, thisUpdate ) => acc + findMiddlePage( thisUpdate ), 0 );

console.log( result );
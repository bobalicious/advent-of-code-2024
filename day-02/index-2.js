const fs = require('fs');
const input = fs.readFileSync( __dirname + '/input.txt', 'utf8' );

const baseReportIsSafe = report => {

	let direction = report[0] > report[1] ? -1 : 1;			// if the first number is the same as the second, it doesn't matter if we set the wrong directiom, the loop will fail it anyway

	for ( let index=1; index<report.length; index++ ) {		// start at 1 because we're always comparing to the previous value

		const previousValue = report[index - 1];
		const currentValue = report[index];

		const difference = ( currentValue - previousValue ) * direction;
		if ( difference < 1 || difference > 3 ) {
			return false;
		}
	}
	return true;
}

const levelRemovedVariants = report => {
	const levelRemovedVariants = [];
	for ( let indexToRemove=0; indexToRemove<report.length; indexToRemove++ ) {
		levelRemovedVariants.push( report.filter( ( value, index ) => index !== indexToRemove ) );
	}
	return levelRemovedVariants;
}

const aLevelRemovedVariantIsSafe = report => {
	return levelRemovedVariants( report )
				.some( baseReportIsSafe );
}

const reportIsSafe = report => {
	return baseReportIsSafe( report ) || aLevelRemovedVariantIsSafe( report );
}

let safeCount = input.split('\n')
						.map( thisReport => thisReport.split(' ')
														.map( thisValue => parseInt( thisValue ) ) )
						.filter( reportIsSafe )
						.length;

console.log( safeCount );
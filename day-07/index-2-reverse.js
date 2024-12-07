const startTime = new Date().getTime();

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/input.txt', 'utf8' );

const reverseOperations = [
	// +
	( total, current  ) => {
		const calculated = total - current;
		return calculated <= 0 ? false : calculated;
	},
	// *
	( total, current ) => {
		const calculated = total / current;
		return parseInt( calculated ) == calculated ? calculated : false;
	},
	// ||
	( total, current ) => {
		const totalString = String( total );
		const currentString = String( current );
		return totalString.endsWith( currentString ) ? parseInt( totalString.substring( 0, totalString.length - currentString.length ) ): false;
	}
]

const testValues = ( target, values ) => {

	if ( values.length === 1 ) {
		return target === values[0];
	}

	values = [...values];
	const thisValue = values.pop();

	return reverseOperations.some(
		thisOperation => {
			const calculated = thisOperation( target, thisValue );
			return calculated && testValues( calculated, values );
		})
};

const testCalibration = ( calibration ) => {
	return testValues( calibration.target, calibration.input );
}

const calibrations = input
						.split( '\n' )
						.map( thisRow => {
							const thisRowParts = thisRow.split( ': ' );
							return {
								target: parseInt( thisRowParts[0] ),
								input: thisRowParts[1]
											.split( ' ' )
											.map( thisNumber => parseInt( thisNumber ) )
							}
						});

const initialisedTime = new Date().getTime();

const total = calibrations.reduce( ( total, thisCalibration ) => {
	return total + ( testCalibration( thisCalibration ) ? thisCalibration.target : 0 );
}, 0 );

const endTime = new Date().getTime();

console.log( 'Initialisation time:', initialisedTime - startTime, 'milliseconds' );	// 2ms
console.log( 'Processing time:', endTime - initialisedTime, 'milliseconds' );		// 80ms for original - 4ms for new
console.log( total );
const fs = require('fs');
const input = fs.readFileSync( __dirname + '/input.txt', 'utf8' );

const operations = new Map();
operations.set( '+', ( a, b ) => a + b );
operations.set( '*', ( a, b ) => a * b );
operations.set( '||', ( a, b ) => parseInt( String( a ).concat( String( b ) ) ) );

const availableOperations = Array.from( operations.keys() );

const operationPermutations = ( numberOfOperations ) => {

	if ( numberOfOperations === 1 ) {
		return availableOperations.map( thisOperation => [ thisOperation ] );
	}

	const previousPermutations = operationPermutations( numberOfOperations - 1 );
	const newPermutations = [];

	previousPermutations.forEach( thisPermutation => {
		availableOperations.forEach( thisOperation => {
				newPermutations.push( [ ...thisPermutation, thisOperation ] );
		});
	});
	return newPermutations;
}

const applyOperation = ( operation, a, b ) => {
	return operations.get( operation )( a, b );
}

const applyOperations = ( operations, numbers ) => {
	let total = numbers[0];
	operations.forEach( ( thisOperation, index ) => {
		total = applyOperation( thisOperation, total, numbers[index + 1] );
	});
	return total;
}

const testCalibration = calibration => {
	return operationPermutations( calibration.input.length - 1 )
			.some( thisPermutation => applyOperations( thisPermutation, calibration.input ) === calibration.target );
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

const total = calibrations.reduce( ( total, thisCalibration ) => {
	return total + ( testCalibration( thisCalibration ) ? thisCalibration.target : 0 );
}, 0 );

console.log( total );
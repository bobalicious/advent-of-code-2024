console.time( 'initialisation' );

const files = {
	test: 'test-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const machines = input
					.split( '\n\n' )
					.map( machine => {
						machine = machine.split( '\n' );
						const buttonRegex = /X.([0-9]+).*Y.([0-9]+)/

						const buttonAMatches = machine[0].match( buttonRegex );
						const buttonBMatches = machine[1].match( buttonRegex );
						const pMatches = machine[2].match( buttonRegex );

						return {
									a: {
										x: buttonAMatches[1],
										y: buttonAMatches[2]
									},
									b: {
										x: buttonBMatches[1],
										y: buttonBMatches[2]
									},
									p: {
										x: parseInt( pMatches[1] ) + 10000000000000,
										y: parseInt( pMatches[2] ) + 10000000000000
									}
								};
	});

const findAPresses = m => {
	return ( ( m.p.x * m.b.y ) - ( m.b.x * m.p.y ) ) / ( ( m.a.x * m.b.y ) - ( m.b.x * m.a.y ) );
}

const findBPresses = m => {
	return ( ( m.p.y * m.a.x ) - ( m.a.y * m.p.x ) ) / ( ( m.a.x * m.b.y ) - ( m.b.x * m.a.y ) );
}

const findWin = machine => {
	const aPresses = findAPresses( machine );
	const bPresses = findBPresses( machine );

	return Number.isInteger( aPresses ) && Number.isInteger( bPresses ) && aPresses >= 0 && bPresses >= 0 ? (aPresses * 3) + bPresses : 0;
}

console.timeEnd( 'initialisation' );
console.time( 'processing' );

const total = machines.reduce( ( total, machine ) => total + findWin( machine ), 0 );

console.log( total );
console.timeEnd( 'processing' );
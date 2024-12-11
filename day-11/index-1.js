const startTime = new Date().getTime();

const files = {
	test: 'test-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const stonesProcessors = [
	{
		test: stone => stone == 0,
		action: stone => [ 1 ]
	},
	{
		test: stone => String( stone ).length % 2 === 0,
		action: stone => {
			const stoneString = String( stone );
			return [
				parseInt( stoneString.substring( 0, stoneString.length / 2 ) ),
				parseInt( stoneString.substring( stoneString.length / 2 ) )
			]
		}
	},
	{
		test: stone => true,
		action: stone => [ stone * 2024 ]
	}
]

const processStone = ( stone, newStones ) => {
	newStones.push(
		...stonesProcessors
			.find( processor => processor.test( stone ) )
			.action( stone )
	);
}

const processStones = stones => {
	const newStones = [];
	stones.forEach( stone => processStone( stone, newStones ) );
	return newStones;
}

let stones = input
				.split( ' ' )
				.map( stone => parseInt( stone ) );

const initialisedTime = new Date().getTime();

const blinks = 25;
for ( let i=0; i<blinks; i++ ) {
	stones = processStones( stones );
}

const endTime = new Date().getTime();

console.log( 'Initialisation time:', initialisedTime - startTime, 'milliseconds' );
console.log( 'Processing time:', endTime - initialisedTime, 'milliseconds' );
console.log( stones.length );
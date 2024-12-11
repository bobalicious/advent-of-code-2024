const startTime = new Date().getTime();

const files = {
	test: 'test-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const stonesCache = new Map()
						.set( 0, [ 1 ] );

const stonesProcessors = [
	{
		test: stone => stonesCache.has( stone ),
		action: stone => stonesCache.get( stone )
	},
	{
		test: stone => String( stone ).length % 2 === 0,
		action: stone => {
			const stoneString = String( stone );
			const returnStones = [
				parseInt( stoneString.substring( 0, stoneString.length / 2 ) ),
				parseInt( stoneString.substring( stoneString.length / 2 ) )
			];
			stonesCache.set( stone, returnStones );
			return returnStones;
		}
	},
	{
		test: stone => true,
		action: stone => {
			const returnStones = [ stone * 2024 ];
			stonesCache.set( stone, returnStones );
			return returnStones;
		}
	}
]

const processStone = ( stone, count, newStonesCount ) => {
	stonesProcessors
		.find( processor => processor.test( stone ) )
		.action( stone )
		.forEach( newStone => {
			newStonesCount.has( newStone ) ? newStonesCount.set( newStone, newStonesCount.get( newStone ) + count ) : newStonesCount.set( newStone, count );
		});
}

const processStones = stones => {
	const newStonesCounts = new Map();
	stones.forEach( ( count, stone ) => processStone( stone, count, newStonesCounts ) );
	return newStonesCounts;
}

let stonesCounts = new Map();

input
	.split( ' ' )
	.map( stone => parseInt( stone ) )
	.forEach( stone => {
		stonesCounts.has( stone ) ? stonesCounts.set( stone, stonesCounts.get( stone ) + 1 ) : stonesCounts.set( stone, 1 );
	});


const initialisedTime = new Date().getTime();

const blinks = 75;
for ( let i=0; i<blinks; i++ ) {
	stonesCounts = processStones( stonesCounts );
}

let total = 0;
stonesCounts.forEach( ( count, stone ) => {
	total += count;
});

const endTime = new Date().getTime();

console.log( 'Initialisation time:', initialisedTime - startTime, 'milliseconds' );
console.log( 'Processing time:', endTime - initialisedTime, 'milliseconds' );
console.log( total );
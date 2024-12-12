console.time( 'initialisation' );

const files = {
	test: 'test-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const regionMap = [];
const regionIndexes = [];

const displacements = [
	{ x: 0, y: -1 },
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
	{ x: -1, y: 0 }
];

const getSurroundingPoints = ( regionIdentifier, x, y ) => {
	return displacements
			.reduce( ( surroundingPoints, displacement ) => {
				const point = regionMap[ x + displacement.x ]?.[ y + displacement.y ];
				if ( point?.regionIdentifier === regionIdentifier ) {
					surroundingPoints.push( point );
				}
				return surroundingPoints;
			}, [] );
}

const addToRegion = ( region, point ) => {

	if ( point.region !== false ) {
		return;
	}
	region.add( point );
	point.region = region;

	getSurroundingPoints( point.regionIdentifier, point.x, point.y )
		.forEach( surroundingPoint => {
			addToRegion( region, surroundingPoint );
		});
}

const findRegion = point => {
	// if we already have a region, then skip it
	if ( point.region !== false ) {
		return;
	}

	// otherwise, create a new region
	const newRegion = new Set();
	regionIndexes.push( newRegion );

	addToRegion( newRegion, point );
}

input
	.split( '\n' )
	.map( ( row, y ) => {
		row.split( '' )
			.map( cell => cell )
			.forEach( ( regionIdentifier, x ) => {
				const point = {
					x: x,
					y: y,
					regionIdentifier: regionIdentifier,
					perimeters: 0,
					region: false,
				}

				regionMap[ x ] = regionMap[ x ] || [];
				regionMap[ x ][ y ] = point;
			})
	});

console.timeEnd( 'initialisation' );
console.time( 'processing' );

regionMap.forEach( ( row ) => {
	row.forEach( ( point ) => {
		findRegion( point );
		point.perimeters = 4 - getSurroundingPoints( point.regionIdentifier, point.x, point.y ).length;
	});
});

console.log(
	regionIndexes.reduce( ( total, region ) => {
		const perimeterTotal = Array.from( region ).reduce( ( perimeters, point ) => perimeters + point.perimeters, 0 );
		return total + ( region.size * perimeterTotal );
	}, 0 )
);

console.timeEnd( 'processing' );
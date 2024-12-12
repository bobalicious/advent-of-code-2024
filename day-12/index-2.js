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
	if ( point.region !== false ) {
		return;
	}

	const newRegion = new Set();
	regionIndexes.push( newRegion );

	addToRegion( newRegion, point );
}

const countSides = region => {

	let sides = 0;
	const regionMap = [];

	region.forEach( point => {
		regionMap[ point.x ] = regionMap[ point.x ] || [];
		regionMap[ point.x ][ point.y ] = point;
	});

	regionMap.forEach( ( col, x ) => {
		col.forEach( ( point, y ) => {
			if ( point ) {
				if ( point.perimeters.left && ! point.perimeterExamined?.left ) {
					sides++;
					markLookedAt( regionMap, point, 'left' );
				}
				if ( point.perimeters.right && ! point.perimeterExamined?.right ) {
					sides++;
					markLookedAt( regionMap, point, 'right' );
				}
				if ( point.perimeters.top && ! point.perimeterExamined?.top ) {
					sides++;
					markLookedAt( regionMap, point, 'top' );
				}
				if ( point.perimeters.bottom && ! point.perimeterExamined?.bottom ) {
					sides++;
					markLookedAt( regionMap, point, 'bottom' );
				}
			}
		});
	});

	return sides;
}

const lookDirections = {
	left: { x: 0, y: 1 },
	right: { x: 0, y: 1 },
	top: { x: 1, y: 0 },
	bottom: { x: 1, y: 0 }
}

const markLookedAt = ( regionMap, point, direction ) => {

	point.perimeterExamined = point.perimeterExamined || {};
	point.perimeterExamined[ direction ] = true;
	const next = regionMap[ point.x + lookDirections[ direction ].x ]?.[ point.y + lookDirections[ direction ].y ];
	if ( next?.perimeters[ direction ] ) {
		markLookedAt( regionMap, next, direction );
	}
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

		point.perimeters = {
			top: true,
			bottom: true,
			left: true,
			right: true,
		};

		getSurroundingPoints( point.regionIdentifier, point.x, point.y )
			.forEach( surroundingPoint => {
				if ( surroundingPoint.y < point.y ) {
					point.perimeters.top = false;
				} else if ( surroundingPoint.y > point.y ) {
					point.perimeters.bottom = false;
				} else if ( surroundingPoint.x < point.x ) {
					point.perimeters.left = false;
				} else if ( surroundingPoint.x > point.x ) {
					point.perimeters.right = false;
				}
			});
	});
});

const total = regionIndexes.reduce( ( total, region ) => {
	return total + ( region.size *  countSides( region ) );
}, 0 );

console.log( total );

console.timeEnd( 'processing' );
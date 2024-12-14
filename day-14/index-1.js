console.time( 'initialisation' );

const mapSizes = {
	tiny: { x: 11, y: 7 },
	test: { x: 11, y: 7 },
	full: { x: 101, y: 103 }
}

const MAP_X_SIZE = mapSizes[ process.argv[2] ] ? mapSizes[ process.argv[2] ].x : mapSizes[ 'full' ].x;
const MAP_Y_SIZE = mapSizes[ process.argv[2] ] ? mapSizes[ process.argv[2] ].y : mapSizes[ 'full' ].y;

const QUADRANT_X_BOUNDARY = Math.floor( MAP_X_SIZE / 2 );
const QUADRANT_Y_BOUNDARY = Math.floor( MAP_Y_SIZE / 2 );

const files = {
	tiny: 'tiny-input.txt',
	test: 'test-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const robots = input.split( '\n' )
					.map( line => {
						const matches = line.match( /p=([\-0-9]+),([\-0-9]+).*=([\-0-9]+),([\-0-9]+)/ );
						return {
							p: {
								x:	parseInt( matches[1] ),
								y:	parseInt( matches[2] )
							},
							v: {
								x:	parseInt( matches[3] ),
								y:	parseInt( matches[4] )
							}
						}
					});

const quadrants = Array(4).fill(0).map( () => [] );

const findQuadrant = robot => {
	if ( robot.p.x > QUADRANT_X_BOUNDARY && robot.p.y > QUADRANT_Y_BOUNDARY ) {
		return 0;
	} else if ( robot.p.x > QUADRANT_X_BOUNDARY && robot.p.y < QUADRANT_Y_BOUNDARY ) {
		return 1;
	} else if ( robot.p.x < QUADRANT_X_BOUNDARY && robot.p.y > QUADRANT_Y_BOUNDARY ) {
		return 2;
	} else if ( robot.p.x < QUADRANT_X_BOUNDARY && robot.p.y < QUADRANT_Y_BOUNDARY ) {
		return 3;
	}
	return false;
}


const moveRobot = ( robot, seconds ) => {

	robot.p.x = ( robot.p.x + ( robot.v.x * seconds ) ) % ( MAP_X_SIZE );
	robot.p.y = ( robot.p.y + ( robot.v.y * seconds ) ) % ( MAP_Y_SIZE );

	robot.p.x = robot.p.x < 0 ? MAP_X_SIZE + robot.p.x : robot.p.x;
	robot.p.y = robot.p.y < 0 ? MAP_Y_SIZE + robot.p.y : robot.p.y;

	const quadrant = findQuadrant( robot );
	quadrant !== false && quadrants[ quadrant ].push( robot );

	return robot;
}

const findNumberOfRobotsAtPoint = ( robots, x, y ) => {
	return robots.reduce( ( total, robot ) => {
		return robot.p.x === x && robot.p.y === y ? total + 1 : total;
	}, 0);
}

const renderRow = ( robots, y ) => {
	let row = '';
	for ( let x = 0; x < MAP_X_SIZE; x++ ) {
		const numberOfRobots = findNumberOfRobotsAtPoint( robots, x, y );
		row += numberOfRobots ? String( numberOfRobots ) : '.';
	}
	return row;
}

const renderMap = robots => {
	let map = '';
	for ( let y = 0; y < MAP_Y_SIZE; y++ ) {
		map += renderRow( robots, y ) + '\n';
	}
	return map;
}

console.timeEnd( 'initialisation' );
console.time( 'processing' );

console.log( renderMap( robots ) );
robots.forEach( robot => moveRobot( robot, 100 ) );
console.log( renderMap( robots ) );

const total = quadrants.reduce( ( total, quadrant, index ) => {
	console.log( 'Quadrant', index, '-', quadrant.length );
	return total * quadrant.length;
}, 1 );

console.log( total );
console.timeEnd( 'processing' );
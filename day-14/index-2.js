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

let robotMap;

const resetMap = () => {
	robotMap = Array( MAP_X_SIZE ).fill(0).map( () => Array( MAP_Y_SIZE ).fill(false) );
}

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

const UNUSUAL_LIMIT = 10;

const unusuallyAlignedFrom = ( x, y ) => {
	for ( let i = 0; i < UNUSUAL_LIMIT; i++ ) {
		if ( ! robotMap[ x + i ]?.[ y ] ) {
			return false;
		}
	}
	return true;
}

const hasUnusuallyAlignedRobots = robots => {
	return robots.some( robot => unusuallyAlignedFrom( robot.p.x, robot.p.y ) );
}

const moveRobot = ( robot, seconds ) => {

	robot.p.x = ( robot.p.x + ( robot.v.x * seconds ) ) % ( MAP_X_SIZE );
	robot.p.y = ( robot.p.y + ( robot.v.y * seconds ) ) % ( MAP_Y_SIZE );

	robot.p.x = robot.p.x < 0 ? MAP_X_SIZE + robot.p.x : robot.p.x;
	robot.p.y = robot.p.y < 0 ? MAP_Y_SIZE + robot.p.y : robot.p.y;

	robotMap[ robot.p.x ][ robot.p.y ] = true;

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

let finish = false;
let seconds = 0;

const LINE_LIMIT = 36;
const MORE_THAN = 6431;

while( ! finish || seconds <= MORE_THAN ) {
	resetMap();
	seconds++;
	robots.forEach( robot => {
		moveRobot( robot, 1 )
	});

	finish = hasUnusuallyAlignedRobots( robots );
	console.log( seconds );
}

console.log( renderMap( robots ) );
console.log( seconds );

console.timeEnd( 'processing' );
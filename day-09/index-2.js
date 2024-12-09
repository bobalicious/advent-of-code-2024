const startTime = new Date().getTime();

const files = {
	test: 'test-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const rawFiles = Array.from( input );
const register = []

for ( let i = 0; i < rawFiles.length/2; i++ ) {
	const fileIndex = i * 2;
	const fileId = i;
	const fileSize = parseInt( rawFiles[ fileIndex ] );
	const freeSpaceSize = parseInt( rawFiles[ fileIndex + 1] );

	register.push( ...Array( fileSize ).fill( { id: fileId, isFree: false } ) );
	if ( freeSpaceSize ) {
		register.push( ...Array( freeSpaceSize ).fill( { id: false, isFree: true } ) );
	}
}

const getSpaceTakenBy = ( pointer, direction ) => {
	const pointedAt = register[ pointer ];
	let spaceTaken = 1;
	while ( pointer + direction >= 0 && pointer + direction < register.length-1 && register[ pointer + direction ].id === pointedAt.id ) {
		pointer += direction;
		spaceTaken++;
	}
	return spaceTaken;
}

const findFreeSpace = ( requiredSize, startingPosition ) => {

	let freeSpacePointer = 0;
	while ( freeSpacePointer < startingPosition ) {

		const entitySize = getSpaceTakenBy( freeSpacePointer, 1 );
		if ( register[ freeSpacePointer ].isFree ) {
			if ( entitySize >= requiredSize ) {
				return freeSpacePointer;
			}
		}
		freeSpacePointer += entitySize;
	}
	return false; // nowhere available
}

const moveFileIntoFreeSpace = fileDescription => {

	freeSpacePointer = findFreeSpace( fileDescription.size, fileDescription.pointer );
	if ( freeSpacePointer === false ) {
		return false;
	}

	const file = register.slice( fileDescription.pointer, fileDescription.pointer + fileDescription.size )
					.map( entity => { return { ...entity, hasBeenMoved: true } } );

	const freeSpace = register.slice( freeSpacePointer, freeSpacePointer + fileDescription.size );

	register.splice( freeSpacePointer, file.length, ...file );
	register.splice( fileDescription.pointer, freeSpace.length, ...freeSpace );
}

const checkSum = () => {
	return register.reduce( ( total, register, index ) => {
		return register.isFree ? total : total + ( register.id * index );
	}, 0 );
}

const squashSpace = () => {
	let pointer = register.length - 1;	// start outside the register, move in on iteration 1

	while ( pointer > 0 ) {
		const entitySize = getSpaceTakenBy( pointer, -1 );
		if ( register[ pointer ].isFree || register[ pointer ].hasBeenMoved ) {
			pointer -= entitySize;
			continue;
		}
		moveFileIntoFreeSpace( { pointer: ( pointer - entitySize )+1, size: entitySize } );
		pointer -= entitySize;
	}
}

const initialisedTime = new Date().getTime();

squashSpace();

const total = checkSum();

const endTime = new Date().getTime();

console.log( 'Initialisation time:', initialisedTime - startTime, 'milliseconds' );
console.log( 'Processing time:', endTime - initialisedTime, 'milliseconds' );
console.log( total );
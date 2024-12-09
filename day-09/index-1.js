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

const moveFileIntoFreeSpace = freeSpacePointer => {

	let filePointer = register.length - 1;
	let registerToMove = false;
	let movedRegister = false;

	while ( ! movedRegister ) {

		registerToMove = register.pop();
		if ( registerToMove.isFree ) {
			filePointer --;
			continue;
		}
		register[ freeSpacePointer ] = registerToMove;
		movedRegister = true;
	}
}

const checkSum = () => {
	return register.reduce( ( total, register, index ) => {
		return register.isFree ? total : total + ( register.id * index );
	}, 0 );
}


const squashSpace = () => {
	let pointer = -1;	// start outside the register, move in on iteration 1
	while ( pointer < register.length - 1 ) {
		pointer++;
		if ( ! register[ pointer ].isFree ) {
			continue;
		}
		moveFileIntoFreeSpace( pointer );
	}
}

const initialisedTime = new Date().getTime();

squashSpace();

const total = checkSum();

const endTime = new Date().getTime();

console.log( 'Initialisation time:', initialisedTime - startTime, 'milliseconds' );
console.log( 'Processing time:', endTime - initialisedTime, 'milliseconds' );
console.log( total );
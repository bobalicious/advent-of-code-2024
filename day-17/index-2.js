console.time( 'initialisation' );

/*
Work out exactly what the program does, and work it backwards.
If you continue to use brute force, exit earlier - if any output fails to match the expected, then you can stop
*/

const files = {
	tiny1: 'tiny1-input.txt',
	tiny2: 'tiny2-input.txt',
	tiny3: 'tiny3-input.txt',
	tiny4: 'tiny4-input.txt',
	tiny5: 'tiny5-input.txt',
	tiny6: 'tiny6-input.txt',
	test: 'test-input.txt',
	test2: 'test2-input.txt',
	full: 'input.txt'
}

const file = files[ process.argv[2] ] || files.full;

const fs = require('fs');
const input = fs.readFileSync( __dirname + '/' + file, 'utf8' );

const getComboOperandValue = ( registers, operand ) => {
	if ( operand >=0 && operand <= 3 ) {
		return operand;
	}

	if ( operand === 4 ) {
		return registers.a;
	}

	if ( operand === 5 ) {
		return registers.b;
	}

	if ( operand === 6 ) {
		return registers.c;
	}

	if ( operand === 7 ) {
		throw new Error( 'Invalid operand' );
	}
}

const commands = {
	0: ( output, registers, operand ) => {
		registers.a = Math.floor(registers.a / ( Math.pow( 2, getComboOperandValue( registers, operand ) ) ) );
		return false;
	},
	1: ( output, registers, operand ) => {
		registers.b = registers.b ^ operand;
		return false;
	},
	2: ( output, registers, operand ) => {
		registers.b = getComboOperandValue( registers, operand ) % 8;
		return false;
	},
	3: ( output, registers, operand ) => {
		if ( registers.a === 0 ) {
			return false;
		}
		return operand;
	},
	4: ( output, registers, operand ) => {
		registers.b = registers.b ^ registers.c;
		return false;
	},
	5: ( output, registers, operand ) => {
		output.push( getComboOperandValue( registers, operand ) % 8 );
		return false;
	},
	6: ( output, registers, operand ) => {
		registers.b = Math.floor(registers.a / ( Math.pow( 2, getComboOperandValue( registers, operand ) ) ) );
		return false;
	},
	7: ( output, registers, operand ) => {
		registers.c = Math.floor(registers.a / ( Math.pow( 2, getComboOperandValue( registers, operand ) ) ) );
		return false;
	}
}

const registers = {
	a: 0,
	b: 0,
	c: 0,
};

const program = [];
input
	.split( '\n' )
	.forEach( ( line ) => {
		if ( line.startsWith( 'Register' ) ) {
			const register = line.split( ' ' )[1].substring( 0, 1 ).toLowerCase();
			const value = parseInt( line.split( ': ' )[1] );
			registers[ register ] = value;
		}
		if ( line.startsWith( 'Program' ) ) {
			program.push( ...line.split( ': ' )[1].split( ',' ).map( command => parseInt( command )) );
		}
	})

const executeProgram = ( registers, program ) => {
	const programLength = program.length;
	const output = [];

	let pointer = 0;

	while( pointer < programLength ) {
		const command = parseInt( program[ pointer ] );
		const operand = parseInt( program[ pointer + 1 ] );
		const jump = commands[ command ]( output, registers, operand );
		if ( jump === false ) {
			pointer += 2;
		} else {
			pointer = jump;
		}
	}
	return output;
}

const assessProgram = ( registers, program ) => {
	const output = executeProgram( registers, program );
	return ( output.join( ',' ) === program.join( ',' ) );
}

console.timeEnd( 'initialisation' );
console.time( 'processing' );

console.log( registers );
console.log( program );

console.log( '---------------------' );
let newA = -1;
let foundMatch = false;
while ( foundMatch === false ) {
	newA++;
	const newRegisters = {
		a: newA,
		b: registers.b,
		c: registers.c
	}

	foundMatch = assessProgram( newRegisters, program );
}

console.log(
	executeProgram(
		{
			a: newA,
			b: registers.b,
			c: registers.c
		},
		program
	)
);

console.timeEnd( 'processing' );
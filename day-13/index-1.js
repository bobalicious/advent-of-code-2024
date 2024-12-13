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
						const prizeMatches = machine[2].match( buttonRegex );

						return {
									a: {
										x: buttonAMatches[1],
										y: buttonAMatches[2]
									},
									b: {
										x: buttonBMatches[1],
										y: buttonBMatches[2]
									},
									prize: {
										x: prizeMatches[1],
										y: prizeMatches[2]
									}
								};
	});

const findWin = ( machine, buttonACount ) => {

	const remainderX = machine.prize.x - ( machine.a.x * buttonACount );
	const remainderY = machine.prize.y - ( machine.a.y * buttonACount );

	if ( remainderX % machine.b.x !== 0 || remainderY % machine.b.y !== 0 ) {
		return false;
	}

	const buttonBCountOnX = remainderX / machine.b.x;
	const buttonBCountOnY = remainderY / machine.b.y;

	if ( buttonBCountOnX !== buttonBCountOnY ) {
		return false;
	}
	return { a: buttonACount, b: buttonBCountOnX };
}

const findCheapestWinCost = winningPresses => {
	let cheapestWinCost = Infinity;
	winningPresses.forEach( win => {
		const cost = ( win.a * 3 ) + win.b;
		if ( cost < cheapestWinCost ) {
			cheapestWinCost = cost;
		}
	});
	return cheapestWinCost === Infinity ? 0 : cheapestWinCost;
}

console.timeEnd( 'initialisation' );
console.time( 'processing' );

const total = machines.reduce( ( total, machine )=> {
	const winningPresses = [];
	let i=0;
	while( i * machine.a.x < machine.prize.x && i * machine.a.y < machine.prize.y ) {
		const winner = findWin( machine, i );
		winner && winningPresses.push( winner );
		i++;
	}

	return total + findCheapestWinCost( winningPresses );
}, 0);


console.log( total );
console.timeEnd( 'processing' );
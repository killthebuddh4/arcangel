
const EMPTY = "O";
const BOX = "@";
const FILL = "X";

const createGrid = () => {
	const g = [];
	for (let i = 0; i < 7; i++) {
		const r = [];
		for (let i = 0; i < 7; i++) {
			r.push(EMPTY);
		}
		g.push(r);
	}

	return g;
}

const insYBox = (grid) => {
	const x = Math.floor(Math.random() * 6);
	const y = Math.floor(Math.random() * 6);

	for (let i = x - 1; i < x + 3; i++) {
		for (let j = y - 1; j < y + 3; j++) {
			if (i < 0 || i > 6) continue;
			if (j < 0 || j > 6) continue;

			if (grid[i][j] === BOX) {
				return grid;
			}
		}
	}

	grid[x][y] = BOX;
	grid[x + 1][y + 1] = BOX;
	grid[x][y + 1] = BOX;
	grid[x + 1][y] = BOX;

	const xo = Math.floor(Math.random() * 2);
	const yo = Math.floor(Math.random() * 2);

	grid[x + xo][y + yo] = EMPTY;

	return grid;
}

const completeGrid = (grid) => {
	for (let i = 0; i < 7; i++) {
		for (let j = 0; j < 7; j++) {
			const a = (i === 0 || j === 0) ? null : grid[i - 1][j - 1];
			const b = i === 0 ? null : grid[i - 1][j];
			const c = (i === 0 || j === 6) ? null : grid[i - 1][j + 1];
			const d = j === 0 ? null : grid[i][j - 1];
			const e = j === 6 ? null : grid[i][j + 1];
			const f = (i === 6 || j === 0) ? null : grid[i + 1][j - 1];
			const g = (i === 6) ? null : grid[i + 1][j];
			const h = (i === 6 || j === 6) ? null : grid[i + 1][j + 1];

			const lt = [a, b, d];
			const rt = [b, c, e];
			const lb = [d, f, g];
			const rb = [e, g, h];

			if ([lt, lb, rt, rb].some(corner => corner.every(n => n === BOX))) {
				grid[i][j] = FILL;
			}
			
		}
	}

	return grid;
}


const printGrid = (grid) => {
	for (let i = 0; i < 7; i++) {
		const r = grid[i].join(" ");
		console.log(r);
	}
}

const printExample = (input, output) => {
	for (let i = 0; i < 7; i++) {
		if (i !== 3) {
			console.log(input[i].join(' ') + '                  ' + output[i].join(' '));
		} else {
			console.log(input[i].join(' ') + '  --- YIELDS -->  ' + output[i].join(' '));
		}
	}
}

const cloneGrid = (grid) => {
	return grid.reduce((acc, row) => {
		acc.push([...row]);
		return acc;
	}, []);
}

const main = () => {
	console.log("I'm going to give you 2 example input/output pairs and then a third bare input. Please produce the correct third output.\n\n");

	console.log('```');
	console.log("EXAMPLE 1\n\n");

	const ex1 = createGrid();

	for (let n = 0; n < 3; n++) {
		insYBox(ex1);
	}

	const in1 = cloneGrid(ex1);
	const co1 = completeGrid(ex1);
	
	printExample(in1, co1);

	console.log("\n\nEXAMPLE 2\n\n");

	const ex2 = createGrid();

	for (let n = 0; n <= 4; n++) {
		insYBox(ex2);
	}

	const in2 = cloneGrid(ex2);
	const co2 = completeGrid(ex2);
	
	printExample(in2, co2);

	console.log("\n\nINPUT 3\n\n");

	const ex3 = createGrid();
	const nb3 = Math.floor(Math.random() * 4)

	for (let n = 0; n <= 3; n++) {
		insYBox(ex3);
	}

	printGrid(ex3);
	console.log('```');
}

main();

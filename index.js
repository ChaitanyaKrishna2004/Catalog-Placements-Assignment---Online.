const fs = require('fs');

// Read and parse JSON file
const data = JSON.parse(fs.readFileSync('input.json', 'utf8'));

const n = data.keys.n;
const k = data.keys.k; // For quadratic, this should be 3
let points = [];

// Decode y-values
for (const key in data) {
    if (key === 'keys') continue;
    const xi = parseInt(key);
    const base = parseInt(data[key].base);
    const val = data[key].value;
    const yi = parseInt(val, base); // decode from given base
    points.push({ x: xi, y: yi });
}

// Summations
let Sx = 0, Sxx = 0, Sxxx = 0, Sxxxx = 0;
let Sy = 0, Sxy = 0, Sxxy = 0;

for (const p of points) {
    const x = p.x, y = p.y;
    Sx += x;
    Sxx += x * x;
    Sxxx += x * x * x;
    Sxxxx += x * x * x * x;
    Sy += y;
    Sxy += x * y;
    Sxxy += x * x * y;
}

// Normal equation matrix
let A = [
    [Sxx, Sx, n, Sy],
    [Sxxx, Sxx, Sx, Sxy],
    [Sxxxx, Sxxx, Sxx, Sxxy]
];

// Gaussian elimination to solve for [a, b, c]
for (let i = 0; i < 3; i++) {
    // Pivot
    let pivot = i;
    for (let r = i + 1; r < 3; r++) {
        if (Math.abs(A[r][i]) > Math.abs(A[pivot][i])) pivot = r;
    }
    [A[i], A[pivot]] = [A[pivot], A[i]];

    let div = A[i][i];
    for (let c = i; c < 4; c++) A[i][c] /= div;

    for (let r = 0; r < 3; r++) {
        if (r === i) continue;
        let factor = A[r][i];
        for (let c = i; c < 4; c++) A[r][c] -= factor * A[i][c];
    }
}

console.log(A[2][3].toFixed(0)); // c value

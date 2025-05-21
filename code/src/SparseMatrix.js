// Required modules
const fs = require('fs');             // For reading and writing files
const path = require('path');         // For handling file paths

// -----------------------------
// CLASS: SparseMatrix
// -----------------------------
class SparseMatrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.elements = {}; // Store non-zero values only, in "row,col" format
    }

    // Static method to load a SparseMatrix from a formatted file
    static fromFile(filePath) {
        const matrix = new SparseMatrix(0, 0);
        const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === '') continue; // Skip empty lines

            if (line.startsWith('rows=')) {
                matrix.rows = parseInt(line.split('=')[1]);
                continue;
            }

            if (line.startsWith('cols=')) {
                matrix.cols = parseInt(line.split('=')[1]);
                continue;
            }

            // Validate parentheses format
            if (!line.startsWith('(') || !line.endsWith(')')) {
                throw new Error("Input file has wrong format");
            }

            // Parse the values inside the parentheses
            let content = line.substring(1, line.length - 1).split(',');
            if (content.length !== 3) throw new Error("Input file has wrong format");

            let r = parseInt(content[0].trim());
            let c = parseInt(content[1].trim());
            let v = parseInt(content[2].trim());

            if (isNaN(r) || isNaN(c) || isNaN(v)) {
                throw new Error("Input file has wrong format");
            }

            matrix.setElement(r, c, v); // Set non-zero value
        }

        return matrix;
    }

    // Sets a value in the matrix
    setElement(row, col, value) {
        if (value !== 0) {
            this.elements[`${row},${col}`] = value;
        }
    }

    // Gets a value; returns 0 if not set
    getElement(row, col) {
        return this.elements[`${row},${col}`] || 0;
    }

    // Matrix addition
    add(other) {
        if (this.rows !== other.rows || this.cols !== other.cols)
            throw new Error("Matrix dimensions do not match for addition");

        const result = new SparseMatrix(this.rows, this.cols);

        // Copy current matrix
        for (let key in this.elements) {
            result.elements[key] = this.elements[key];
        }

        // Add other matrix
        for (let key in other.elements) {
            const [r, c] = key.split(',').map(Number);
            result.setElement(r, c, result.getElement(r, c) + other.elements[key]);
        }

        return result;
    }

    // Matrix subtraction
    subtract(other) {
        if (this.rows !== other.rows || this.cols !== other.cols)
            throw new Error("Matrix dimensions do not match for subtraction");

        const result = new SparseMatrix(this.rows, this.cols);

        // Copy current matrix
        for (let key in this.elements) {
            result.elements[key] = this.elements[key];
        }

        // Subtract other matrix
        for (let key in other.elements) {
            const [r, c] = key.split(',').map(Number);
            result.setElement(r, c, result.getElement(r, c) - other.elements[key]);
        }

        return result;
    }

    // Matrix multiplication
    multiply(other) {
        if (this.cols !== other.rows)
            throw new Error("Matrix dimensions do not match for multiplication");

        const result = new SparseMatrix(this.rows, other.cols);

        for (let key1 in this.elements) {
            const [r1, c1] = key1.split(',').map(Number);

            for (let key2 in other.elements) {
                const [r2, c2] = key2.split(',').map(Number);

                if (c1 === r2) {
                    const val = this.getElement(r1, c1) * other.getElement(r2, c2);
                    result.setElement(r1, c2, result.getElement(r1, c2) + val);
                }
            }
        }

        return result;
    }

    // Converts matrix to string for saving
    toString() {
        let lines = [`rows=${this.rows}`, `cols=${this.cols}`];
        for (let key in this.elements) {
            const [r, c] = key.split(',');
            const v = this.elements[key];
            lines.push(`(${r}, ${c}, ${v})`);
        }
        return lines.join('\n');
    }

    // Save to file
    saveToFile(filePath) {
        fs.writeFileSync(filePath, this.toString(), 'utf-8');
    }
}

// -----------------------------
// INTERACTIVE TERMINAL PROGRAM
// -----------------------------

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper function to ask questions
function ask(question) {
    return new Promise(resolve => readline.question(question, resolve));
}

// List input files from sample_inputs folder
function listMatrixFiles() {
    const inputDir = path.resolve(__dirname, '../../sample_inputs');
    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.txt'));
    return files.map(f => path.join(inputDir, f));
}

// Prompt user to select a file by number
async function selectFile(promptLabel, files) {
    console.log(`\nAvailable ${promptLabel} files:`);
    files.forEach((file, index) => {
        console.log(`${index + 1}) ${path.basename(file)}`);
    });

    const choice = await ask(`Select a ${promptLabel} file by number: `);
    const index = parseInt(choice) - 1;

    if (isNaN(index) || index < 0 || index >= files.length) {
        throw new Error("Invalid file selection.");
    }

    return files[index];
}

// Main execution function
(async function main() {
    try {
        const op = (await ask("Choose operation (add/subtract/multiply): ")).trim().toLowerCase();
        const files = listMatrixFiles();

        const file1 = await selectFile("first matrix", files);
        const file2 = await selectFile("second matrix", files);

        const outputDir = path.resolve(__dirname, '../../sample_results');
        const outputName = await ask("Enter output file name (e.g. result_add.txt): ");
        const outputPath = path.join(outputDir, outputName.trim());

        const matrix1 = SparseMatrix.fromFile(file1);
        const matrix2 = SparseMatrix.fromFile(file2);

        let result;
        if (op === 'add') result = matrix1.add(matrix2);
        else if (op === 'subtract') result = matrix1.subtract(matrix2);
        else if (op === 'multiply') result = matrix1.multiply(matrix2);
        else throw new Error("Invalid operation.");

        result.saveToFile(outputPath);
        console.log(`\n Operation completed. Result saved to: ${outputPath}`);

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        readline.close();
    }
})();


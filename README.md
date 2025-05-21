# 📊 Sparse Matrix Operations – DSA Assignment

This project is a **Node.js-based command-line application** that performs arithmetic operations on **sparse matrices** using custom data structures and file-based input/output.

---

## 📚 Description

A **sparse matrix** is a matrix in which most of the elements are zero. Rather than storing and processing all zero values, this program only stores the non-zero entries to improve efficiency.

This project allows you to:
- ✅ Add two sparse matrices
- ✅ Subtract one sparse matrix from another
- ✅ Multiply two sparse matrices
- ✅ Load matrix data from `.txt` files
- ✅ Save results to an output file in a specific format

---
## 🚀 Clone the Repository

To get started, clone this repository using:

```bash
git clone https://github.com/Kkadi20/dsa_sparse_matrix.git
cd dsa_sparse_matrix
```

## 📁 Project Structure

dsa_sparse_matrix/
│
├── sample_inputs/ # Folder with input matrix files
│ ├── matrix1.txt
│ └── ...
│
├── sample_results/ # Folder for storing output result files
│ └── ...
│
├── code/
│ └── src/
│ └── SparseMatrix.js # Main program file (fully interactive)
│
└── README.md # This documentation

## 🛠 Requirements

- Node.js version **14 or higher** (v18+ preferred)
- Uses only built-in `fs`, `path`, `readline`

To check your Node.js version:
```bash
node -v
```

## 💻 How to Run the Program
Step-by-Step:
Open terminal and navigate to the code folder:

```bash
cd code/src
```
Run the program:

```bash
node SparseMatrix.js
```

Follow the prompts:

Choose operation (add, subtract, or multiply)

Select two matrix files by number

Enter a name for the result output file

## Key Features:

Class SparseMatrix:

Stores only non-zero values in an object using "row,col" as keys

Provides methods: add(), subtract(), multiply(), toString()

Handles dimension validation and throws errors for mismatches

Interactive Terminal Interface:

Dynamically lists all files in sample_inputs/

Prompts user to choose matrices and operation

Automatically saves result to sample_results/

Error Handling:

Invalid format → descriptive error

Wrong dimensions → meaningful message

Invalid menu choices → safely rejected

## 🧑 Author  
Developed By Kadi Matou Koita

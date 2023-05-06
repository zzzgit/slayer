/* eslint-disable unicorn/no-process-exit */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
const {spawn} = require('child_process')
const readline = require('readline')
const fs = require('fs')

// Fork a child process
const child = spawn('node', ['child.js'], {
	stdio: ['ignore', fs.openSync('abc.js', 'a'), fs.openSync('abc.js', 'a')],
	// detached: true
})


// Create a readline interface to read from stdin
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true,
})

// Set the terminal to raw mode
rl.input.on('keypress', (_, key) => {
	if (key && key.ctrl && key.name === 'c') {
		process.exit()
	}
	child.stdin.write(key.sequence)
})

rl.output.on('resize', () => {
	child.stdout.columns = rl.output.columns
	child.stdout.rows = rl.output.rows
})

child.stdout.pipe(process.stdout)

// Handle child process exit
child.on('exit', () => {
	rl.close()
	process.exit()
})

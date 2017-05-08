const blessed = require('blessed');
const Grid = require('blessed-contrib').grid;
const Log = require('blessed-contrib').log;
const spawn = require('child_process').spawn;

const screen = blessed.screen();
const screenGrid = new Grid({ rows: 4, cols: 2, screen: screen });

const backendCompilerWindow = screenGrid.set(0, 0, 1, 1, Log, {
  fg: 'green',
  label: ' Backend Server Compiler ',
});

const linterWindow = screenGrid.set(0, 1, 2, 2, Log, {
  fg: 'blue',
  label: ' Linter ',
});

const backendServerWindow = screenGrid.set(1, 0, 3, 1, Log, {
  fg: 'green',
  label: ' Backend Server ',
});

const frontendWindow = screenGrid.set(2, 1, 2, 1, Log, {
  fg: 'cyan',
  label: ' Webpack Dev Server ',
});

screen.render();

writeToWindow(frontendWindow, 'npm', ['run', 'dev:frontend']);
writeToWindow(backendCompilerWindow, 'npm', ['run', 'dev:backend:es6compiler']);
writeToWindow(linterWindow, 'npm', ['run', 'dev:linter:ci']);
setTimeout(() => {
  writeToWindow(backendServerWindow, 'npm', ['run', 'dev:backend:server']);
}, 5000);


// private

function writeToWindow(window, cmd, cmdArgs) {
  const proc = spawn(cmd, cmdArgs);
  proc.stdout.on('data', (data) => { writeStreamDataToWindow(window, data); });
  proc.stderr.on('data', (data) => { writeStreamDataToWindow(window, data); });
}

function writeStreamDataToWindow(window, data) {
  const lines = data.toString().split('\n');

  for (let i = 0; i < lines.length; i += 1) {
    window.log(lines[i]);
  }
}

const blessed = require('blessed');
const Grid = require('blessed-contrib').grid;
const Log = require('blessed-contrib').log;
const spawn = require('child_process').spawn;

const screen = blessed.screen();
const screenGrid = new Grid({ rows: 4, cols: 2, screen: screen });

const linterWindow = screenGrid.set(0, 0, 2, 2, Log, {
  fg: 'blue',
  label: ' Linter ',
});

const backendWindow = screenGrid.set(2, 0, 2, 1, Log, {
  fg: 'green',
  label: ' Backend Server ',
});

const frontendWindow = screenGrid.set(2, 1, 2, 1, Log, {
  fg: 'cyan',
  label: ' Webpack Dev Server ',
});

screen.render();

writeToWindow(frontendWindow, 'npm', ['run', 'dev:frontend']);
writeToWindow(backendWindow, 'npm', ['run', 'dev:backend']);
writeToWindow(linterWindow, 'npm', ['run', 'dev:linter:ci']);


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

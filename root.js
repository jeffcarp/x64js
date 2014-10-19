/** @jsx React.DOM */

var React = require('react');
var x64 = require('x64js');

var sampleProgram = [
  'cool:',
  '  push 6',
  '  push 1',
  '  push 9',
  '  push 5',
  '  jmp exit',
  '_start:',
  '  mov rbx 43243',
  '  push rbx',
  '  push 5',
  '  push 9',
  '  pop rbx',
  '  jmp cool',
  'exit:',
  '  mov rax 1', // exit
  '  int 0x80'
];

var RootComponent = React.createClass({
  getInitialState: function() {
    var cpu = x64.aBlankCpu();
    cpu = x64.loadProgramIntoMemory(cpu, sampleProgram);
    return {
      cpu: cpu,
      code: sampleProgram.join('\n')
    };
  },
  stepOnce: function() {
    this.setState({
      cpu: x64.stepProgramOnce(this.state.cpu)
    });
  },
  reset: function() {
    this.setState({
      cpu: x64.loadProgramIntoMemory(x64.aBlankCpu(), sampleProgram)
    });
  },
  codeChanged: function(e) {
    var program = e.target.value.split('\n');
    console.log(program);
    var cpu = this.state.cpu;
    cpu.memory = program;
    this.setState({
      cpu: cpu
    });
  },
  render: function() {

    var cpu = this.state.cpu;

    var registers = cpu.registers;
    var registersLis = Object.keys(registers).map(function(key) {
      return <li key={key}>{key}: {registers[key]}</li>;
    });

    var memory = cpu.memory;
    var curMemKey = function(key) {
      return key == cpu.registers.rip ? 'current' : '';
    };
    var memoryLis = Object.keys(memory).map(function(key) {
      return <li key={key} className={curMemKey(key)}>{key}: {memory[key]}</li>;
    });

    var stack = cpu.stack;
    var stackLis = Object.keys(stack).map(function(key) {
      return <li key={key}>{key}: {stack[key]}</li>;
    });

    var programState = cpu.finished ? 'finished' : 'running';

    var stepOnceButton = cpu.finished ?
      <button onClick={this.reset}>Reset</button> :
      <button onClick={this.stepOnce}>Step Once</button>;

    return (
      <div>
        <h1>Current CPU State</h1>
        <div>
          {stepOnceButton}
          <span>program is {programState}</span>
        </div>
        <table>
          <tr>
            <td>
              <textarea
                onChange={this.codeChanged}
                value={this.state.code}
                ></textarea>
            </td>
            <td>
              <h3>Registers</h3>
              <ul>
                {registersLis}
              </ul>
            </td>
            <td>
              <h3>Memory</h3>
              <ul>
                {memoryLis}
              </ul>
            </td>
            <td>
              <h3>Stack</h3>
              <ul>
                {stackLis}
              </ul>
            </td>
          </tr>
        </table>
      </div>
    );
  }
});

var root = document.getElementById('react-root');
React.renderComponent(RootComponent(), root);

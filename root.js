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

var Stack = React.createClass({
  render: function() {
    var cpu = this.props.cpu;
    var stack = cpu.stack;

    var addresses = Object.keys(stack).map(function(key) {
      var value = stack[key];
      return (
        <div
          key={key}
          className='address'>
          <strong>{key}</strong>
          <span>{value}</span>
        </div>
      );
    });

    return (
      <div className="memory">
        {addresses}
      </div>
    );
  }
});

var Memory = React.createClass({
  render: function() {
    var cpu = this.props.cpu;
    var memory = cpu.memory;

    var isCurrent = function(key) {
      return key == cpu.registers.rip ? 'current' : '';
    };

    var addresses = Object.keys(memory).map(function(key) {
      var instr = memory[key];
      return (
        <div
          key={key}
          className={isCurrent(key) + ' address'}>
          <strong>{key}</strong>
          <span>{instr}</span>
        </div>
      );
    });

    return (
      <div className="memory">
        {addresses}
      </div>
    );
  }
});

var Computer = React.createClass({
  render: function() {
    var cpu = this.props.cpu;

    var registers = Object.keys(cpu.registers).map(function(key) {
      var value = cpu.registers[key];
      return (
        <td
          className="register"
          key={key}>
          <h5>{key}</h5>
          <div>{value}</div>
        </td>
      );
    });

    return (
      <div className="computer">
        <table>
          <tr>
            {registers.slice(0, 4)}
          </tr>
          <tr>
            {registers.slice(4, 8)}
          </tr>
          <tr>
            {registers.slice(8, 12)}
          </tr>
        </table>
        <table>
          <tr>
            <td style={{width: '50%'}}>
              <Memory cpu={this.props.cpu} />
            </td>
            <td style={{width: '50%'}}>
              <Stack cpu={this.props.cpu} />
            </td>
          </tr>
        </table>
      </div>
    );
  }
});

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

    var programState = cpu.finished ? 'finished' : 'running';

    var stepOnceButton = cpu.finished ?
      <button onClick={this.reset}>Reset</button> :
      <button onClick={this.stepOnce}>Step Once</button>;

    return (
      <div>
        <h1>Current CPU State</h1>

        <div className="controls">
          {stepOnceButton}
          <span>program is {programState}</span>
        </div>

        <h3>Look a Computer</h3>
        <Computer cpu={this.state.cpu} />

      </div>
    );
  }
});

var root = document.getElementById('react-root');
React.renderComponent(RootComponent(), root);

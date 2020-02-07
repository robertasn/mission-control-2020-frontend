import React, { useState, useEffect } from 'react';
import "./Terminal.css";
import { animateScroll } from 'react-scroll';

const io = require('socket.io-client');
const socket_port = 8080;
const socket = io.connect(`http://localhost:${socket_port}`);

export default function Terminal(props) {
    //initialises state object for terminal output
    const [terminalOutput, setTerminalOutput] = useState('');
    const flags = props.flags;
    const debug_level = props.debug_level;
    
    //updates terminal output in the pre
    useEffect(() => {
        socket.on('console_output', data => {
            setTerminalOutput(terminalOutput + data);
        });
        socket.on('console_error', err => {
            console.error(`CONSOLE_ERROR: ${err}`);
        });
        scrollToBottom();
        return function cleanup() {
            // TODO: we can cleanup the terminal here when the terminal is inactive 
            //  or when too much is in the pre
            if (props.isInactive) console.log("terminal off");
        };
    }, [terminalOutput]); //useEffect only called when terminal output changes

    const scrollToBottom = () => {
        animateScroll.scrollToBottom({
          containerId: 'terminal_pre',
          duration: 0
        });
    }

    //TODO: implement so that react doesn't still render the terminal
    if (props.isInactive) {
        return(null);
    }

    return(
        <div className="terminal-root">
            <pre id='terminal_pre'>{terminalOutput}</pre>
            <button
                onClick= {() => {socket.emit('bbb_start', {
                    flags,
                    debug_level
                })}}>
                start bbb
            </button>
            <button
                onClick= {() => {socket.emit('bbb_stop')}}>
                stop bbb
            </button>
        </div>
    );
}

Terminal.defaultProps = {
    content: 'The content prop of this component has not been set',
    flags: [],
    debug_level: '0'
  };

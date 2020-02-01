import React from 'react';
import logo from './logo.svg';
import './App.css';
import Stomp from 'stompjs';
import { faRuler } from "@fortawesome/free-solid-svg-icons";
import Button from "./components/Button.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedToPod: false,
    };
  }
  
  componentDidMount() {
    // ask backend to start base-station server instance
    // afterwards establish websocket connection to backend
    fetch('http://localhost:8080/server', {method: 'POST'})
        .then((response) => response.text(), error => Promise.reject('Error: could not communicate with backend (fetch() returned error)'))
        .then((text) => console.log('CONNECTED TO BACKEND'))
        .then(() => {
            const stompClient = Stomp.client('ws://localhost:8080/connecthere');

            this.setState({
                stompClient: stompClient,
            });

            stompClient.connect({}, (frame) => {
                stompClient.subscribe('/topic/podData', (message) => this.podDataHandler(message));
                stompClient.subscribe('/topic/isPodConnected', (message) => this.podConnectionStatusHandler(message));
                stompClient.subscribe('/topic/errors', (message) => console.error(`ERROR FROM BACKEND: ${message}`));
                stompClient.send("/app/pullData");
            }, (error) => this.disconnectHandler(error));
        })
        .catch(error => console.error(error));
  }

  podConnectionStatusHandler(message) {
    const receivedPodConnectionStatus = message.body;

    this.setState({
        connectedToPod: receivedPodConnectionStatus === 'CONNECTED' ? true : false,
    });
    console.log(receivedPodConnectionStatus);
  }

  podDataHandler(message) {
    const receivedPodData = JSON.parse(message.body);

    this.setState({
        podData: receivedPodData,
    });
  }

  disconnectHandler(error) {
    if (error.startsWith('Whoops! Lost connection')) {
        console.error('DISCONNECTED FROM BACKEND');

        this.setState({
            connectedToPod: false,
        });
    }
    else {
        console.error(error);
    }
  }
  
  render() {
    const connectedToPod = this.state.connectedToPod;
    const connectedToBackend = this.state.stompClient;

    return (
      
      <div className="background">
        <div className="gui-wrapper">
          
          <header className="header">
            <h2>logo here</h2>
            <img src="" className="App-logo" alt="logo" />
            <p style={{alignSelf:"center"}}>position here</p>
            <p>
              {connectedToBackend ? 'connected' : 'disconnected'} 
            </p>
          </header>
          <Button
            caption="CALIBRATE"
            icon={faRuler}
            onClick={() => {
              return;
            }}
            width="25%"
            slantedLeft
            // slantedRight
            textColor="#FFFFFF"
            backgroundColor="#1098AD"
          ></Button>
        </div>
      </div>      
  );
  }
}

export default App;

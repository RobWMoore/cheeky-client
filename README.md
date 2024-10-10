#Cheeky Web Socket CLIENT

Dockerfile: Builds a container that serves a webpage with JSSIP.
JSSIP Integration: The HTML page embeds JSSIP and connects to OpenSIPS via WebSocket.
Docker Compose (optional): For easier service management.
This setup allows you to quickly spin up a web page with JSSIP embedded, and test WebSocket SIP calls to a remote OpenSIPS server.

## Getting Started

1) Build and Run the Docker Container

Build the Docker image:

`docker build -t cheeky-sip-client .`


2) Run the container:

`docker run -d -p 8080:80 --name cheeky-sip-client cheeky-sip-client`


Or, if using Docker Compose:

`docker-compose up --build`


3) Access the Web Page
After the container is running, open your browser and go to:

`http://localhost:8080`

You'll see the web page with the JSSIP interface. Enter the destination SIP URI (e.g., sip:user@domain) and click "Start Call". The WebSocket connection will be established with the remote OpenSIPS server, and you'll be able to test calling functionality over WebSocket.

4) To tear down and rebuild:

`docker stop cheeky-sip-client; docker rm cheeky-sip-client`

## How It Works:

Input SIP Registration Details:

WebSocket URL: The WebSocket URL of your OpenSIPS server, e.g., ws://sip.domain.com:5066.
SIP Username: The SIP URI, e.g., sip:user@domain.com.
SIP Password: Your SIP password.
SIP Domain: Your SIP domain, e.g., domain.com.

1) The user clicks "Start Call".
2) JSSIP first attempts to register with the OpenSIPS server using the provided SIP credentials.
3) Once registration is successful, the user agent (UA) is ready to make a call.
4) The user can input a SIP URI and initiate a call, while JSSIP handles SIP signaling over WebSocket.
5) Status updates such as "Calling", "Call Confirmed", and "Call Ended" are shown based on the progress of the call.
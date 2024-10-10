let ua; // Global variable to hold the User Agent

// Function to register SIP
function registerSIP() {
    // Get SIP registration details from the form inputs
    var wsUrl = document.getElementById('ws-url').value;
    var sipUsername = document.getElementById('sip-username').value;
    var sipPassword = document.getElementById('sip-password').value;
    var sipDomain = document.getElementById('sip-domain').value;

    console.log("Attempting to register SIP with the following details:");
    console.log("WebSocket URL:", wsUrl);
    console.log("SIP Username:", sipUsername);
    console.log("SIP Password:", sipPassword);
    console.log("SIP Domain:", sipDomain);

    if (!wsUrl || !sipUsername || !sipPassword || !sipDomain) {
        alert('Please fill out all registration fields.');
        return;
    }

    try {
        // WebSocket and SIP Configuration
        var socket = new JsSIP.WebSocketInterface(wsUrl); // e.g., ws://sip.domain.com:5066
        var configuration = {
            sockets  : [socket],
            uri      : sipUsername, // e.g., sip:user@domain
            password : sipPassword, // Password for the SIP user
            registrar_server: 'sip:' + sipDomain, // Registrar server (e.g., sip:domain.com)
            session_timers: false, // Disable session timers if unsupported
        };

        // Initialize JsSIP User Agent
        ua = new JsSIP.UA(configuration);
        console.log("JsSIP UA created:", ua);

        // Start the User Agent (this triggers SIP registration)
        ua.start();
        console.log("JsSIP UA started");

        // Event Listener: On Connection Success
        ua.on('connected', function(e) {
            document.getElementById("status").textContent = "Status: Connected";
            console.log("SIP Connection Successful:", e);
        });

        // Event Listener: On Registration Success
        ua.on('registered', function(e) {
            document.getElementById("status").textContent = "Status: Registered";
            console.log("SIP Registration Successful");
        });

        // Event Listener: On Registration Failure
        ua.on('registrationFailed', function(e) {
            document.getElementById("status").textContent = "Status: Registration Failed";
            console.error('SIP registration failed:', e);
        });

        // Event Listener: On Disconnection
        ua.on('disconnected', function(e) {
            document.getElementById("status").textContent = "Status: Disconnected";
            console.log("SIP Disconnected:", e);
        });

        // Event Listener: On Unregistration
        ua.on('unregistered', function(e) {
            document.getElementById("status").textContent = "Status: Unregistered";
            console.log("SIP Unregistered:", e);
        });
    } catch (error) {
        console.error("Error during SIP registration:", error);
        document.getElementById("status").textContent = "Status: Error during registration";
    }
}

// Function to initiate a call after SIP registration
function startCall() {
    if (!ua || !ua.isRegistered()) {
        alert('Please register SIP first.');
        return;
    }

    // Get the destination SIP URI from the input
    var destination = document.getElementById('destination').value;
    if (!destination) {
        alert('Please enter a valid SIP URI to call.');
        return;
    }

    // Initiate the call
    var session = ua.call(destination, {
        mediaConstraints: { audio: true, video: false } // Enable audio-only calls
    });

    // Handle SIP Call Events
    session.on('progress', function(e) {
        document.getElementById("status").textContent = "Status: Calling...";
        console.log('Call is in progress...');
    });

    session.on('confirmed', function(e) {
        document.getElementById("status").textContent = "Status: Call Confirmed";
        console.log('Call confirmed.');
    });

    session.on('ended', function(e) {
        document.getElementById("status").textContent = "Status: Call Ended";
        console.log('Call ended.');
    });

    session.on('failed', function(e) {
        document.getElementById("status").textContent = "Status: Call Failed";
        console.error('Call failed:', e);
    });
}

// Function to hang up the SIP call
function hangupCall() {
    if (currentSession) {
        currentSession.terminate();  // Terminate the active call
        document.getElementById("status").textContent = "Status: Call Ended";
        currentSession = null;
    } else {
        alert('No active call to hang up.');
    }
}
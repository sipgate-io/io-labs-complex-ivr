# io-labs-complex-ivr

In this example project, we will create an IVR system.
An IVR system is a technology that allows you, as a caller, to interact with a computer-operated phone system through your phone's keypad input.

## What is sipgate.io?

sipgate.io is a collection of APIs, which enables sipgate's customers to build flexible integrations matching their individual needs. Among other things, it provides interfaces for sending and receiving text messages or faxes, monitoring the call history, as well as initiating and manipulating calls. In this tutorial, we will use sipgate.io's Push API to accept a call and start an IVR process. The caller is then able to transfer information using DTMF sounds. DTMF sounds are the sounds you hear whenever you type on your phone's keypad.

## In this example

The script in this project sets up a simple web server running on your local machine. If someone tries to reach your sipgate number, this webserver will answer the call and play the IVR process.
Our IVR system consists of three phases:

1. Welcome phase: An audio file welcomes the caller and asks for his customer number.
2. Request phase: Once the caller entered the number using his keypad, the system asks whether he wants to know his credit (keypad number 1) or wants to speak to the customer service (keypad number 3).
3. End phase: Depending on the caller's decision, the system once again plays an audio file.

**Prerequisite:** You need npm and Node.js installed on your machine.

## Getting started

To launch this example, navigate to a directory where you want the example service to be stored. In a terminal, you can clone this repository from GitHub and install the required dependencies using `npm install`.

```
git clone https://github.com/sipgate-io/io-labs-complex-ivr
cd io-labs-complex-ivr
npm install
```

## Execution

To run the project on your local machine, follow these steps:

1. Run `ssh -R 80:localhost:8080 nokey@localhost.run` in the terminal of your root package
2. There will be some output. Copy the last URL.
3. Duplicate `.env.example` and rename the file to `.env`
4. Paste the URL from step 2 in `SIPGATE_WEBHOOK_SERVER_ADDRESS`. Your `.env` should look similar to this:

```
SIPGATE_WEBHOOK_SERVER_ADDRESS=https://d4a3f97e7ccbf2.localhost.run
SIPGATE_WEBHOOK_SERVER_PORT=8080
```

5. Go to your [sipgate app-web account](https://console.sipgate.com/webhooks/urls) and set both the incoming and outgoing webhook URLs as the URL from step 2.
6. Run `npm start` in the terminal of the project's root package to start the server.

Now you can call your sipgate account number to start the IVR process.
If the call is built successfully, your terminal will log some information.

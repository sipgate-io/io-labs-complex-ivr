# io-labs-complex-ivr

> :warning: **Dear Devs, to get started you need to do some things:** <br>
>
> 1. do `ssh -R 80:localhost:8080 nokey@localhost.run` in the root package
> 2. Copy the last URL and paste it in the .env in `SIPGATE_WEBHOOK_SERVER_ADDRESS`
> 3. Go to sipgate [app-web](https://console.sipgate.com/webhooks/urls) and set the webhooks as the above URL. (Log in with Peterle Drobusch)
> 4. Since the github-repo is private the links in the `src/index.ts` dont work. You need to copy the files to somewhere else (i.e. catbox.moe) and exchange the links with working ones
> 5. Now you can call Peterle Drobusch and receive a nice IVR treatment

In this example project, we will create an ivr system to automatically filter your calls and get some general information from the user.

## What is sipgate.io?

sipgate.io is a collection of APIs, which enables sipgate's customers to build flexible integrations matching their individual needs. Among other things, it provides interfaces for sending and receiving text messages or faxes, monitoring the call history, as well as initiating and manipulating calls. In this tutorial, we will use sipgate.io's Push API to accept a call and ask the user for some informations. He then is able to transfer information using dtmf sounds.

## In this example

The script in this project sets up a simple web server running on your machine locally. If your sipgate account is called this webserver will answer the call and play some predefined sound files. The user is then able to interact with the system using the keypad on his phone. Depending on his reaction the web server answers with different sound files.

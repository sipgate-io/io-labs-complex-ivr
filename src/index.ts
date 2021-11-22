import * as dotenv from "dotenv";
import { createWebhookModule, WebhookResponse } from "sipgateio";

dotenv.config();

const MAX_WELCOME_DTMF_INPUT_LENGTH = 8;
const MAX_REQUEST_DTMF_INPUT_LENGTH = 1;
enum CallStage {
  WELCOMESTAGE,
  REQUESTSTAGE,
  ENDSTAGE,
}

if (!process.env.SIPGATE_WEBHOOK_SERVER_ADDRESS) {
  console.error(
    "ERROR: You need to set a server address to receive webhook events!\n",
  );
  process.exit();
}

if (!process.env.SIPGATE_WEBHOOK_SERVER_PORT) {
  console.error(
    "ERROR: You need to set a server port to receive webhook events!\n",
  );
  process.exit();
}

const SERVER_ADDRESS = process.env.SIPGATE_WEBHOOK_SERVER_ADDRESS;
const PORT = process.env.SIPGATE_WEBHOOK_SERVER_PORT;

createWebhookModule()
  .createServer({
    port: PORT,
    serverAddress: SERVER_ADDRESS,
  })
  .then((webhookServer) => {
    let stage = CallStage.REQUESTSTAGE;
    webhookServer.onNewCall((newCallEvent) => {
      console.log(`New call from ${newCallEvent.from} to ${newCallEvent.to}`);
      stage = CallStage.WELCOMESTAGE;
      return WebhookResponse.gatherDTMF({
        maxDigits: MAX_WELCOME_DTMF_INPUT_LENGTH,
        timeout: 5000,
        announcement:
          "https://github.com/sipgate-io/io-labs-complex-ivr/blob/main/static/welcome.wav?raw=true",
      });
    });

    webhookServer.onData((dataEvent) => {
      const selection = dataEvent.dtmf;

      if (
        stage === CallStage.WELCOMESTAGE
        && selection.length === MAX_WELCOME_DTMF_INPUT_LENGTH
      ) {
        console.log(`The caller provided a valid id: ${selection} `);
        stage = CallStage.REQUESTSTAGE;
        return WebhookResponse.gatherDTMF({
          maxDigits: MAX_REQUEST_DTMF_INPUT_LENGTH,
          timeout: 5000,
          announcement:
            "https://github.com/sipgate-io/io-labs-complex-ivr/blob/main/static/request.wav?raw=true",
        });
      }

      if (
        stage === CallStage.REQUESTSTAGE
        && selection.length === MAX_REQUEST_DTMF_INPUT_LENGTH
      ) {
        stage = CallStage.ENDSTAGE;
        switch (selection) {
          case "1":
            console.log("Ausgabe 1");
            return WebhookResponse.gatherDTMF({
              maxDigits: 1,
              timeout: 0,
              announcement:
                "https://github.com/sipgate-io/io-labs-complex-ivr/blob/main/static/credit.wav?raw=true",
            });
          case "3":
            console.log("Ausgabe 2");
            return WebhookResponse.gatherDTMF({
              maxDigits: 1,
              timeout: 0,
              announcement:
                "https://github.com/sipgate-io/io-labs-complex-ivr/blob/main/static/customerservice.wav?raw=true",
            });
          default:
            return WebhookResponse.hangUpCall();
        }
      }
      return WebhookResponse.hangUpCall();
    });
  });

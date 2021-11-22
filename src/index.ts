import * as dotenv from "dotenv";
import { createWebhookModule, WebhookResponse } from "sipgateio";

dotenv.config();

const port = 8080;
const maxWelcomeDTMFInputLength = 8;
const maxRequestDTMFInputLength = 1;
enum CallStage {
  WELCOMESTAGE,
  REQUESTSTAGE,
  ENDSTAGE,
}
let stage = CallStage.REQUESTSTAGE;

if (!process.env.SIPGATE_WEBHOOK_SERVER_ADDRESS) {
  console.error(
    "ERROR: You need to set a server address for the followup webhook events!\n",
  );
  process.exit();
}

const serverAddress = process.env.SIPGATE_WEBHOOK_SERVER_ADDRESS;

createWebhookModule()
  .createServer({
    port,
    serverAddress,
  })
  .then((webhookServer) => {
    webhookServer.onNewCall((newCallEvent) => {
      console.log(`New call from ${newCallEvent.from} to ${newCallEvent.to}`);
      stage = CallStage.WELCOMESTAGE;
      return WebhookResponse.gatherDTMF({
        maxDigits: maxWelcomeDTMFInputLength,
        timeout: 5000,
        announcement:
          "https://github.com/sipgate-io/io-labs-complex-ivr/blob/main/static/welcome.wav?raw=true",
      });
    });

    webhookServer.onData((dataEvent) => {
      const selection = dataEvent.dtmf;

      if (
        stage === CallStage.WELCOMESTAGE
        && selection.length === maxWelcomeDTMFInputLength
      ) {
        console.log(`The caller provided a valid id: ${selection} `);
        stage = CallStage.REQUESTSTAGE;
        return WebhookResponse.gatherDTMF({
          maxDigits: maxRequestDTMFInputLength,
          timeout: 5000,
          announcement:
            "https://github.com/sipgate-io/sipgateio-node-examples/blob/main/static/example.wav?raw=true",
        });
      }

      if (
        stage === CallStage.REQUESTSTAGE
        && selection.length === maxRequestDTMFInputLength
      ) {
        stage = CallStage.ENDSTAGE;
        switch (selection) {
          case "1":
            console.log("Ausgabe 1");
            return WebhookResponse.gatherDTMF({
              maxDigits: 1,
              timeout: 0,
              announcement:
                "https://github.com/sipgate-io/sipgateio-node-examples/blob/main/static/testfile.wav?raw=true",
            });
          case "2":
            console.log("Ausgabe 2");
            return WebhookResponse.gatherDTMF({
              maxDigits: 1,
              timeout: 0,
              announcement:
                "https://github.com/sipgate-io/sipgateio-node-examples/blob/main/static/testfile.wav?raw=true",
            });
          default:
            return WebhookResponse.hangUpCall();
        }
      }
      return WebhookResponse.hangUpCall();
    });
  });

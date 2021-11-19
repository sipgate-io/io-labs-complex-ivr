import * as dotenv from "dotenv";
import { createWebhookModule, WebhookResponse } from "sipgateio";

dotenv.config();

const port = 8080;
const maxWelcomeDTMFInputLength = 8;
const maxRequestDTMFInputLength = 1;
enum CallStage {
  WELCOMESTAGE,
  REQUESTSTAGE,
}
let stage = CallStage.WELCOMESTAGE;

if (!process.env.SIPGATE_WEBHOOK_SERVER_ADDRESS) {
  console.error(
    "ERROR: You need to set a server address for the followup webhook events!\n",
  );
  process.exit();
}

const serverAddress = process.env.SIPGATE_WEBHOOK_SERVER_ADDRESS;

console.log("Das ist die Serveradresse");
console.log(serverAddress);

createWebhookModule()
  .createServer({
    port,
    serverAddress,
  })
  .then((webhookServer) => {
    console.log("Das ist der Webhookserver");
    console.log(webhookServer);
    webhookServer.onNewCall((newCallEvent) => {
      console.log(`New call from ${newCallEvent.from} to ${newCallEvent.to}`);
      return WebhookResponse.gatherDTMF({
        maxDigits: maxWelcomeDTMFInputLength,
        timeout: 5000,
        announcement:
          "https://github.com/sipgate-io/sipgateio-node-examples/blob/main/static/example.wav?raw=true",
      });
    });

    webhookServer.onData((dataEvent) => {
      const selection = dataEvent.dtmf;
      console.log("Provided dtmf: ");
      console.log(selection);
      console.log("Stage: ");
      console.log(stage);

      if (
        stage === CallStage.WELCOMESTAGE
        && selection.length === maxWelcomeDTMFInputLength
      ) {
        console.log(`The caller provided a valid id ${selection} `);
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
        if (selection === "1") {
          console.log("Ausgabe 1");
        } else if (selection === "2") {
          console.log("Ausgabe 2");
        } else {
          console.log("Falsche Nummer angegeben");
        }
      }
      stage = CallStage.WELCOMESTAGE;
      return WebhookResponse.hangUpCall();
    });
  });

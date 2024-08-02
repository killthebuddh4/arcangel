import { readSessionIds } from "./lib/readSessionIds.js";
import { readExperiment } from "./lib/readExperiment.js";
import { Chalk } from "chalk";

const chalk = new Chalk();

const main = async () => {
  const sessionIds = await readSessionIds();

  console.log("NUMBER OF SESSIONS:", sessionIds.length);

  for (const sessionId of sessionIds) {
    const experiment = await readExperiment({ sessionId });

    const lastMessage =
      experiment.session.messages[experiment.session.messages.length - 1];

    const progress = experiment.history[experiment.history.length - 1].progress;

    console.log(`Session ID: ${sessionId}`);
    console.log(`Progress: ${progress}%`);
    console.log("Last message:");

    if (progress !== 100) {
      console.log(chalk.red(JSON.stringify(lastMessage.content, null, 2)));
    } else {
      console.log(chalk.green(JSON.stringify(lastMessage.content, null, 2)));
    }

    console.log("\n");
  }
};

main();

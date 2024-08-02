import { getResultSummary } from "./lib/getResultSummary.js";
import { readSessions } from "./lib/readExperiments.js";
import { Chalk } from "chalk";

const chalk = new Chalk();

const EXPERIMENT_ID = "2024-08-02-03";

const main = async () => {
  const sessions = await readSessions({ experimentId: EXPERIMENT_ID });

  for (const session of sessions) {
    const lastMessage =
      session.session.messages[session.session.messages.length - 1];

    let progress: number;
    if (session.history.length === 0) {
      progress = 0;
    } else {
      progress = session.history[session.history.length - 1].progress;
    }

    const display = `Session ID: ${session.session.id}\nProgress: ${progress}\nLast Message: ${JSON.stringify(lastMessage.content, null, 2)}\n`;

    if (progress === 100) {
      console.log(chalk.green(display));
    } else {
      console.log(chalk.red(display));
    }
  }

  try {
    const summary = await getResultSummary({ experimentId: EXPERIMENT_ID });

    console.log("Summary:");
    console.log(JSON.stringify(summary, null, 2));
  } catch (e) {
    console.error(e);
  }
};

main();

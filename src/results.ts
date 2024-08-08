import { getResultSummary } from "./lib/getResultSummary.js";
import { readSessions } from "./lib/readSessions.js";
import { Chalk } from "chalk";
import { getDiff } from "./lib/getDiff.js";

const chalk = new Chalk();

const main = async () => {
  const sessions = await readSessions();

  for (const session of sessions) {
    const display = `Session ID: ${session.id}\nLast Message: ${JSON.stringify(session.history[session.history.length - 1], null, 2)}\n`;

    if (session.exit === null) {
      const diff = getDiff({
        lhs: session.environment.input,
        rhs: session.memory.grid,
      });

      if (diff.diff.length === 0) {
        console.log(chalk.green(display));
      } else {
        console.log(chalk.yellow(display));
      }
    } else {
      if (!session.exit.ok) {
        console.log(chalk.red(display));
        console.log(chalk.red(JSON.stringify(session.exit.exception, null, 2)));
      }
    }
  }

  try {
    const summary = await getResultSummary();
    console.log("Summary:");
    console.log(JSON.stringify(summary, null, 2));
  } catch (e) {
    console.error(e);
  }
};

main();

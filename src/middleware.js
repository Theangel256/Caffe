import { register as registerExpress } from "./middleware/express.js";
import { onError as handleError } from "./middleware/error.js";
import { onRequest as sessionHandler } from "./middleware/session.js";
import client from "./server.js"; // your Discord bot instance

let expressReady = false;

export async function onRequest(context, next) {
  try {
    if (!expressReady) {
      await registerExpress(context.locals, client);
      expressReady = true;
    }

    await sessionHandler(context, () => {});

    return next();
  } catch (error) {
    return handleError({ error, request: context.request });
  }
}

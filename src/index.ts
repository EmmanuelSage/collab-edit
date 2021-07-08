import "module-alias/register";
import "reflect-metadata";

import http from "http";
import env from "./common/config/env";
import { Log } from "./common/services";
import { App } from "./server/app";

const start = async () => {
  try {
    const app = new App();
    const appServer = app.getServer().build();
    // app.printRoutes();

    await app.connectDB();
    Log.info("📦  MongoDB Connected!");

    // start server
    const httpServer = http.createServer(appServer);

    // ----- BEgin
    // const io = new Server(httpServer);

    // const connectionHandler = (socket: Socket) => {
    //   // whenever we receive a 'message' we log it out
    //   socket.on("new-operations", function (message: any) {
    //     console.log(JSON.stringify(message, null,2));
    //     // io.emit(`new-remote-operations`, message);
    //   });
    // };

    // io.on("connection", connectionHandler);
    // ----- End

    httpServer.listen(env.port);
    httpServer.on("listening", () => Log.info(`🚀  ${env.service_name} listening on ` + env.port));
  } catch (err) {
    Log.error(err, "Fatal server error");
  }
};

start();

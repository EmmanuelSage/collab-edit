import env from "@app/common/config/env";
import container from "@app/common/config/ioc";
import { Log } from "@app/common/services";
import { defaultMongoOpts, secureMongoOpts } from "@random-guys/bucket";
import { build } from "@random-guys/siber";
import { Application } from "express";
import { getRouteInfo, InversifyExpressServer } from "inversify-express-utils";
import mongoose, { Connection } from "mongoose";
import { errors, information } from "../utils";

export class App {
  db: Connection;
  private server: InversifyExpressServer;
  constructor() {
    this.server = new InversifyExpressServer(container, null, {
      rootPath: env.api_version
    });

    // setup server-level middlewares
    this.server.setConfig((app: Application) => {
      app.disable("x-powered-by");
      build(app, Log, { corsDomains: [env.client_domain, "https://app.ava.me", "http://localhost:3000"] });
    });

    /**
     * Register handlers after all middlewares and controller routes have been mounted
     */
    this.server.setErrorConfig((app: Application) => {
      // expose ping endpoint
      app.get("/ping", (_req, res) => {
        res.status(200).json({
          ok: true,
          msg: "pong"
        });
      });
      app.get("/info", (_req, res) => {
        res.status(200).json(information);
      });

      // expose index endpoint
      app.get("/", (_req, res) => {
        if (mongoose.connections.every(conn => conn.readyState !== 1)) {
          return res.status(500).send("MongoDB is not ready");
        }

        res.status(200).send("Up and running");
      });

      // register 404 route handler
      app.use((_req, res, _next) => {
        res.status(404).send("Whoops! Route doesn't exist.");
      });

      app.use(errors);
    });
  }

  printRoutes() {
    const routeInfo = getRouteInfo(container);
    console.log(JSON.stringify(routeInfo));
  }

  getServer = () => this.server;

  async connectDB() {
    await mongoose.connect(env.mongodb_url, {
      ...(env.is_production ? secureMongoOpts(env) : defaultMongoOpts)
    });
    this.db = mongoose.connection;
  }

  /**
   * Closes MongoDB connection.
   */
  async closeDB() {
    await mongoose.disconnect();
  }
}

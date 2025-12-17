import { IServer } from "./domain/interfaces/IServer";
import { connectDB } from "./infrastructure/database/mongodb/connection";
import { errorHandler } from "./presentation/middlewares/middlewares";
import { CommonRouter } from "./presentation/routes/routes";

export class App {
  constructor(private _server: IServer) {}

  async initialize(): Promise<void> {
    await this._connectDB();
    this._registerRoutes();
    this._registerErrorHandler();
  }

  private _registerRoutes(): void {
    const commonRoutes = new CommonRouter().getRouter();

    this._server.registerRoutes("/api", commonRoutes);
  }

  private _registerErrorHandler(): void {
    this._server.registerErrorHandler(errorHandler);
  }

   private async _connectDB() {
    try {
      await connectDB();
    } catch (error) {
      console.log("Server could not be started", error);
      process.exit(1);
    }
  }

  async start(port: number): Promise<void> {
    await this._server.start(port);
  }

  async shutdown(): Promise<void> {
    console.log("Shut dow server");
  }
}

import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { SignUpController } from "../controllers/signUp.controller";
import { SignInController } from "../controllers/signIn.controller";
import { TripController } from "../controllers/trip.controller";
import { authenticate } from "../middlewares/middlewares";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv") || file.mimetype === "application/vnd.ms-excel") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed. Please upload a .csv file."));
    }
  },
});

export class CommonRouter {
  private _router: Router;
  private _diContainer: DIContainer;

  // Controllers
  private _signUpController!: SignUpController;
  private _signInController!: SignInController;
  private _tripController!: TripController;

  constructor() {
    this._router = Router();
    this._diContainer = new DIContainer();
    this._initializeControllers();
    this._initializeRoutes();
  }

  private _initializeControllers(): void {
    this._signUpController = new SignUpController(
      this._diContainer.signUpUseCase(),
      this._diContainer.setTokensUseCase()
    );
    this._signInController = new SignInController(
      this._diContainer.signInUseCase(),
      this._diContainer.setTokensUseCase()
    );
    this._tripController = new TripController(
      this._diContainer.uploadTripUseCase(),
      this._diContainer.getTripsUseCase(),
      this._diContainer.getTripByIdUseCase(),
      this._diContainer.getTripPointsUseCase(),
      this._diContainer.deleteTripUseCase()
    );
  }

  private _initializeRoutes(): void {
    // Auth routes (public)
    this._router.post("/login", this._signInController.signIn);
    this._router.post("/signup", this._signUpController.signUp);

    // Trip routes (protected - require authentication)
    this._router.post(
      "/trips/upload",
      authenticate,
      upload.single("file"),
      (req, res, next) => {
        // Handle multer errors
        if (req.file === undefined && !req.headers["content-type"]?.includes("multipart/form-data")) {
          return next(new Error("No file uploaded. Please select a CSV file."));
        }
        next();
      },
      this._tripController.uploadTrip
    );
    this._router.get("/trips", authenticate, this._tripController.getTrips);
    this._router.get("/trips/:tripId", authenticate, this._tripController.getTripById);
    this._router.get("/trips/:tripId/points", authenticate, this._tripController.getTripPoints);
    this._router.delete("/trips/:tripId", authenticate, this._tripController.deleteTrip);
  }

  public getRouter(): Router {
    return this._router;
  }
}

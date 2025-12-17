import { ISetTokensUseCase } from "../../application/interface/ISetTokensUseCase";
import { ISignInUseCase } from "../../application/interface/ISignInUseCase";
import { ISignUpUseCase } from "../../application/interface/ISignUpUseCase";
import { IUploadTripUseCase } from "../../application/interface/IUploadTripUseCase";
import { IGetTripsUseCase } from "../../application/interface/IGetTripsUseCase";
import { IGetTripPointsUseCase } from "../../application/interface/IGetTripPointsUseCase";
import { SetTokensUseCase } from "../../application/usecase/setTokens.useCase";
import { SignInUseCase } from "../../application/usecase/signIn.useCase";
import { SignUpUseCase } from "../../application/usecase/signUp.useCase";
import { UploadTripUseCase } from "../../application/usecase/uploadTrip.useCase";
import { GetTripsUseCase } from "../../application/usecase/getTrips.useCase";
import { GetTripPointsUseCase } from "../../application/usecase/getTripPoints.useCase";
import { JwtService } from "../external-services/JwtService";
import { UserRepository } from "../repositories/userRepository";
import { TripRepository } from "../repositories/tripRepository";
import { GpsPointRepository } from "../repositories/gpsPointRepository";
import { CsvParserService } from "../../application/services/csvParser.service";
import { TripCalculationService } from "../../application/services/tripCalculation.service";

export class DIContainer {
  private _userRepository: UserRepository;
  private _tripRepository: TripRepository;
  private _gpsPointRepository: GpsPointRepository;
  private __jwtService: JwtService;
  private _csvParser: CsvParserService;
  private _tripCalculator: TripCalculationService;

  constructor() {
    this._userRepository = new UserRepository();
    this._tripRepository = new TripRepository();
    this._gpsPointRepository = new GpsPointRepository();
    this.__jwtService = new JwtService();
    this._csvParser = new CsvParserService();
    this._tripCalculator = new TripCalculationService();
  }

  setTokensUseCase(): ISetTokensUseCase {
    return new SetTokensUseCase(this.__jwtService);
  }

  signUpUseCase(): ISignUpUseCase {
    return new SignUpUseCase(this._userRepository, this.__jwtService);
  }

  signInUseCase(): ISignInUseCase {
    return new SignInUseCase(this._userRepository, this.__jwtService);
  }

  uploadTripUseCase(): IUploadTripUseCase {
    return new UploadTripUseCase(
      this._tripRepository,
      this._gpsPointRepository,
      this._csvParser,
      this._tripCalculator
    );
  }

  getTripsUseCase(): IGetTripsUseCase {
    return new GetTripsUseCase(this._tripRepository);
  }

  getTripPointsUseCase(): IGetTripPointsUseCase {
    return new GetTripPointsUseCase(this._tripRepository, this._gpsPointRepository);
  }
}

export class Params {
  /**
   * rider and bike parameters
   * @param riderWeight (in kg)
   * @param bikeWeight including all gear (in kg)
   * @param frontalArea front-facing rider+bike surface (m^2)
   * @param dragCoef drag coefficient of rider+bike
   * @param drivetrainLoss percentage of loss in drivetrain power (0.01 for 1%)
   */
  constructor(
    public readonly riderWeight: number,
    public readonly bikeWeight: number,
    public readonly frontalArea: number = 0.509,
    public readonly dragCoef: number = 0.63,
    public readonly drivetrainLoss: number = 0.02
  ) {}
}

export class EnvParams {
  /**
   * environmental parameters
   * @param gradient slope in percent, negative for downhill (0.01 for 1%)
   * @param headWind speed of wind projected on the course direction, negatice for tailwind (in km/h)
   * @param crr coefficient of rolling resistance
   * @param rho air density
   */
  constructor(
    public readonly gradient = 0,
    public readonly headWind = 0,
    public readonly crr = 0.005,
    public readonly rho = 1.22601
  ) {}
}

export const DefaultEnvParams = new EnvParams();

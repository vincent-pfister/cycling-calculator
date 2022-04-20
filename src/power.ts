/**
 * compute power <-> speed, taking gravity, drag and rolling resistance into account
 *
 * inspired by https://www.gribble.org/cycling/power_v_speed.html
 */

import { DefaultEnvParams, EnvParams, Params } from "./params";

const GRAVITY = 9.8067;

class Forces {
  /**
   * forces applied to the system (in N)
   * @param gravity
   * @param rolling
   * @param drag
   */
  constructor(
    public readonly gravity: number,
    public readonly rolling: number,
    public readonly drag: number
  ) {}

  get total(): number {
    return this.gravity + this.rolling + this.drag;
  }
}

class Power {
  constructor(
    public readonly leg: number,
    public readonly wheel: number,
    public readonly drivetrainLoss: number,
    public readonly braking: number,
    public readonly gravity: number,
    public readonly rolling: number,
    public readonly drag: number
  ) {}
}

export class PowerCalulator {
  constructor(private readonly params: Params) {}

  /**
   * compute the forces applied (in N)
   * @param velocity bike speed (in km/h)
   * @param gradient slope in percent (0.01 for 1%)
   * @param headWind head wind speed (in km/h)
   * @param crr coefficient of rolling resistance
   * @param rho air density (in kg/m^3)
   * @returns Forces object
   */
  calculateForces(velocity: number, env: EnvParams = DefaultEnvParams): Forces {
    const angle = Math.atan(env.gradient);
    const sign = Math.sign(velocity);
    const weight = this.params.riderWeight + this.params.bikeWeight;
    const gravity = GRAVITY * weight * Math.sin(angle);
    const rolling = GRAVITY * weight * Math.cos(angle) * env.crr * sign;
    const windSpeed = ((velocity + env.headWind) * 1000) / 3600;
    const windSign = Math.sign(velocity + env.headWind);
    const dragStrength =
      this.params.frontalArea * this.params.dragCoef * env.rho;
    const drag = 0.5 * dragStrength * windSpeed ** 2 * windSign;
    return new Forces(gravity, rolling, drag);
  }

  calculatePower(velocity: number, env: EnvParams = DefaultEnvParams): Power {
    const forces = this.calculateForces(velocity, env);
    const wheelPower = (forces.total * velocity * 1000) / 3600;
    const drivetrainFraction =
      wheelPower > 0 ? 1 - this.params.drivetrainLoss : 1;
    const legPower = wheelPower / drivetrainFraction;
    const [dtl, braking] =
      legPower > 0 ? [legPower - wheelPower, 0] : [0, -legPower];
    const gravityPower = forces.gravity * velocity / (3600 / 1000);
    const rollingPower = forces.rolling * velocity / (3600 / 1000);
    const dragPower = forces.drag * velocity / (3600 / 1000);
    return new Power(
      legPower,
      wheelPower,
      dtl,
      braking,
      gravityPower,
      rollingPower,
      dragPower
    );
  }
}

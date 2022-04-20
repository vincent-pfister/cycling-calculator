/**
 * compute power <-> speed, taking gravity, drag and rolling resistance into account
 * 
 * inspired by https://www.gribble.org/cycling/power_v_speed.html
 */

import { EnvParams, Params } from "./params";
import { PowerCalulator } from "./power";

describe("PowerCalculator", () => {
  const params = new Params(75, 7);
  const calculator = new PowerCalulator(params);
  const envFlat = new EnvParams();
  const envUp = new EnvParams(0.05);

  describe("calculateForces", () => {
    it("should compute gravity=0 with no gradient", () => {
      const { gravity } = calculator.calculateForces(30);
      expect(gravity).toEqual(0);
    });
    it("should compute gravity with a gradient", () => {
      const { gravity } = calculator.calculateForces(30, envUp);
      expect(gravity).toBeCloseTo(40.16);
    });
    it("should compute rolling resistance", () => {
      const { rolling } = calculator.calculateForces(30, envUp);
      expect(rolling).toBeCloseTo(4.02);
    });
    it("should compute rolling resistance when v<0", () => {
      const { rolling } = calculator.calculateForces(-30, envUp);
      expect(rolling).toBeCloseTo(-4.02);
    });
    it("should compute drag", () => {
      const { drag } = calculator.calculateForces(30, envUp);
      expect(drag).toBeCloseTo(13.65);
    });
  });

  describe('calculatePower', () => {
    const power = calculator.calculatePower(30);
    it("should compute leg power", () => {
      expect(power.leg).toBeCloseTo(150.27);
    });
  })
});

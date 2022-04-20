import { EnvParams, Params } from "./params";
import { PowerCalulator } from "./power";

describe("PowerCalculator", () => {
  const params = new Params(75, 7);
  const calculator = new PowerCalulator(params);
  const envFlat = new EnvParams();
  const envUphill = new EnvParams(0.05);
  const envDownhill = new EnvParams(-0.05);

  describe("calculateForces", () => {
    it("should compute gravity=0 with no gradient", () => {
      const { gravity } = calculator.calculateForces(30);
      expect(gravity).toEqual(0);
    });
    it("should compute gravity with a gradient", () => {
      const { gravity } = calculator.calculateForces(30, envUphill);
      expect(gravity).toBeCloseTo(40.16);
    });
    it("should compute rolling resistance", () => {
      const { rolling } = calculator.calculateForces(30, envUphill);
      expect(rolling).toBeCloseTo(4.02);
    });
    it("should compute rolling resistance when v<0", () => {
      const { rolling } = calculator.calculateForces(-30, envUphill);
      expect(rolling).toBeCloseTo(-4.02);
    });
    it("should compute drag", () => {
      const { drag } = calculator.calculateForces(30, envUphill);
      expect(drag).toBeCloseTo(13.65);
    });
  });

  describe("calculate power flat", () => {
    const power = calculator.calculatePower(30);
    it("should compute leg power", () => {
      expect(power.leg).toBeCloseTo(150.27);
    });
    it("should compute wheel power", () => {
      expect(power.wheel).toBeCloseTo(147.26);
    });
    it("should compute drivetrain power loss", () => {
      expect(power.drivetrainLoss).toBeCloseTo(3.01);
    });
    it("should compute gravity power", () => {
      expect(power.gravity).toBeCloseTo(0);
    });
    it("should compute rolling power", () => {
      expect(power.rolling).toBeCloseTo(33.51);
    });
    it("should compute drag power", () => {
      expect(power.drag).toBeCloseTo(113.76);
    });
  });

  describe("calculate power uphill", () => {
    const power = calculator.calculatePower(20, envUphill);
    it("should compute leg power", () => {
      expect(power.leg).toBeCloseTo(284.81);
    });
    it("should compute braking power", () => {
      expect(power.braking).toEqual(0);
    });
    it("should compute gravity power", () => {
      expect(power.gravity).toBeCloseTo(223.1);
    });
  });

  describe("calculate power downhill", () => {
    const power = calculator.calculatePower(40, envDownhill);
    it("should compute leg power", () => {
      expect(power.leg).toBeCloseTo(-131.93);
    });
    it("should compute braking power", () => {
      expect(power.braking).toBeCloseTo(131.93);
    });
  });
});

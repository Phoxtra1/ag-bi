import { describe, expect, test } from "bun:test";
import { isTemporaryPublicRoute, localDateKey, slotFitsDuration } from "./bookingRules";

describe("temporary admin navigation", () => {
  test("/admin opens without an account", () => expect(isTemporaryPublicRoute("/admin")).toBe(true));
  test("private workspace is not made public", () => expect(isTemporaryPublicRoute("/workspace")).toBe(false));
});
describe("appointment availability", () => {
  const slot = { starts_at: "2026-12-01T09:00:00Z", ends_at: "2026-12-01T11:00:00Z", remaining: 1 };
  const now = Date.parse("2026-11-27T06:58:00Z");
  test("120 minute consultation fits the automatic two-hour window", () => expect(slotFitsDuration(slot, 120, now)).toBe(true));
  test("full slots cannot be booked", () => expect(slotFitsDuration({ ...slot, remaining: 0 }, 60, now)).toBe(false));
  test("past slots cannot be booked", () => expect(slotFitsDuration(slot, 60, Date.parse("2026-12-02T00:00:00Z"))).toBe(false));
  test("dates use stable local year-month-day keys", () => expect(localDateKey(new Date(2026, 10, 27, 12))).toBe("2026-11-27"));
});
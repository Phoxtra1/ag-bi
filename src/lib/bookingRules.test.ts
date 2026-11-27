import { describe, expect, test } from "bun:test";
import { createWeekdayRotation, isTemporaryPublicRoute, localDateKey, slotFitsDuration, takeRotatingWeekdays } from "./bookingRules";

describe("public admin route", () => {
  test("/admin opens without a login redirect", () => expect(isTemporaryPublicRoute("/admin")).toBe(true));
  test("private workspace remains protected", () => expect(isTemporaryPublicRoute("/workspace")).toBe(false));
});

describe("automatic appointment availability", () => {
  const slot = { starts_at: "2026-12-01T09:00:00Z", ends_at: "2026-12-01T11:00:00Z", remaining: 1 };
  const now = Date.parse("2026-11-27T06:58:00Z");
  test("a two-hour consultation fits a two-hour slot", () => expect(slotFitsDuration(slot, 120, now)).toBe(true));
  test("full slots cannot be booked", () => expect(slotFitsDuration({ ...slot, remaining: 0 }, 60, now)).toBe(false));
  test("past slots cannot be booked", () => expect(slotFitsDuration(slot, 60, Date.parse("2026-12-02T00:00:00Z"))).toBe(false));
  test("dates use stable local year-month-day keys", () => expect(localDateKey(new Date(2026, 10, 27, 12))).toBe("2026-11-27"));
  test("weekly generation always chooses three distinct weekdays", () => {
    const result = takeRotatingWeekdays(createWeekdayRotation(() => 0.4), 0, () => 0.2);
    expect(result.weekdays).toHaveLength(3);
    expect(new Set(result.weekdays).size).toBe(3);
  });
  test("weekday rotation consumes all five weekdays before starting a new cycle", () => {
    const first = takeRotatingWeekdays([1, 2, 3, 4, 5], 0, () => 0);
    expect(first.weekdays).toEqual([1, 2, 3]);
    const second = takeRotatingWeekdays(first.rotation, first.nextIndex, () => 0);
    expect(second.weekdays).toEqual([4, 5, 1]);
    expect(new Set([...first.weekdays, ...second.weekdays].slice(0, 5)).size).toBe(5);
  });
});

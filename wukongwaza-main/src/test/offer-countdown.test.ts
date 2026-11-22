import { describe, expect, it } from "vitest";

import { formatOfferCountdown, OFFER_DURATION_SECONDS } from "@/lib/offer-countdown";

describe("offer countdown", () => {
  it("starts with 43 minutes and 39 seconds remaining", () => {
    expect(OFFER_DURATION_SECONDS).toBe(2619);
    expect(formatOfferCountdown(OFFER_DURATION_SECONDS)).toBe("43:39");
  });
});
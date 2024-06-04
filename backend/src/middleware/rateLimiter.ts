import rateLimit from "express-rate-limit";

export const getRateLimiter = () =>
  rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: Number(process.env.RATE_LIMIT || 100),
    message: "You have exceeded the daily request limit for the /map endpoint.",
    keyGenerator: function (req) {
      return "global";
    },
  });

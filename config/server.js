require("dotenv").config({
  path: `.env`,
});

module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
});

export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 5000,
    jwt_secret: process.env.JWT_SECRET,
    a_token_expires: process.env.A_TOKEN_EXPIRES,
    r_token_expires: process.env.R_TOKEN_EXPIRES
  },
});

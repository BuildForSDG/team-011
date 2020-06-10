const auth = require("./auth.route");
const user = require("./user.route");
const land = require("./land.route");
const landrequest = require("./landrequest.route");
const paymentRoute = require("./payment.route");
// const genericHandler = require("../middlewares/route-handler");
const authenticate = require("../middlewares/authenticate");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.json({
      status: "success",
      data: req.body
    });
  });

  app.use("/api/auth", auth);
  app.use("/api/users", authenticate, user);

  app.use("/api/lands", authenticate, land);

  app.use("/api/land_requests", authenticate, landrequest);
  app.use("/api/payments", authenticate, paymentRoute);
};

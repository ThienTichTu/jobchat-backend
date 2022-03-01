


const authRouter = require("./auth")
const userRouter = require("./users")

const router = (app) => {

  app.use('/api/auth', authRouter);

  app.use('/api/user', userRouter);
}



module.exports = router;

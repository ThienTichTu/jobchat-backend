


const authRouter = require("./auth")
const userRouter = require("./users")
const chatRouter = require("./chat")
const router = (app) => {

  app.use('/api/auth', authRouter);

  app.use('/api/user', userRouter);

  app.use('/api/chat', chatRouter)
}



module.exports = router;

require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./DB/connect')
const authRouter = require('./Routes/auth')
const expenseRouter = require('./Routes/expenses')
const authMiddleware = require('./middleware/authentication')

// middlewares
app.use(express.json())

//routes
app.get('/', (req, res) => {
   res.send("EXPRENSE TRACKER API")
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/expense', authMiddleware, expenseRouter)



app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)






const port = process.env.PORT || 3000
// console.log(process.env.MONGO_URI)
const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI)
      app.listen(port, () => {
         console.log(`server is listening on port ${port}...`)
      })
   } catch (error) {
      console.log(error)
   }
}
start()





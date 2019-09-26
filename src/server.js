import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

export const app = express()
const router = express.Router()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

const log = (request, response, next) => {
  console.log('logging')
  request.mydata = 'hello'
  next()
}

/**
 * C - post
 * R - get
 * U - put
 * D - delete
 */

router.get('/me', (req, res) => {
  res.send({ me: 'hello' })
})

app.use('/api', router)

app.get('/data', (request, response) => {
  response.send({ data: request.mydata })
})

app.post('/data', (request, response) => {
  console.log(request.body)
  response.send({ ok: true })
})

export const start = () => {
  app.listen(8080, () => {
    console.log('Server is on 8080')
  })
}

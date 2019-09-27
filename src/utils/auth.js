import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Email and Password required!' })
  }
  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ message: err.message })
  }
}

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Email and Password required!' })
  }
  const { email, password } = req.body
  const user = await User.findOne({ email }).exec()
  if (!user) {
    return res.status(401).send({ message: 'User not found' })
  }

  try {
    const isRightPassword = await user.checkPassword(password)
    if (!isRightPassword)
      return res.status(401).send({ message: 'Password is incorrect' })
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    return res.status(401).send({ message: e.message })
  }
}

export const protect = async (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).end()
  let token = req.headers.authorization.split('Bearer ')[1]
  if (!token) {
    return res.status(401).end()
  }
  try {
    const payload = await verifyToken(token)
    const user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()
    if (!payload) return res.status(401).end()
    req.user = user
    next()
  } catch (e) {
    return res.status(401).end()
  }
  next()
}

import mongoose from 'mongoose'

export const getOne = model => async (req, res) => {
  console.log(req.params._id, req.params.user)
  const id = req.params.id
  const user = req.user._id
  const doc = await model.findOne({ _id: id, createdBy: user })
  if (!doc) {
    return res.status(400).end()
  }
  res.status(200).json({ data: doc })
}

export const getMany = model => async (req, res) => {
  const user = req.user._id
  const docs = await model.find({ createdBy: user })
  if (!docs) {
    return res.status(400).end()
  }
  res.status(200).json({ data: docs })
}

export const createOne = model => async (req, res) => {
  const user = req.user._id
  const name = req.body.name
  const newDoc = await model.create({
    name,
    createdBy: user,
    list: mongoose.Types.ObjectId()
  })
  if (!user) {
    return res.status(400).end()
  }
  res.status(201).json({ data: newDoc })
}

export const updateOne = model => async (req, res) => {
  const user = req.user._id
  const listId = req.params.id
  const update = req.body
  const doc = await model.findOneAndUpdate(
    { _id: listId, createdBy: user },
    update,
    { new: true }
  )
  if (!doc) {
    return res.status(400).end()
  }
  res.status(200).json({ data: doc })
}

export const removeOne = model => async (req, res) => {
  const user = req.user._id
  const listId = req.params.id
  const doc = await model
    .findOneAndRemove({ _id: listId, createdBy: user })
    .exec()
  if (!doc) {
    return res.status(400).end()
  }
  res.status(200).json({ data: doc })
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})

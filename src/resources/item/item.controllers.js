import { Item } from './item.model'
import mongoose from 'mongoose'
import { connect } from '../../utils/db'

const run = async () => {
  await connect('mongodb://localhost:27017/api-test')
  const item = await Item.create({
    name: 'Clean Up',
    createdBy: mongoose.Types.ObjectId(),
    list: mongoose.Types.ObjectId()
  })

  const remove = await Item.findByIdAndRemove(item._id).exec()

  console.log(remove)
}

run()

/**
 * Get / Read Many
 * Post / Create one
 * Get /:id Read one
 * Put /:id Update one
 * Delete /:id Delete one
 */

export default {}

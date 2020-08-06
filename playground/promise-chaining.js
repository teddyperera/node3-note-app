require('../src/db/mongoose')
const Task = require('../src/models/task')
const { count } = require('../src/models/task')

const deleteNote = async (id) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteNote('5f1d2544fed5d04ed4527cf2').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})
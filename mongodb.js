const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = process.env.DB_URL
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        console.log('unable to connect to the databse')
    }

    const db = client.db(databaseName)

    db.collection('tasks').deleteOne({
        description: "Task 1"
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})
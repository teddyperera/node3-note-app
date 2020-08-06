const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
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


        // db.collection('users').deleteMany({
        //     age: 27
        // }).then((result) => {
        //     console.log(result)
        // }).catch((error) => {
        //     console.log(error)
        // })

        // db.collection('users').updateOne({
        //     _id: new ObjectID("5f1755feb102024638d26d50")
        // }, {
        //     $inc: {
        //         age: 1
        //     }
        // }).then((result) => {
        //     console.log(result)
        // }).catch((error) => {
        //     console.log(error)
        // })

        // db.collection('tasks').updateMany({
        //     completed: true
        // }, {
        //     $set: {
        //         completed: false
        //     }
        // }).then((result) => {
        //     console.log(result)
        // }).catch((error) => {
        //     console.log(error)
        // })

    })
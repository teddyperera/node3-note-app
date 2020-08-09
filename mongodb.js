const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = process.env.DB_URL
const databaseName = 'task-manager-api'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        console.log('unable to connect to the databse')
    }

    const db = client.db(databaseName)
})
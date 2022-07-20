import express from 'express';
import App from  './services/ExpressApp';
import dbConnection from './services/Database';

const startServer = async() => {
    const app = express()

    await dbConnection()
    await App(app)

    const PORT = process.env.PORT || 8000

    app.listen(PORT, () => {
        // console.clear()
        console.log(`Listening on port ${PORT}`)
    })

}

startServer()
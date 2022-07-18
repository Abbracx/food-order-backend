import express, { Request, Response} from "express";
import { AdminRoute, VendorRoute } from "./routes";
import path from "path";
import { connectdb } from "./config";

const app = express()

async function connect() {
    try {
        await connectdb();
        console.log('Database connected')
    } catch (error) {
        console.log(`Erorr: ${(error as Error).message}`);  
    }

}
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/images', express.static(path.join(__dirname, 'images')))


app.use('/admin', AdminRoute)
app.use('/vendor', VendorRoute) 


const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    // console.clear()
    console.log(`Listening on port ${PORT}`)
})
import express, { Application } from "express";
import { AdminRoute, CustomerRoute, ShoppingRoute, VendorRoute } from "../routes";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerConfig from "./swaggerConfig";


export default async (app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true}));
    app.use('/images', express.static(path.join(__dirname, '../images')))

    // Swagger setup
    const swaggerDocs = swaggerJsdoc(swaggerConfig);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    
    app.use('/admin', AdminRoute)
    app.use('/vendor', VendorRoute)
    app.use('/customer', CustomerRoute)
    app.use(ShoppingRoute)

    return app
}



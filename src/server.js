import express from "express";
import ProductRouter from "./routes/products.routes.js";
import CartRouter from "./routes/carts.routes.js";

const Host = express();

Host.use(express.json())
Host.use(express.urlencoded({extended:true}));

Host.use("/api/products", ProductRouter);
Host.use("/api/carts", CartRouter);

const PORT= 8080;

Host.listen(PORT,()=>{
    console.log(`Iniciando servidor en puerto ${PORT}...`);
})
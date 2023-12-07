import express from "express";
import ProductRouter from "./routes/products.routes.js";
import CartRouter from "./routes/carts.routes.js";
import ViewsRouter from "./routes/views.routes.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { ProductManager,Product } from "./manager/ProductManager.js";

const Host = express();
const PORT= 8080;

const httpServer = Host.listen(PORT,()=>{
    console.log(`Iniciando servidor en puerto ${PORT}...`);
})

const io = new Server(httpServer);

Host.use(express.json());
Host.use(express.urlencoded({extended: true}));

Host.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main"
}));

Host.set("view engine", "hbs");
Host.set("views", `${__dirname}/routes/views`);

Host.use(express.static(`${__dirname}/public`))

const ProManager = new ProductManager("./src/manager/Products.json")

io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("product_send", async (data) => {
        try {
            const product = new Product(data.title, data.description, Number(data.price), data.thumbnails, data.code, Number(data.stock))
            await ProManager.addProduct(product);
            socket.emit("products", ProManager.getProducts());
        }
        catch (error) {
            console.log(error);
        } 
    });

    io.emit("products", ProManager.getProducts());
});

Host.use(express.json())
Host.use(express.urlencoded({extended:true}));

Host.use("/api/products", ProductRouter);
Host.use("/api/carts", CartRouter);
Host.use("/", ViewsRouter);


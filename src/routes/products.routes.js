import { Router } from "express";
import { ProductManager,Product } from "../manager/ProductManager.js";

const ROUTER = Router();
const ProManager = new ProductManager("./src/manager/Products.json")

ROUTER.get("/",(req,res)=>{
    const {limit} = req.query

    const products = ProManager.getProducts()

    if(limit){
        const OptionsLimit = products.slice(0,limit)
        return res.json(OptionsLimit)
    }
    return res.json(products)
})

ROUTER.get("/:id",(req,res)=>{
    const {id} =req.params
    try{
        const ResgetProductById = ProManager.getProductById(Number(id));
        return res.json(ResgetProductById)
    }catch(error){
        return res.status(404).json({error:error.message})
    }
})

ROUTER.delete("/:id",(req,res)=>{
    const {id} = req.params
    try{
        ProManager.deleteProduct(Number(id))
        return res.status(200).json({ message: 'Product deleted successfully' })

    }catch(error){
        return res.status(404).json({error:error.message})
    }
})

ROUTER.post("/", async (req,res)=>{
    try{
        const { title, description, code, price, stock, category,thumbnail } = req.body;
        const status = true;
        const product = new Product(code, title, description, price,status,thumbnail, stock,category);
        if (   title == null
            || description == null
            || code == null
            || price == null
            || stock == null
            || category == null){
            return res.status(400).json({message:"Missing mandatory field"})
        }
        await ProManager.addProduct(product)
        return res.status(200).json({message:"Product created successfully"})
    }catch(error){
        return res.status(500).json({message:error.message})
    }
})

ROUTER.put("/:pid",async (req,res)=>{
    try{
        const {pid} = req.params
        const {code, title, description, price,status,thumbnail, stock,category} = req.body;
        const product = new Product(code, title, description, price,status,thumbnail, stock,category);
        await ProManager.editProduct(pid,product)
        return res.status(200).json({message:"Product updated successfully"})
    }catch(error){
        return res.status(500).json({message:error.message})
    }
})

export default ROUTER
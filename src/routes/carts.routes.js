import { Router, json } from "express";
import { CartManager,Cart } from "../manager/CartManager.js";

const ROUTER = Router()
const CaManager = new CartManager("./src/manager/Carts.json");

ROUTER.get("/",(req,res)=>{
    const GetCart = CaManager.getCarts()

    return res.json(GetCart)
})

ROUTER.get("/:cid",(req,res)=>{
    const {cid} = req.params
    try{
        const CartRes = CaManager.getCartID(cid)
        return res.status(200).json(CartRes)
    }catch(error){
        return res.status(404).json({error:error.message})
    }
})

ROUTER.post("/",(req,res)=>{
    try{
        CaManager.AddCart()
        res.json("Cart Created")
    }catch{
        res.json("Error creating the cart")
    }
})

ROUTER.post("/:cid/product/:pid", async(req,res)=>{
    const {cid,pid}= req.params
    try{
        await CaManager.AddToCart(cid,pid)
        return res.json({message:"Product added to the cart"})
    }catch(error){
        return res.json({error:error.message})
    }
})

export default ROUTER
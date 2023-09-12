import Order from "../models/order.js";
import Products from "../models/product.js";

import BigPromises from "../middlewares/BigPromises.js";


const createOrder = BigPromises(async (req,res,next)=>{
    const {
        shippingInfo,
        orderItem,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount
    } = req.body;
    //if something is missing throw an errir

   const order = await Order.create({
    shippingInfo,
    orderItem,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    user:req.user._id
   })

    res.status(200).json({
        success:true,
        message:'Order created Successfully',
        order
    })
})

const getOneOrder = BigPromises(async (req,res,next)=>{
    const orderedItem = await Order.findById(req.params.id).populate("user", 'name email')
    

    if(!orderedItem){
        return next(new Error('Order Item not found'))
    }
  
    res.status(200).json({
        success:true,
        message:'Here is the order details',
        orderedItem
    })
    
})


const getLoggedInOrders = BigPromises(async (req,res,next)=>{
    const order = await Order.find({user:req.user._id})

    if(!order){
        return next(new Error('No Orders found'))
    }



   res.status(200).json({
    sucess:true,
    order
   })

})



const getAllOrders = BigPromises(async (req,res,next)=>{
  const order = await Order.find()

  if(!order){
    return next(new Error('No Order Yet -Admin'))
  }

 res.status(200).json({
    success:true,
    message:'Here is the order details admin',
    order
 })

})

const adminUpdateOrder = BigPromises(async (req,res,next)=>{
    const order = await Order.findById(req.params.id)

    if(order.orderStatus === "Delivered"){
        return next(new Error("Order is already deliverd"))
    }
    
    order.orderStatus = req.body.orderStatus;

    if(req.body.orderStatus === 'Delivered'){
        order.orderItem.forEach(async (prod)=>{
            await updateProductStock(prod.product,prod.quantity)
        })
    }

    await order.save();

    res.status(200).json({
        success: true,
        order,
      });
})

const adminDeleteOrder = BigPromises(async (req,res,next)=>{

    // const order = await Order.findById(req.params.id);

    await  Order.findByIdAndRemove(req.params.id)



    res.status(200).json({
        success: true,
      });

})
















async function updateProductStock(product_id,qty){
     const product = await Products.findById(product_id)

     product.stock = product.stock -qty;
     await product.save({validateBeforeSave:false})
}


export {
    createOrder,
    getOneOrder,
    getLoggedInOrders,
    getAllOrders,
    adminUpdateOrder,
    adminDeleteOrder
}




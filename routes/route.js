const router = require("express").Router();
const {
    sellerRegister,
    sellerLogIn
} = require("../controllers/sellerController.js");

const {
    productCreate,
    getProducts,
    getProductDetail,
    searchProduct,
    searchProductbyCategory,
    searchProductbySubCategory,
    getSellerProducts,
    updateProduct,
    deleteProduct,
    deleteProducts,
    addReview,
} = require("../controllers/productController.js");

const {
    customerRegister,
    customerLogIn,
    getCartDetail,
    cartUpdate
} = require("../controllers/customerController.js");

const {
    newOrder,
    newOrders,
    getOrderedProductsByCustomer,
    getOrderedProductsBySeller
} = require("../controllers/orderController.js");

// Seller Routes
router.post("/Seller/Register", sellerRegister);   
router.post("/Seller/Login", sellerLogIn);         

// Product Routes 
router.post("/product", productCreate);                  
router.put("/product/:id", updateProduct);         
router.delete("/product/:id", deleteProduct);       
router.delete("/products/:id", deleteProducts);     

// Product Details & Searching
router.get("/products", getProducts);                
router.get("/product/:id", getProductDetail);         
router.get("/Seller/products/:id", getSellerProducts);  
router.get("/search/searchProduct/:key", searchProduct);  
router.get("/search/searchProductbyCategory/:key", searchProductbyCategory);   
router.get("/search/searchProductbySubCategory/:key", searchProductbySubCategory);  

// Reviews (Requires Authentication)
router.put("/review/:id", addReview);

// Customer Routes
router.post("/Customer/Register", customerRegister);  
router.post("/Customer/Login", customerLogIn);       
router.get("/Cart/:id",getCartDetail);
router.put("/UpdateDetails/:id", cartUpdate);
// Order Routes (Protected)
router.post("/order", newOrder);
router.post("/orders", newOrders);
router.get("/order/customer/:id", getOrderedProductsByCustomer);
router.get("/order/seller/:id", getOrderedProductsBySeller);

module.exports = router;

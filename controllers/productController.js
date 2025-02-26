const ProductModel = require("../models/productModel");


const getProducts = async (req, res) => {
    try {
        const products = await ProductModel.getAllProducts();
        res.json(products.map(product => ({
            id: product.id,
            productName: product.ProductName,
            category: product.Category,
            subcategory: product.SubCategory,
            productImage: product.ProductImage,
            description: product.Description,
            tagline: product.Tagline,
            sellerID: product.SellerID,
            createdAt: product.CreatedAt,
            updatedAt: product.UpdatedAt,
            price: product.Price,
            reviews: product.Reviews,
            quantity:product.Quantity
        })));
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products", details: err.message });
    }
};

const getSellerProducts = async (req, res) => {
    try {
        const products = await ProductModel.getProductsBySeller(req.params.id);

        // Ensure products is an array and map it properly
        res.json(products.map(product => ({
            id: product.id,
            productName: product.ProductName,
            category: product.Category,
            subcategory: product.SubCategory,
            productImage: product.ProductImage,
            description: product.Description,
            tagline: product.Tagline,
            sellerID: product.SellerID,
            createdAt: product.CreatedAt,
            updatedAt: product.UpdatedAt,
            price: product.Price,
            reviews: product.Reviews,
            quantity:product.Quantity
        })));
        
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch seller products", details: err.message });
    }
};


const getProductDetail = async (req, res) => {
    try {
        const product = await ProductModel.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        res.json({
            id: product.id,
            productName: product.ProductName,
            category: product.Category,
            subcategory: product.SubCategory,
            productImage: product.ProductImage,
            description: product.Description,
            tagline: product.Tagline,
            sellerID: product.SellerID,
            createdAt: product.CreatedAt,
            updatedAt: product.UpdatedAt,
            price: product.Price,
            reviews: product.Reviews,
            quantity:product.Quantity
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch product details", details: err.message });
    }
};


const productCreate = async (req, res) => {
    try {
        const product = await ProductModel.createProduct(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: "Failed to create product", details: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await ProductModel.updateProduct(req.params.id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Failed to update product", details: error.message });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const result = await ProductModel.deleteAProduct(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product", details: error.message });
    }
};

const deleteProducts = async (req, res) => {
    try {
         const sellerId = req.params.id;
        if (!sellerId) {
            return res.status(400).json({ error: "sellerId must be provided" });
        }

        const result = await ProductModel.deleteMultipleProducts(sellerId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete products", details: error.message });
    }
};

const searchProduct = async (req, res) => {
    try {
        if (!req.params.key) {
            return res.status(400).json({ error: "Query parameter is required" });
        }
        const products = await ProductModel.getAllProducts();
        const filteredProducts = products.filter(product => 
            product.ProductName.toLowerCase().includes(req.params.key.toLowerCase()) ||
            product.Description.toLowerCase().includes(req.params.key.toLowerCase())
        );
        res.json(filteredProducts.map(product => ({
            id: product.id,
            productName: product.ProductName,
            category: product.Category,
            subcategory: product.SubCategory,
            productImage: product.ProductImage,
            description: product.Description,
            tagline: product.Tagline,
            sellerID: product.SellerID,
            createdAt: product.CreatedAt,
            updatedAt: product.UpdatedAt,
            price: product.Price,
            reviews: product.Reviews
        })));
    } catch (error) {
        res.status(500).json({ error: "Failed to search products", details: error.message });
    }
};

const searchProductbyCategory = async (req, res) => {
    try {
        if (!req.params.key) {
            return res.status(400).json({ error: "Query parameter is required" });
        }
        const products = await ProductModel.getAllProducts();
        const filteredProducts = products.filter(product => 
            product.Category.toLowerCase().includes(req.params.key.toLowerCase()) 
        );
        res.json(filteredProducts.map(product => ({
            id: product.id,
            productName: product.ProductName,
            category: product.Category,
            subcategory: product.SubCategory,
            productImage: product.ProductImage,
            description: product.Description,
            tagline: product.Tagline,
            sellerID: product.SellerID,
            createdAt: product.CreatedAt,
            updatedAt: product.UpdatedAt,
            price: product.Price,
            reviews: product.Reviews
        })));
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products by category", details: error.message });
    }
};

const searchProductbySubCategory = async (req, res) => {
    try {
        if (!req.params.key) {
            return res.status(400).json({ error: "Query parameter is required" });
        }
        const products = await ProductModel.getAllProducts();
        const filteredProducts = products.filter(product => 
            product.SubCategory.toLowerCase().includes(req.params.key.toLowerCase()) 
        );
        res.json(filteredProducts.map(product => ({
            id: product.id,
            productName: product.ProductName,
            category: product.Category,
            subcategory: product.SubCategory,
            productImage: product.ProductImage,
            description: product.Description,
            tagline: product.Tagline,
            sellerID: product.SellerID,
            createdAt: product.CreatedAt,
            updatedAt: product.UpdatedAt,
            price: product.Price,
            reviews: product.Reviews
        })));
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products by sub-category", details: error.message });
    }
};

const addReview = async (req, res) => {
    try {
        const review = await ProductModel.addReview(req.params.id, req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: "Failed to add review", details: error.message });
    }
};


module.exports = {
    productCreate,
    getProducts,
    getSellerProducts,
    getProductDetail,
    updateProduct,
    addReview,
    searchProduct,
    searchProductbyCategory,
    searchProductbySubCategory,
    deleteProduct,
    deleteProducts,

};

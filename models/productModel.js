const Airtable = require("airtable");
require("dotenv").config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const table = base("Products");





const getAllProducts = async () => { 
    try {
        const records = await table.select().all();
        return records.map(record => ({
            id: record.id,
            ...record.fields,
            Price: JSON.parse(record.fields.Price),
            Reviews: record.fields.Reviews ? JSON.parse(record.fields.Reviews) : []
        }));
    } catch (error) {
        throw new Error("Error fetching products: " + error.message);
    }
};

const getProductsBySeller = async (sellerId) => { 
    try {
        const records = await table.select({
            filterByFormula: `{SellerID} = '${sellerId}'`
        }).all();
        return records.map(record => ({
            id: record.id,
            ...record.fields,
            Price: JSON.parse(record.fields.Price),
            Reviews: record.fields.Reviews ? JSON.parse(record.fields.Reviews) : []
        }));
    } catch (error) {
        throw new Error("Error fetching seller products: " + error.message);
    }
};
 
const getProductById = async (id) => { 
    try {
        const record = await table.find(id);
        return {
            id: record.id,
            ...record.fields,
            Price: JSON.parse(record.fields.Price),
            Reviews: record.fields.Reviews ? JSON.parse(record.fields.Reviews) : []
        };
    } catch (error) {
        throw new Error("Product not found");
    }
};



const createProduct = async (data) => { 
    try {


         const  createdProduct = await table.create([
            {
                fields: {
                    ProductName: data.productName,
                    Price: JSON.stringify(data.price),
                    SubCategory: data.subcategory,
                    ProductImage: data.productImage,
                    Category: data.category,
                    Description: data.description,
                    Tagline: data.tagline,
                    Quantity: data.quantity || 1,
                    Reviews: JSON.stringify([]),
                    SellerID: data.sellerID,
                }
            }
        ]);
        return createdProduct[0].fields;
    } catch (error) {
        throw new Error("Error creating product: " + error.message);
    }
};

const updateProduct = async (id, data) => { 
    try {
        const updatedProduct = await table.update([
            {
                id,
                fields: {
                    ProductName: data.productName,
                    Price: JSON.stringify(data.price),
                    SubCategory: data.subcategory,
                    ProductImage: data.productImage,
                    Category: data.category,
                    Description: data.description,
                    Tagline: data.tagline,
                }
            }
        ]);
        return updatedProduct[0].fields;
    } catch (error) {
        throw new Error("Error updating product: " + error.message);
    }
};


 
const deleteAProduct = async (productId) => {  
    try {
        const result = await table.destroy([productId]);

        return { deleted: result[0].id }; 
    } catch (error) {
        throw new Error("Error deleting product: " + error.message);
    }
};



const deleteMultipleProducts = async (sellerId) => { 
    try {
        const records = await table
            .select({ filterByFormula: `SellerID = '${sellerId}'` })
            .firstPage();

        if (records.length === 0) return 0;

        const recordIds = records.map((record) => record.id);

        await table.destroy(recordIds);

        return { deleted: recordIds };
    } catch (error) {
        throw new Error("Error deleting products: " + error.message);
    }
};


const addReview = async (id, review) => {  
    try {
        const product = await getProductById(id);
        const reviews = product.Reviews || [];
        reviews.push(review);

        const updatedProduct = await table.update([
            {
                id,
                fields: { Reviews: JSON.stringify(reviews) }
            }
        ]);
        return updatedProduct[0].fields;
    } catch (error) {
        throw new Error("Error adding review: " + error.message);
    }
};


module.exports = {
    createProduct, 
    getAllProducts,
    getProductsBySeller,
    getProductById,
    updateProduct,   
    addReview,
    deleteAProduct,        
    deleteMultipleProducts,  
};

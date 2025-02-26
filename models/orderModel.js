const Airtable = require("airtable");
require("dotenv").config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const OrdersTable = base("Orders");

const OrderModel = {
    
    async createOrder(data) {

            try {
                const createdRecord = await OrdersTable.create([
                    {
                        fields: {
                            BuyerID: data.buyer,
                            SellerID:data.sellerId,
                            ShippingData: JSON.stringify(data.shippingData),
                            OrderedProducts: JSON.stringify(data.orderedProducts),
                            PaymentInfo: JSON.stringify(data.paymentInfo),
                            ProductsQuantity: data.productsQuantity || 0,
                            TotalPrice: data.totalPrice || 0,
                            OrderStatus: data.orderStatus || "Processing",
                        },
                    },
                ]);
                return createdRecord[0].fields;
            } catch (error) {
                console.error("Error creating order:", error);
                throw new Error("Database error: Unable to create order");
            }
    },


    async createOrders(data) {
        try {
            const createdRecords = await OrdersTable.create(
                data.map(order => ({
                    fields: {
                        BuyerID: order.buyer,
                        SellerID:order.sellerID,
                        ShippingData: JSON.stringify(order.shippingData),
                        OrderedProducts: JSON.stringify(order.orderedProduct),
                        PaymentInfo: JSON.stringify(order.paymentInfo),
                        ProductsQuantity: order.productsQuantity || 0,
                        TotalPrice: order.totalPrice || 0,
                        OrderStatus: order.orderStatus || "Processing",
                    },
                }))
            );
            return createdRecords.map(record => record.fields);
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },

    async getOrderById(orderId) {
        try {
            const record = await OrdersTable.find(orderId);
            return {
                id: record.id,
                ...record.fields,
                OrderedProducts: JSON.parse(record.fields.OrderedProducts || "[]"),
                ShippingData: JSON.parse(record.fields.ShippingData || "{}"),
                PaymentInfo: JSON.parse(record.fields.PaymentInfo || "{}"),
            };
        } catch (error) {
            console.error("Error fetching order:", error);
            throw error;
        }
    },

    async getOrdersByCustomer(customerId) {
        try {
            const records = await OrdersTable.select({
                filterByFormula: `{BuyerID} = '${customerId}'`
            }).all();
            
            return records.map(record => ({
                id: record.id,
                ...record.fields,
                OrderedProducts: JSON.parse(record.fields.OrderedProducts || "[]"),
                ShippingData: JSON.parse(record.fields.ShippingData || "{}"),
                PaymentInfo: JSON.parse(record.fields.PaymentInfo || "{}"),
            }));
        } catch (error) {
            console.error("Error fetching orders for customer:", error);
            throw error;
        }
    },

    async getOrdersBySeller(sellerId) {
        try {
            const records = await OrdersTable.select({
                filterByFormula: `{SellerID} = '${sellerId}'`,
            }).firstPage();
    
            return records.map((record) => ({
                id: record.id,
                BuyerID: record.fields.BuyerID,
                ShippingData: JSON.parse(record.fields.ShippingData),
                OrderedProducts: JSON.parse(record.fields.OrderedProducts),
                PaymentInfo: JSON.parse(record.fields.PaymentInfo),
                ProductsQuantity: record.fields.ProductsQuantity,
                TotalPrice: record.fields.TotalPrice,
                OrderStatus: record.fields.OrderStatus,
                CreatedAt: record.fields.CreatedAt,
            }));
        } catch (error) {
            console.error("Error fetching seller orders:", error);
            throw new Error("Database error: Unable to retrieve orders");
        }
    },
};

module.exports = OrderModel;

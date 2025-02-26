const Airtable = require("airtable");
require("dotenv").config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const SellersTable = base("Users"); // Users table stores both sellers & buyers

const SellerModel = {
    async createSeller(data) {
        try {
            const createdRecord = await SellersTable.create([
                {
                    fields: {
                        Name: data.name,
                        Email: data.email,
                        Password: data.password,
                        Role: "Seller",
                        ShopName: data.shopName,
                    },
                },
            ]);
            return { id: createdRecord[0].id, ...createdRecord[0].fields };
        } catch (error) {
            console.error("Error creating seller:", error);
            throw error;
        }
    },

    async getSellerByEmail(email) {
        try {
            const records = await SellersTable.select({
                filterByFormula: `{Email} = "${email}"`,
                maxRecords: 1,
            }).firstPage();

            return records.length > 0 ? { id: records[0].id, ...records[0].fields } : null;
        } catch (error) {
            console.error("Error fetching seller by email:", error);
            return null;
        }
    },

    async getSellerByShopName(shopName) {
        try {
            const records = await SellersTable.select({
                filterByFormula: `{ShopName} = "${shopName}"`,
                maxRecords: 1,
            }).firstPage();

            return records.length > 0 ? { id: records[0].id, ...records[0].fields } : null;
        } catch (error) {
            console.error("Error fetching seller by shop name:", error);
            return null;
        }
    },

};

module.exports = SellerModel;

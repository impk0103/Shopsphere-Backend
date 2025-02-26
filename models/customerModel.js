const Airtable = require("airtable");
require("dotenv").config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const CustomersTable = base("Customers");

const CustomerModel = {
    async createCustomer(data) {
        try {
            const createdRecord = await CustomersTable.create([
                {
                    fields: {
                        Name: data.name,
                        Email: data.email,
                        Password: data.password, 
                        Role: data.role || "Customer",
                        CartDetails: JSON.stringify(data.cartDetails || []),
                        ShippingData: JSON.stringify(data.shippingData || {}),
                    },
                },
            ]);

            return {
                id: createdRecord[0].id,
                Name: createdRecord[0].fields.Name,
                Email: createdRecord[0].fields.Email,
                Role: createdRecord[0].fields.Role,
                CartDetails: JSON.parse(createdRecord[0].fields.CartDetails || "[]"),
                ShippingData: JSON.parse(createdRecord[0].fields.ShippingData || "{}"),
            };
        } catch (error) {
            console.error("Error creating customer:", error);
            throw error;
        }
    },


    async updateCustomer(customerId, data) {
        try {
            const fieldsToUpdate = {};
            if (data.name) fieldsToUpdate.Name = data.name;
            if (data.password) fieldsToUpdate.Password = data.password;
            if (data.role) fieldsToUpdate.Role = data.role;
            if (data.cartDetails) fieldsToUpdate.CartDetails = JSON.stringify(data.cartDetails);
            if (data.shippingData) fieldsToUpdate.ShippingData = JSON.stringify(data.shippingData);

            const updatedRecord = await CustomersTable.update([
                {
                    id: customerId,
                    fields: fieldsToUpdate,
                },
            ]);

            return {
                id: updatedRecord[0].id,
                name: updatedRecord[0].fields.Name,
                email: updatedRecord[0].fields.Email,
                role: updatedRecord[0].fields.Role,
                cartDetails: JSON.parse(updatedRecord[0].fields.CartDetails || "[]"),
                shippingData: JSON.parse(updatedRecord[0].fields.ShippingData || "{}"),
            };
        } catch (error) {
            console.error("Error updating customer:", error);
            throw error;
        }
    },


    async getCustomerByEmail(email) {
        try {
            const records = await CustomersTable.select({
                filterByFormula: `{Email} = '${email}'`,
                maxRecords: 1,
            }).firstPage();

            if (records.length > 0) {
                return {
                    id: records[0].id,
                    Name: records[0].fields.Name,
                    Email: records[0].fields.Email,
                    Password: records[0].fields.Password,
                    Role: records[0].fields.Role,
                    CartDetails: JSON.parse(records[0].fields.CartDetails || "[]"),
                    ShippingData: JSON.parse(records[0].fields.ShippingData || "{}"),
                };
            }
            return null;
        } catch (error) {
            console.error("Error fetching customer:", error);
            throw error;
        }
    },

   
    async getCustomerById(customerId) {
    try {
        const record = await CustomersTable.find(customerId);

        if (record) {
            return {
                id: record.id,
                Name: record.fields.Name,
                Email: record.fields.Email,
                Password: record.fields.Password,  // This should never be exposed in responses
                Role: record.fields.Role,
                CartDetails: JSON.parse(record.fields.CartDetails || "[]"),
                ShippingData: JSON.parse(record.fields.ShippingData || "{}"),
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching customer by ID:", error);
        throw error;
    }
}

};

module.exports = CustomerModel;

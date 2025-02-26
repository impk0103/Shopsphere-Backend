const bcrypt = require("bcrypt");
const CustomerModel = require("../models/customerModel");
const { createNewToken } = require("../utils/token");

const customerRegister = async (req, res) => {
    try {
        const { name, email, password, cartDetails, shippingData } = req.body;

        const existingCustomer = await CustomerModel.getCustomerByEmail(email);
        if (existingCustomer) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newCustomer = await CustomerModel.createCustomer({
            name,
            email,
            password: hashedPass, 
            cartDetails,
            shippingData,
        });

        const token = createNewToken(newCustomer.id);

        res.status(201).json({ id: newCustomer.id, name: newCustomer.Name, email: newCustomer.Email, role: newCustomer.Role,shippingData:newCustomer.ShippingData, cartDetails:newCustomer.CartDetails, token});
    } catch (err) {
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
};

const customerLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const customer = await CustomerModel.getCustomerByEmail(email);
        if (!customer) {
            return res.status(404).json({ message: "User not found" });
        }
        

        const isValidPassword = await bcrypt.compare(password, customer.Password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = createNewToken(customer.id);
        res.json({ id: customer.id, name: customer.Name, email: customer.Email, role: customer.Role,shippingData:customer.ShippingData, cartDetails:customer.CartDetails, token });
    } catch (err) {
        res.status(500).json({ error: "Login failed", details: err.message });
    }
};

const getCartDetail = async (req, res) => {
    try {
        const customer = await CustomerModel.getCustomerById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json(customer.CartDetails);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch cart details", details: err.message });
    }
};

const cartUpdate = async (req, res) => {
    try {
        const updatedCustomer = await CustomerModel.updateCustomer(req.body.id,req.body);

        res.json(updatedCustomer.cartDetails);
    } catch (err) {
        res.status(500).json({ error: "Failed to update cart", details: err.message });
    }
};

module.exports = {
    customerRegister,
    customerLogIn,
    getCartDetail,
    cartUpdate,
};

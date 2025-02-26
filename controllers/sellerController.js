const bcrypt = require("bcrypt");
const SellerModel = require("../models/sellerModel.js");
const { createNewToken } = require("../utils/token.js");

const sellerRegister = async (req, res) => {
    try {
        
        const { name, email, password, shopName } = req.body;

        // Check if email already exists
        const existingSellerByEmail = await SellerModel.getSellerByEmail(email);
        if (existingSellerByEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check if shop name already exists
        const existingShop = await SellerModel.getSellerByShopName(shopName);
        if (existingShop) {
            return res.status(400).json({ message: "Shop name already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Create seller
        const newSeller = await SellerModel.createSeller({
            name,
            email,
            password: hashedPass,
            shopName,
        });

        // Generate token
        const token = createNewToken(newSeller.id);

        res.status(201).json({ id: newSeller.id,email:newSeller.Email, name:newSeller.Name,password:newSeller.Password,role:newSeller.Role,shopName:newSeller.ShopName, token });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
};

const sellerLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Get seller by email
        const seller = await SellerModel.getSellerByEmail(email);
        if (!seller) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, seller.Password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate token
        const token = createNewToken(seller.id);
        res.status(201).json({ id: seller.id,email:seller.Email, name:seller.Name,password:seller.Password,role:seller.Role,shopName:seller.ShopName, token });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Login failed", details: err.message });
    }
};

module.exports = { sellerRegister, sellerLogIn };

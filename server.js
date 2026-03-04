const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();

// 1. MIDDLEWARE (Must come before routes)
app.use(cors());
app.use(express.json());

// 2. MONGODB CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/eventManagementDB')
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// 3. USER SCHEMA
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// --- 4. API ROUTES (Define these BEFORE static files) ---

// REGISTRATION
app.post('/api/register', async (req, res) => {
    try {
        const { name, phone, email, password, role } = req.body;
        const newUser = new User({ name, phone, email, password, role });
        await newUser.save();
        res.json({ success: true, message: "Registration successful!" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "User already exists!" });
        }
        res.status(500).json({ success: false, message: "Error saving user." });
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email: email.trim(), password, role });

        if (user) {
            const redirectPath = (role === 'Admin') ? '/admin/admin_web.html' : '/user/user_web.html';
            res.json({ 
                success: true, 
                redirect: redirectPath,
                userName: user.name 
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: `Access Denied: Invalid credentials for ${role} portal.` 
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during login." });
    }
});


// --- 5. STATIC FILES & PAGE ROUTES (Define after APIs) ---

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Auth', 'auth.html'));
});

// 6. START SERVER
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
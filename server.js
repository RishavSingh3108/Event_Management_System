const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());

// 1. MONGODB CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/eventManagementDB')
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// 2. USER SCHEMA
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// 3. STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// 4. HOME ROUTE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Auth', 'auth.html'));
});

// 5. REGISTRATION
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

// 6. LOGIN (Modified to send userName)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user by email, password, AND role
        const user = await User.findOne({ email, password, role });

        if (user) {
            const redirectPath = (role === 'Admin') ? '/admin/admin_web.html' : '/user/user_web.html';
            
            // We now send the name back to the frontend
            res.json({ 
                success: true, 
                redirect: redirectPath,
                userName: user.name // <--- Added this line
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
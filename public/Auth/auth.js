let currentRole = 'User';
let isRegistering = false;

function setRole(role) {
    currentRole = role;
    document.getElementById('userBtn').classList.toggle('active', role === 'User');
    document.getElementById('adminBtn').classList.toggle('active', role === 'Admin');
    updateTitle();
}

function toggleAuth() {
    isRegistering = !isRegistering;
    document.getElementById('regOnlyFields').classList.toggle('hidden');
    updateTitle();
}

function updateTitle() {
    const title = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    title.innerText = `${currentRole} ${isRegistering ? 'Registration' : 'Login'}`;
    submitBtn.innerText = isRegistering ? "GET STARTED" : "CONTINUE";
}

// --- NEW FUNCTIONAL BACKEND CONNECTION ---
document.getElementById('authForm').onsubmit = async (e) => {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    const fullName = e.target.querySelectorAll('input')[0].value;
    const phone = e.target.querySelectorAll('input')[1].value;

    const endpoint = isRegistering ? '/api/register' : '/api/login';
    const payload = isRegistering 
        ? { name: fullName, phone, email, password, role: currentRole }
        : { email, password, role: currentRole };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            if (isRegistering) {
                alert("Registration Successful! Please login.");
                toggleAuth(); // Switch to login view
            } else {
                // SUCCESS: Redirect to specific dashboard
                window.location.href = result.redirect;
            }
        } else {
            alert(result.message);
        }
    } catch (err) {
        alert("Server Error. Make sure Node.js is running.");
    }
};

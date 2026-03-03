let currentRole = 'User';
let isRegistering = false;

function setRole(role) {
    currentRole = role;
    document.getElementById('userBtn').classList.toggle('active', role === 'User');
    document.getElementById('adminBtn').classList.toggle('active', role === 'Admin');

    const footerText = document.getElementById('footerText');
    if (!isRegistering) {
        footerText.innerText = (role === 'User') ? "New user?" : "New admin?";
    }
    updateTitle();
}

function toggleAuth() {
    isRegistering = !isRegistering;
    const regFields = document.getElementById('regOnlyFields');
    const submitBtn = document.getElementById('submitBtn');
    const toggleLink = document.getElementById('toggleLink');
    const footerText = document.getElementById('footerText');

    if (isRegistering) {
        regFields.classList.remove('hidden');
        submitBtn.innerText = "GET STARTED";
        footerText.innerText = "Already a member?";
        toggleLink.innerText = "Sign In";
    } else {
        regFields.classList.add('hidden');
        submitBtn.innerText = "CONTINUE";
        footerText.innerText = (currentRole === 'User') ? "New user?" : "New admin?";
        toggleLink.innerText = "Create Account";
    }
    updateTitle();
}

function updateTitle() {
    const title = document.getElementById('formTitle');
    title.innerText = `${currentRole} ${isRegistering ? 'Registration' : 'Login'}`;
}

document.getElementById('authForm').onsubmit = (e) => {
    e.preventDefault();
    alert(`Accessing ${currentRole} Dashboard...`);
};
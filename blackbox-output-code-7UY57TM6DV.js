// Firebase configuration (replace with your own)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const signInBtn = document.getElementById('sign-in-btn');
const signOutBtn = document.getElementById('sign-out-btn');

// Sign in with Google
signInBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
});

// Sign out
signOutBtn.addEventListener('click', () => {
    auth.signOut();
});

// Auth state change
auth.onAuthStateChanged(user => {
    if (user) {
        authContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
        loadMessages();
    } else {
        authContainer.style.display = 'block';
        chatContainer.style.display = 'none';
    }
});

// Send message
sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message && auth.currentUser) {
        db.collection('messages').add({
            text: message,
            uid: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        messageInput.value = '';
    }
});

// Load messages in real-time
function loadMessages() {
    db.collection('messages').orderBy('timestamp').onSnapshot(snapshot => {
        messagesDiv.innerHTML = '';
        snapshot.forEach(doc => {
            const msg = doc.data();
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(msg.uid === auth.currentUser.uid ? 'sent' : 'received');
            messageDiv.textContent = `${msg.displayName}: ${msg.text}`;
            messagesDiv.appendChild(messageDiv);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to bottom
    });
}
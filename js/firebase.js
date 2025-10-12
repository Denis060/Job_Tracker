// Firebase Configuration Module
// Job OS v3.0 - Firebase Integration

let db, auth, storage;

// Firebase Configuration
function initializeFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyB8lFKbJ3gzH8d4lYpSxVfKjEhTk5XzNvQ",
        authDomain: "job-tracker-8a255.firebaseapp.com",
        projectId: "job-tracker-8a255",
        storageBucket: "job-tracker-8a255.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abcdef123456"
    };

    // Initialize Firebase
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        storage = firebase.storage();
        
        console.log("🔥 Firebase initialized successfully");
        
        // Set up auth state listener
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("✅ User logged in:", user.email);
                loadUserData(user.uid);
            } else {
                console.log("❌ User logged out");
                showLoginForm();
            }
        });
        
    } catch (error) {
        console.error("🔥 Firebase initialization error:", error);
        // Continue without Firebase for offline functionality
    }
}

// User Authentication Functions
async function loginUser(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log("✅ Login successful:", userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        console.error("❌ Login error:", error);
        throw error;
    }
}

async function registerUser(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        console.log("✅ Registration successful:", userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        console.error("❌ Registration error:", error);
        throw error;
    }
}

async function logoutUser() {
    try {
        await auth.signOut();
        console.log("✅ Logout successful");
    } catch (error) {
        console.error("❌ Logout error:", error);
    }
}

// Data Management Functions
async function saveUserData(userId, data) {
    if (!db) return null;
    
    try {
        await db.collection('users').doc(userId).set(data, { merge: true });
        console.log("✅ Data saved successfully");
        return true;
    } catch (error) {
        console.error("❌ Save data error:", error);
        return false;
    }
}

async function loadUserData(userId) {
    if (!db) return null;
    
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            const data = doc.data();
            console.log("✅ Data loaded successfully");
            return data;
        } else {
            console.log("📄 No user data found");
            return null;
        }
    } catch (error) {
        console.error("❌ Load data error:", error);
        return null;
    }
}

// Job Data Functions
async function saveJob(userId, jobData) {
    if (!db) return null;
    
    try {
        const docRef = await db.collection('jobs').add({
            userId: userId,
            ...jobData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("✅ Job saved with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ Save job error:", error);
        return null;
    }
}

async function loadJobs(userId) {
    if (!db) return [];
    
    try {
        const snapshot = await db.collection('jobs')
            .where('userId', '==', userId)
            .orderBy('updatedAt', 'desc')
            .get();
        
        const jobs = [];
        snapshot.forEach(doc => {
            jobs.push({ id: doc.id, ...doc.data() });
        });
        
        console.log("✅ Loaded", jobs.length, "jobs");
        return jobs;
    } catch (error) {
        console.error("❌ Load jobs error:", error);
        return [];
    }
}

// File Upload Functions
async function uploadFile(file, path) {
    if (!storage) return null;
    
    try {
        const storageRef = storage.ref().child(path);
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        console.log("✅ File uploaded:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("❌ File upload error:", error);
        return null;
    }
}

// UI Helper Functions
function showLoginForm() {
    // Implementation for showing login form
    console.log("🔐 Showing login form");
}

// Export functions for use in other modules
window.FirebaseModule = {
    initializeFirebase,
    loginUser,
    registerUser,
    logoutUser,
    saveUserData,
    loadUserData,
    saveJob,
    loadJobs,
    uploadFile
};
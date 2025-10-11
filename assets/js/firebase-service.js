/**
 * Job OS - Firebase Service
 * Handles all Firebase operations including authentication, database, and storage
 */

import { CONFIG, ERROR_MESSAGES } from './config.js';
import { showToast } from './utils.js';

class FirebaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.storage = null;
    this.userId = null;
    this.isInitialized = false;
    
    // Unsubscribe functions for real-time listeners
    this.unsubscribers = {
      jobs: null,
      contacts: null,
      history: null
    };
  }

  /**
   * Initialize Firebase services
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      // Initialize Firebase app
      this.app = firebase.initializeApp(CONFIG.FIREBASE);
      this.auth = firebase.auth();
      this.db = firebase.firestore();
      this.storage = firebase.storage();

      // Set up authentication state listener
      this.auth.onAuthStateChanged(this.handleAuthStateChange.bind(this));
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      this.updateAuthStatus(`${ERROR_MESSAGES.FIREBASE_INIT}: ${error.message}`, true);
      return false;
    }
  }

  /**
   * Handle authentication state changes
   * @param {Object} user - Firebase user object
   */
  async handleAuthStateChange(user) {
    if (user) {
      this.userId = user.uid;
      this.updateAuthStatus(`User ID: ${this.userId.substring(0, 8)}...`, false);
      
      // Notify app that user is authenticated
      if (window.app && window.app.onUserAuthenticated) {
        window.app.onUserAuthenticated(this.userId);
      }
    } else {
      this.userId = null;
      this.updateAuthStatus('Authenticating...', false);
      
      // Attempt anonymous sign-in
      await this.signInAnonymously();
    }
  }

  /**
   * Sign in anonymously
   * @returns {Promise<boolean>} Success status
   */
  async signInAnonymously() {
    try {
      await this.auth.signInAnonymously();
      return true;
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      
      if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/configuration-not-found') {
        this.updateAuthStatus(`
          <div class="text-red-500 font-sans">
            <strong>Action Required:</strong> Please enable Anonymous Sign-In in your Firebase project.
            <ol class="list-decimal list-inside text-left mt-1 text-xs">
              <li>Go to your Firebase Console.</li>
              <li>Navigate to <strong>Build > Authentication</strong>.</li>
              <li>Click <strong>"Get started"</strong>, then select <strong>Anonymous</strong> and enable it.</li>
            </ol>
          </div>`, true);
      } else {
        this.updateAuthStatus(`Auth Error: ${error.code}`, true);
      }
      return false;
    }
  }

  /**
   * Update authentication status display
   * @param {string} message - Status message
   * @param {boolean} isError - Whether this is an error message
   */
  updateAuthStatus(message, isError = false) {
    const authStatus = document.getElementById('auth-status');
    if (authStatus) {
      authStatus.innerHTML = message;
      if (isError) {
        authStatus.classList.add('text-red-500');
      } else {
        authStatus.classList.remove('text-red-500');
      }
    }
  }

  /**
   * Get collection reference for user data
   * @param {string} collection - Collection name (jobs, contacts, history)
   * @returns {Object} Firestore collection reference
   */
  getUserCollection(collection) {
    if (!this.userId) {
      throw new Error('User not authenticated');
    }
    
    return this.db
      .collection(CONFIG.COLLECTIONS.ARTIFACTS)
      .doc(CONFIG.COLLECTIONS.APP_DOC)
      .collection(CONFIG.COLLECTIONS.USERS)
      .doc(this.userId)
      .collection(collection);
  }

  /**
   * Save job application
   * @param {Object} jobData - Job application data
   * @param {string} id - Optional job ID for updates
   * @returns {Promise<string>} Document ID
   */
  async saveJob(jobData, id = null) {
    try {
      const collection = this.getUserCollection(CONFIG.COLLECTIONS.JOBS);
      
      if (id) {
        await collection.doc(id).set(jobData, { merge: true });
        return id;
      } else {
        const docRef = await collection.add(jobData);
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving job:', error);
      showToast(ERROR_MESSAGES.SAVE_FAILED, 'error');
      throw error;
    }
  }

  /**
   * Delete job application
   * @param {string} id - Job ID
   * @returns {Promise<void>}
   */
  async deleteJob(id) {
    try {
      await this.getUserCollection(CONFIG.COLLECTIONS.JOBS).doc(id).delete();
      showToast('Job application deleted', 'success');
    } catch (error) {
      console.error('Error deleting job:', error);
      showToast(ERROR_MESSAGES.DELETE_FAILED, 'error');
      throw error;
    }
  }

  /**
   * Get job by ID
   * @param {string} id - Job ID
   * @returns {Promise<Object>} Job data
   */
  async getJob(id) {
    try {
      const doc = await this.getUserCollection(CONFIG.COLLECTIONS.JOBS).doc(id).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting job:', error);
      throw error;
    }
  }

  /**
   * Listen to jobs collection changes
   * @param {Function} callback - Callback function to handle data changes
   */
  listenToJobs(callback) {
    if (this.unsubscribers.jobs) {
      this.unsubscribers.jobs();
    }

    this.unsubscribers.jobs = this.getUserCollection(CONFIG.COLLECTIONS.JOBS)
      .orderBy('submissionDate', 'desc')
      .onSnapshot(
        snapshot => {
          const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          callback(jobs);
        },
        error => {
          console.error('Error fetching jobs:', error);
          showToast('Error loading job applications', 'error');
        }
      );
  }

  /**
   * Save contact
   * @param {Object} contactData - Contact data
   * @param {string} id - Optional contact ID for updates
   * @returns {Promise<string>} Document ID
   */
  async saveContact(contactData, id = null) {
    try {
      const collection = this.getUserCollection(CONFIG.COLLECTIONS.CONTACTS);
      
      if (id) {
        await collection.doc(id).set(contactData, { merge: true });
        return id;
      } else {
        const docRef = await collection.add(contactData);
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      showToast(ERROR_MESSAGES.SAVE_FAILED, 'error');
      throw error;
    }
  }

  /**
   * Delete contact
   * @param {string} id - Contact ID
   * @returns {Promise<void>}
   */
  async deleteContact(id) {
    try {
      await this.getUserCollection(CONFIG.COLLECTIONS.CONTACTS).doc(id).delete();
      showToast('Contact deleted', 'success');
    } catch (error) {
      console.error('Error deleting contact:', error);
      showToast(ERROR_MESSAGES.DELETE_FAILED, 'error');
      throw error;
    }
  }

  /**
   * Listen to contacts collection changes
   * @param {Function} callback - Callback function to handle data changes
   */
  listenToContacts(callback) {
    if (this.unsubscribers.contacts) {
      this.unsubscribers.contacts();
    }

    this.unsubscribers.contacts = this.getUserCollection(CONFIG.COLLECTIONS.CONTACTS)
      .onSnapshot(
        snapshot => {
          const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          contacts.sort((a, b) => (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase()));
          callback(contacts);
        },
        error => {
          console.error('Error fetching contacts:', error);
          showToast('Error loading contacts', 'error');
        }
      );
  }

  /**
   * Save work history
   * @param {Object} historyData - Work history data
   * @param {string} id - Optional history ID for updates
   * @returns {Promise<string>} Document ID
   */
  async saveHistory(historyData, id = null) {
    try {
      const collection = this.getUserCollection(CONFIG.COLLECTIONS.HISTORY);
      
      if (id) {
        await collection.doc(id).set(historyData, { merge: true });
        return id;
      } else {
        const docRef = await collection.add(historyData);
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving work history:', error);
      showToast(ERROR_MESSAGES.SAVE_FAILED, 'error');
      throw error;
    }
  }

  /**
   * Delete work history
   * @param {string} id - History ID
   * @returns {Promise<void>}
   */
  async deleteHistory(id) {
    try {
      await this.getUserCollection(CONFIG.COLLECTIONS.HISTORY).doc(id).delete();
      showToast('Work history deleted', 'success');
    } catch (error) {
      console.error('Error deleting work history:', error);
      showToast(ERROR_MESSAGES.DELETE_FAILED, 'error');
      throw error;
    }
  }

  /**
   * Listen to work history collection changes
   * @param {Function} callback - Callback function to handle data changes
   */
  listenToHistory(callback) {
    if (this.unsubscribers.history) {
      this.unsubscribers.history();
    }

    this.unsubscribers.history = this.getUserCollection(CONFIG.COLLECTIONS.HISTORY)
      .orderBy('startDate', 'desc')
      .onSnapshot(
        snapshot => {
          const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          callback(history);
        },
        error => {
          console.error('Error fetching work history:', error);
          showToast('Error loading work history', 'error');
        }
      );
  }

  /**
   * Upload file to Firebase Storage
   * @param {File} file - File to upload
   * @param {string} path - Storage path
   * @returns {Promise<string>} Download URL
   */
  async uploadFile(file, path) {
    try {
      const storageRef = this.storage.ref(path);
      const snapshot = await storageRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      showToast(ERROR_MESSAGES.UPLOAD_FAILED, 'error');
      throw error;
    }
  }

  /**
   * Update job status (for Kanban board)
   * @param {string} jobId - Job ID
   * @param {string} newStatus - New status
   * @returns {Promise<void>}
   */
  async updateJobStatus(jobId, newStatus) {
    try {
      await this.getUserCollection(CONFIG.COLLECTIONS.JOBS)
        .doc(jobId)
        .update({ appStatus: newStatus });
    } catch (error) {
      console.error('Error updating job status:', error);
      showToast('Error updating job status', 'error');
      throw error;
    }
  }

  /**
   * Clean up listeners
   */
  cleanup() {
    Object.values(this.unsubscribers).forEach(unsubscribe => {
      if (unsubscribe) unsubscribe();
    });
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!this.userId;
  }

  /**
   * Get current user ID
   * @returns {string|null} User ID
   */
  getCurrentUserId() {
    return this.userId;
  }
}

// Export singleton instance
export default new FirebaseService();
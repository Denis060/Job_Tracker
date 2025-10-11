/**
 * Job OS - Configuration and Constants
 * Contains all application configuration, constants, and environment settings
 */

// Application Configuration
export const CONFIG = {
  APP_NAME: 'Job OS',
  VERSION: '1.0.0',
  
  // Firebase Configuration - Update with your project details
  FIREBASE: {
    apiKey: "AIzaSyDpjQmxmNFH_jF74HdwVcsf5xJHR-fKsWM",
    authDomain: "job-os-tracker.firebaseapp.com",
    projectId: "job-os-tracker",
    storageBucket: "job-os-tracker.appspot.com",
    messagingSenderId: "668892831481",
    appId: "1:668892831481:web:01420640b1764ff10e8c28",
    measurementId: "G-GCR3ZQ0TXV"
  },
  
  // Database Collections
  COLLECTIONS: {
    ARTIFACTS: 'artifacts',
    APP_DOC: 'job-os-app',
    USERS: 'users',
    JOBS: 'jobs',
    CONTACTS: 'contacts',
    HISTORY: 'history'
  },
  
  // File Upload Limits
  UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    RESUME_PATH: 'users/{userId}/jobs/{jobId}/resume_{timestamp}_{filename}',
    COVER_LETTER_PATH: 'users/{userId}/jobs/{jobId}/coverLetter_{timestamp}_{filename}'
  }
};

// Application Constants
export const CONSTANTS = {
  // Kanban Board Columns
  KANBAN_COLUMNS: {
    APPLIED: 'Applied',
    INTERVIEWING: 'Interviewing', 
    OFFER: 'Offer',
    CLOSED: 'Closed'
  },
  
  // Application Statuses
  JOB_STATUSES: [
    'Waiting for application response',
    'Application under review',
    'Denied without an interview',
    'I rejected an interview invitation',
    'I withdrew my app',
    'First round interview',
    'Second round interview', 
    'Third round interview',
    'Fourth round interview',
    'First round interview then I never heard from them',
    'Second round interview then I never heard from them',
    'Third round interview then I never heard from them',
    'Fourth round interview then I never heard from them',
    'Denied after first round interview',
    'Denied after second round interview',
    'Denied after third round interview', 
    'Denied after fourth round interview',
    'Waiting for offer',
    'I accepted their offer',
    'I rejected their offer',
    'Position was filled before I interviewed'
  ],
  
  // Employment Types
  EMPLOYMENT_TYPES: [
    'Full-time',
    'Part-time', 
    'Contract',
    'Internship'
  ],
  
  // Qualification Levels
  QUALIFICATION_LEVELS: [
    '91-100%',
    '81-90%',
    '71-80%',
    '61-70%',
    '41-60%',
    '20-40%',
    '<20%',
    'Unsure'
  ],
  
  // Interest Levels
  INTEREST_LEVELS: [
    'I want this job',
    'I really want this job', 
    'I\'d like to get an interview',
    'I don\'t care whether or not I get an interview',
    'Unsure',
    'Not interested but want to keep this networking connection'
  ],
  
  // Contact Types
  CONTACT_TYPES: [
    'Professional',
    'Academic',
    'Recruiter', 
    'Personal'
  ],
  
  // Communication Methods
  COMMUNICATION_METHODS: [
    'Email',
    'LinkedIn',
    'Phone Call',
    'In-person',
    'Unknown'
  ],
  
  // Relationship Standings
  RELATIONSHIP_STANDINGS: [
    'Active',
    'Lost touch'
  ]
};

// UI Constants
export const UI = {
  MODAL_ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280
  },
  
  CLASSES: {
    MODAL_ACTIVE: 'active',
    LOADING: 'loading',
    HIDDEN: 'hidden',
    DRAGGING: 'dragging',
    DRAG_OVER: 'drag-over'
  }
};

// Chart Configuration
export const CHART_CONFIG = {
  FUNNEL_CHART: {
    type: 'bar',
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  },
  
  COLORS: {
    PRIMARY: '#6366f1',
    SECONDARY: '#3b82f6', 
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  FIREBASE_INIT: 'Failed to initialize Firebase',
  AUTH_FAILED: 'Authentication failed',
  SAVE_FAILED: 'Failed to save data',
  DELETE_FAILED: 'Failed to delete item',
  UPLOAD_FAILED: 'File upload failed',
  NETWORK_ERROR: 'Network error occurred',
  INVALID_FILE: 'Invalid file type or size',
  REQUIRED_FIELD: 'This field is required'
};

// Success Messages  
export const SUCCESS_MESSAGES = {
  SAVED: 'Successfully saved',
  DELETED: 'Successfully deleted',
  UPLOADED: 'File uploaded successfully',
  UPDATED: 'Successfully updated'
};

// Default Values
export const DEFAULTS = {
  JOB: {
    employmentType: 'Full-time',
    appStatus: 'Waiting for application response',
    qualificationLevel: 'Unsure',
    interestLevel: 'I\'d like to get an interview'
  },
  
  CONTACT: {
    type: 'Professional',
    isReference: 'No',
    relationshipStanding: 'Active',
    lastCommMethod: 'Email'
  },
  
  HISTORY: {
    employmentType: 'Full-time'
  }
};
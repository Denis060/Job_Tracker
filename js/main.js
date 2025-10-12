// Main Application Module
// Job OS v3.0 - Application Initialization and Coordination

// Initialize the entire Job OS application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Job OS v3.0 - Initializing...');
    
    // Initialize all modules
    try {
        // Initialize Firebase
        if (window.FirebaseModule) {
            window.FirebaseModule.initializeFirebase();
        }
        
        // Initialize Smart Resume AI
        if (window.SmartResumeModule) {
            window.SmartResumeModule.initializeSmartResume();
        }
        
        // Initialize Interview Prep
        if (window.InterviewModule) {
            window.InterviewModule.initializeInterviewPrep();
        }
        
        // Initialize Cover Letter Generator
        if (window.CoverLetterModule) {
            window.CoverLetterModule.initializeCoverLetter();
        }
        
        // Set up global event listeners
        setupGlobalEventListeners();
        
        // Set up navigation
        setupNavigation();
        
        // Initialize default view
        const defaultTab = document.querySelector('.nav-tab[data-tab="dashboard"]');
        if (defaultTab) {
            switchTab(defaultTab);
        }
        
        console.log('✅ Job OS v3.0 - Initialization complete!');
        
    } catch (error) {
        console.error('❌ Error during initialization:', error);
        showToast('Application initialization failed. Some features may not work correctly.', 'error');
    }
});

// Set up global event listeners
function setupGlobalEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            if (window.UtilsModule) {
                window.UtilsModule.switchTab(tab);
            }
        });
    });
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for quick search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Implement quick search functionality
            console.log('Quick search triggered');
        }
        
        // Esc to close modals
        if (e.key === 'Escape') {
            if (window.UtilsModule) {
                window.UtilsModule.closeAllModals();
            }
        }
    });
    
    // Click outside modals to close them
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            if (window.UtilsModule) {
                window.UtilsModule.closeAllModals();
            }
        }
    });
}

// Set up navigation functionality
function setupNavigation() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Close all open modals
function closeAllModals() {
    if (window.UtilsModule) {
        window.UtilsModule.closeAllModals();
    }
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error caught:', e.error);
    
    // Don't show error toast for network errors or Firebase connection issues
    if (e.error && e.error.message && 
        !e.error.message.includes('Firebase') && 
        !e.error.message.includes('network') &&
        !e.error.message.includes('fetch')) {
        showToast('An unexpected error occurred. Please try again.', 'error');
    }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    
    // Don't show error toast for Firebase or network-related rejections
    if (e.reason && e.reason.message && 
        !e.reason.message.includes('Firebase') && 
        !e.reason.message.includes('network') &&
        !e.reason.message.includes('fetch')) {
        showToast('An unexpected error occurred. Please try again.', 'error');
    }
    
    e.preventDefault(); // Prevent default browser behavior
});

// Debug functionality for development
window.JobOSDebug = {
    // Test resume parsing
    testResumeParsing: function() {
        const testResume = `IBRAHIM LAHAI
18 Hennessy Street, Kingtom, Freetown, Sierra Leone
+232 78 377 336 / +232 31 077 461 | lahaiibrahim@gmail.com
Professional Summary
A detail-oriented and experienced accounting professional with a Bachelor of Science in Applied
Accounting and a strong background in finance and administration.
Experience
Finance and Admin Officer | Kubia Business Enterprises Ltd
Freetown | January 2019 – Present
● Prepare and process accounts payable and receivable.
● Manage staff payroll, ensuring accurate and timely processing.
Technical Skills
● QuickBooks Pro
● MS Excel
● MS Word`;
        
        console.log('🧪 TESTING RESUME PARSING:');
        console.log('🧪 Test resume length:', testResume.length);
        
        if (window.UtilsModule) {
            const name = window.CoverLetterModule ? 
                window.CoverLetterModule.extractNameFromResume(testResume) : 
                'Function not available';
            console.log('🧪 Extracted name:', name);
            
            const skills = window.UtilsModule.extractSkillsFromResume(testResume);
            console.log('🧪 Extracted skills:', skills);
            
            const experience = window.UtilsModule.extractRelevantExperience(testResume, ['accounting', 'payroll']);
            console.log('🧪 Extracted experience:', experience);
            
            return { name, skills, experience };
        } else {
            console.log('🧪 Utils module not available');
            return null;
        }
    },
    
    // Get application state
    getAppState: function() {
        return {
            modules: {
                firebase: !!window.FirebaseModule,
                smartResume: !!window.SmartResumeModule,
                coverLetter: !!window.CoverLetterModule,
                interview: !!window.InterviewModule,
                utils: !!window.UtilsModule
            },
            currentView: document.querySelector('.nav-tab.active-tab')?.dataset.tab || 'none',
            resumeData: {
                hasExtractedText: !!window.extractedResumeText,
                hasUploadedFile: !!window.uploadedResumeFile
            }
        };
    },
    
    // Clear all data
    clearAllData: function() {
        // Clear resume data
        if (window.SmartResumeModule) {
            window.SmartResumeModule.clearResumeData();
        }
        
        // Clear cover letter data
        if (window.CoverLetterModule) {
            window.CoverLetterModule.clearCoverLetterResumeData();
        }
        
        // Clear localStorage
        localStorage.clear();
        
        console.log('🧹 All data cleared');
        showToast('All data cleared successfully', 'success');
    }
};

// Make debug functions available globally for console access
window.testResumeParsing = window.JobOSDebug.testResumeParsing;

console.log('📱 Job OS Main Application Module Loaded');
console.log('🔧 Debug functions available: window.JobOSDebug or window.testResumeParsing()');
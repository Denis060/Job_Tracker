// Cover Letter Generator Module
// Job OS v3.0 - AI-Powered Cover Letter Generation

// Global variables for Cover Letter
let coverLetterResumeText = '';
let coverUploadedResumeFile = null;
let currentCoverLetter = '';

// Initialize Cover Letter functionality
function initializeCoverLetter() {
    console.log('📝 Initializing Cover Letter Generator...');
    
    setupCoverLetterEventListeners();
    
    console.log('✅ Cover Letter Generator initialized');
}

// Set up event listeners
function setupCoverLetterEventListeners() {
    // PDF Upload for cover letter
    const coverPdfInput = document.getElementById('cover-resume-pdf-input');
    const coverUploadArea = document.getElementById('cover-upload-area');
    
    if (coverPdfInput && coverUploadArea) {
        coverPdfInput.addEventListener('change', handleCoverLetterResumeUpload);
        
        // Drag and drop
        coverUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            coverUploadArea.classList.add('drag-over');
        });
        
        coverUploadArea.addEventListener('dragleave', () => {
            coverUploadArea.classList.remove('drag-over');
        });
        
        coverUploadArea.addEventListener('drop', handleCoverLetterResumeDrop);
    }
    
    // Generate button
    const generateBtn = document.getElementById('generate-cover-letter-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateCoverLetterHandler);
    }
    
    // Copy button
    const copyBtn = document.getElementById('copy-cover-letter-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCoverLetter);
    }
    
    // Download button
    const downloadBtn = document.getElementById('download-cover-letter-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadCoverLetterPDF);
    }
    
    // Clear button
    const clearBtn = document.getElementById('clear-cover-resume-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCoverLetterResumeData);
    }
}

// Handle cover letter resume upload
async function handleCoverLetterResumeUpload(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        await processCoverLetterResumeFile(file);
    } else {
        showToast('Please upload a PDF file', 'error');
    }
}

// Handle drag and drop for cover letter
async function handleCoverLetterResumeDrop(event) {
    event.preventDefault();
    const uploadArea = document.getElementById('cover-upload-area');
    uploadArea.classList.remove('drag-over');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
        const pdfInput = document.getElementById('cover-resume-pdf-input');
        if (pdfInput) {
            const dt = new DataTransfer();
            dt.items.add(file);
            pdfInput.files = dt.files;
        }
        await processCoverLetterResumeFile(file);
    } else {
        showToast('Please upload a PDF file', 'error');
    }
}

// Process uploaded PDF file for cover letter
async function processCoverLetterResumeFile(file) {
    const uploadArea = document.getElementById('cover-upload-area');
    const fileInfo = document.getElementById('cover-uploaded-file-info');
    const fileName = document.getElementById('cover-file-name');
    const fileSize = document.getElementById('cover-file-size');
    
    try {
        showToast('Processing resume...', 'info');
        
        // Extract text from PDF
        const text = await extractTextFromPDF(file);
        if (text.trim()) {
            coverLetterResumeText = text;
            coverUploadedResumeFile = file;
            
            // Update UI
            if (fileName) fileName.textContent = file.name;
            if (fileSize) fileSize.textContent = formatFileSize(file.size);
            if (uploadArea) uploadArea.classList.add('hidden');
            if (fileInfo) fileInfo.classList.remove('hidden');
            
            // Populate text area
            const textInput = document.getElementById('cover-current-resume-input');
            if (textInput) {
                textInput.value = text;
            }
            
            showToast('Resume uploaded successfully!', 'success');
            console.log('✅ Cover letter resume processed:', file.name);
        } else {
            throw new Error('Could not extract text from PDF');
        }
    } catch (error) {
        console.error('❌ Error processing cover letter resume:', error);
        showToast('Error processing resume. Please try again.', 'error');
    }
}

// Get resume content for cover letter
function getCoverLetterResumeContent() {
    console.log('🔍 Checking for cover letter resume content...');
    
    // Check if user has uploaded a PDF resume for cover letter
    if (coverLetterResumeText && coverLetterResumeText.trim()) {
        console.log('✅ Using cover letter PDF resume content');
        return coverLetterResumeText;
    }
    
    // Check if user has entered text resume for cover letter
    const textInput = document.getElementById('cover-current-resume-input');
    if (textInput && textInput.value.trim()) {
        console.log('✅ Using cover letter text input resume content');
        return textInput.value.trim();
    }
    
    // Fallback: check if user has main resume content (from Smart Resume)
    if (window.SmartResumeModule && extractedResumeText && extractedResumeText.trim()) {
        console.log('✅ Using main resume content as fallback');
        return extractedResumeText;
    }
    
    // Check main resume text input as final fallback
    const mainTextInput = document.getElementById('current-resume-input');
    if (mainTextInput && mainTextInput.value.trim()) {
        console.log('✅ Using main resume text input as fallback');
        return mainTextInput.value.trim();
    }
    
    console.log('❌ No cover letter resume content found');
    return null;
}

// Generate cover letter handler
async function generateCoverLetterHandler() {
    console.log('🤖 Generate Cover Letter button clicked!');
    
    // Get job details from form
    const jobTitle = document.getElementById('cover-job-title').value.trim();
    const companyName = document.getElementById('cover-company-name').value.trim();
    const jobDescription = document.getElementById('cover-job-description').value.trim();
    
    // Validate required fields
    if (!jobTitle || !companyName) {
        showToast('Please enter job title and company name', 'error');
        return;
    }
    
    // Get resume content
    let resumeContent = getCoverLetterResumeContent();
    
    // If no cover letter specific resume, try main resume content
    if (!resumeContent) {
        console.log('🔄 No cover letter resume found, checking main resume...');
        if (extractedResumeText && extractedResumeText.trim()) {
            resumeContent = extractedResumeText;
            console.log('✅ Using main extracted resume content');
        } else {
            const mainTextInput = document.getElementById('current-resume-input');
            if (mainTextInput && mainTextInput.value.trim()) {
                resumeContent = mainTextInput.value.trim();
                console.log('✅ Using main resume text input');
            }
        }
    }
    
    if (!resumeContent) {
        showToast('Please upload your resume or paste resume text', 'error');
        return;
    }
    
    console.log('✅ Job Details - Title:', jobTitle, 'Company:', companyName);
    console.log('✅ Resume content length:', resumeContent.length);
    
    const generateBtn = document.getElementById('generate-cover-letter-btn');
    const generateText = document.getElementById('generate-cover-letter-text');
    const generateSpinner = document.getElementById('generate-cover-letter-spinner');
    
    // Show loading state
    generateBtn.disabled = true;
    if (generateText) generateText.textContent = 'Generating...';
    if (generateSpinner) generateSpinner.classList.remove('hidden');
    
    try {
        // Get user preferences
        const tone = document.getElementById('cover-letter-tone').value;
        const length = document.getElementById('cover-letter-length').value;
        const focusAreas = getFocusAreas();
        
        console.log('📋 Settings - Tone:', tone, 'Length:', length, 'Focus:', focusAreas);
        
        showToast('Creating personalized cover letter with your resume data...', 'info');
        
        // Simulate AI generation
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Create job object for generation
        const jobData = {
            position: jobTitle,
            company: companyName,
            description: jobDescription
        };
        
        const coverLetter = generatePersonalizedCoverLetter(jobData, resumeContent, tone, length, focusAreas);
        
        console.log('✅ Cover letter generated, length:', coverLetter.length);
        
        // Display the generated cover letter
        displayCoverLetter(coverLetter, jobData);
        
        showToast('Cover letter generated successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Error generating cover letter:', error);
        showToast('Failed to generate cover letter. Please try again.', 'error');
    } finally {
        // Reset button state
        generateBtn.disabled = false;
        if (generateText) generateText.textContent = 'Generate Cover Letter';
        if (generateSpinner) generateSpinner.classList.add('hidden');
    }
}

// Get focus areas from checkboxes
function getFocusAreas() {
    const focusAreas = [];
    if (document.getElementById('focus-experience').checked) focusAreas.push('experience');
    if (document.getElementById('focus-skills').checked) focusAreas.push('skills');
    if (document.getElementById('focus-passion').checked) focusAreas.push('passion');
    if (document.getElementById('focus-achievements').checked) focusAreas.push('achievements');
    return focusAreas;
}

// Generate personalized cover letter with resume data
function generatePersonalizedCoverLetter(jobData, resumeContent, tone, length, focusAreas) {
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Extract key information
    const position = jobData.position || 'the position';
    const company = jobData.company || 'your company';
    const jobDescription = jobData.description || '';
    
    // Extract user's name from resume
    const userName = extractNameFromResume(resumeContent);
    console.log('🗃️ Using name:', userName);
    
    // CRITICAL DEBUG: Show exactly what resume content we're working with
    console.log('🚨 RESUME CONTENT DEBUG:');
    console.log('🚨 Resume content type:', typeof resumeContent);
    console.log('🚨 Resume content is null/undefined:', resumeContent == null);
    console.log('🚨 Resume content length:', resumeContent ? resumeContent.length : 'N/A');
    if (resumeContent) {
        console.log('🚨 First 300 characters:', resumeContent.substring(0, 300));
        console.log('🚨 First 5 lines:', resumeContent.split('\\n').slice(0, 5));
    }
    
    // Analyze job description for keywords
    const keywords = extractKeywords(jobDescription);
    console.log('🔑 Extracted keywords:', keywords);
    
    // Extract relevant data from resume
    const relevantExperience = extractRelevantExperience(resumeContent, keywords);
    const userSkills = extractSkillsFromResume(resumeContent);
    
    console.log('📋 Extracted experience points:', relevantExperience.length, relevantExperience);
    console.log('🛠️ Extracted skills:', userSkills.length, userSkills);
    
    // Add extra debug for resume content
    console.log('📄 First 500 chars of resume:', resumeContent.substring(0, 500));
    console.log('📄 Resume lines count:', resumeContent.split('\\n').length);
    
    // Generate personalized content
    const intro = generateIntro(position, company, tone);
    const body = generateBody(position, company, jobDescription, keywords, focusAreas, tone, length, relevantExperience, userSkills);
    const closing = generateClosing(tone);
    
    return `${currentDate}

Dear Hiring Manager,

${intro}

${body}

${closing}

Sincerely,
${userName}`;
}

// Extract user's name from resume
function extractNameFromResume(resumeContent) {
    console.log('🔍 extractNameFromResume called with:', typeof resumeContent, resumeContent ? resumeContent.length : 'null/undefined');
    
    if (!resumeContent) return '[Your Name]';
    
    const lines = resumeContent.split('\\n');
    console.log('🔍 Total lines to check:', lines.length);
    console.log('🔍 First 3 lines:', lines.slice(0, 3));
    
    // Look for the first line that looks like a name
    for (let i = 0; i < Math.min(10, lines.length); i++) {
        const line = lines[i].trim();
        console.log(`🔍 Line ${i + 1}: "${line}"`);
        
        // Skip empty lines
        if (!line) continue;
        
        // First, check if the first non-empty line is just a name (like "IBRAHIM LAHAI")
        if (i < 3) {
            const words = line.split(/\\s+/);
            if (words.length >= 2 && words.length <= 4 && 
                line.length < 50 && 
                !line.includes('@') && !line.includes('|') && !line.includes('(') &&
                !line.toLowerCase().includes('summary') && 
                !line.toLowerCase().includes('profile') &&
                !line.toLowerCase().includes('street') &&
                !line.toLowerCase().includes('avenue') &&
                !/\\d/.test(line)) {
                console.log('🏷️ Extracted name from line', i + 1, ':', line);
                return line;
            }
        }
        
        // Check if this line contains contact info - if so, extract name from it
        if (line.includes('@') || line.includes('|') || line.includes('(')) {
            // Try to extract name from contact line like "Ibrahim Denis Fofanah Somerset, NJ | (732) 318 9987"
            const parts = line.split(/[|@(]/);
            if (parts.length > 0) {
                const namePart = parts[0].trim();
                const words = namePart.split(/\\s+/);
                if (words.length >= 2 && words.length <= 4 && namePart.length < 50) {
                    console.log('🏷️ Extracted name from contact line:', namePart);
                    return namePart;
                }
            }
            continue;
        }
    }
    
    console.log('🏷️ Could not extract name from resume');
    return '[Your Name]';
}

// Display the generated cover letter
function displayCoverLetter(coverLetter, jobData = null) {
    currentCoverLetter = coverLetter;
    
    const output = document.getElementById('cover-letter-output');
    const actions = document.getElementById('cover-letter-actions');
    const analysis = document.getElementById('cover-letter-analysis');
    
    // Format the cover letter with proper line breaks
    const formattedLetter = coverLetter.replace(/\\n/g, '<br>');
    output.innerHTML = `<div class="whitespace-pre-wrap font-serif leading-relaxed">${formattedLetter}</div>`;
    
    // Show action buttons
    actions.classList.remove('hidden');
    
    // Generate and show analysis
    const analysisData = analyzeCoverLetter(coverLetter, jobData);
    updateAnalysisDisplay(analysisData);
    analysis.classList.remove('hidden');
}

// Copy cover letter to clipboard
async function copyCoverLetter() {
    if (!currentCoverLetter) {
        showToast('No cover letter to copy', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(currentCoverLetter);
        showToast('Cover letter copied to clipboard!', 'success');
    } catch (error) {
        console.error('❌ Error copying to clipboard:', error);
        showToast('Failed to copy to clipboard', 'error');
    }
}

// Download cover letter as PDF
async function downloadCoverLetterPDF() {
    if (!currentCoverLetter) {
        showToast('No cover letter to download', 'error');
        return;
    }
    
    try {
        showToast('Generating PDF...', 'info');
        
        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // Format content for PDF
        const lines = pdf.splitTextToSize(currentCoverLetter, 180);
        
        // Add content to PDF
        pdf.setFontSize(12);
        pdf.text(lines, 15, 15);
        
        // Download PDF
        pdf.save('cover_letter.pdf');
        
        showToast('Cover letter downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Error downloading PDF:', error);
        showToast('Failed to download PDF. Please try again.', 'error');
    }
}

// Clear cover letter resume data
function clearCoverLetterResumeData() {
    coverLetterResumeText = '';
    coverUploadedResumeFile = null;
    
    const fileInput = document.getElementById('cover-resume-pdf-input');
    const uploadArea = document.getElementById('cover-upload-area');
    const fileInfo = document.getElementById('cover-uploaded-file-info');
    
    if (fileInput) fileInput.value = '';
    if (uploadArea) uploadArea.classList.remove('hidden');
    if (fileInfo) fileInfo.classList.add('hidden');
    
    showToast('Resume cleared', 'info');
}

// Export functions for use in other modules
window.CoverLetterModule = {
    initializeCoverLetter,
    getCoverLetterResumeContent,
    generateCoverLetterHandler,
    displayCoverLetter,
    copyCoverLetter,
    downloadCoverLetterPDF,
    clearCoverLetterResumeData
};
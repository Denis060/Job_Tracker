// Utilities Module
// Job OS v3.0 - Shared Utility Functions

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toast
    const existingToast = document.getElementById('toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm transition-all duration-300 transform translate-x-full`;
    
    // Set toast style based on type
    switch (type) {
        case 'success':
            toast.className += ' bg-green-500 text-white';
            break;
        case 'error':
            toast.className += ' bg-red-500 text-white';
            break;
        case 'warning':
            toast.className += ' bg-yellow-500 text-white';
            break;
        default:
            toast.className += ' bg-blue-500 text-white';
    }
    
    toast.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">×</button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}

// Extract keywords from job description
function extractKeywords(jobDescription) {
    if (!jobDescription) return [];
    
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should'];
    
    const words = jobDescription.toLowerCase()
        .replace(/[^a-zA-Z\\s]/g, ' ')
        .split(/\\s+/)
        .filter(word => word.length > 3 && !commonWords.includes(word));
    
    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Return top 10 most frequent words
    return Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(entry => entry[0]);
}

// Extract skills from resume
function extractSkillsFromResume(resumeContent) {
    if (!resumeContent) {
        console.log('❌ No resume content provided to extractSkillsFromResume');
        return [];
    }
    
    console.log('🔍 Analyzing resume content for skills (length:', resumeContent.length, ')');
    
    const lines = resumeContent.split('\\n');
    const skills = [];
    let inSkillsSection = false;
    let skillsHeaderFound = false;
    
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Check if we're in skills section - handle "Skills & Certifications" or "Technical Skills"
        if (trimmedLine.toUpperCase().includes('SKILLS') || 
            trimmedLine.toUpperCase().includes('TECHNICAL SKILLS') ||
            trimmedLine.toUpperCase().includes('COMPETENCIES') ||
            trimmedLine.toUpperCase().includes('TECHNOLOGIES')) {
            skillsHeaderFound = true;
            console.log('🛠️ Found skills header at line', index + 1, ':', trimmedLine);
        }
        
        // Look for "Technical Skills" subsection specifically
        if (skillsHeaderFound && trimmedLine.toUpperCase().includes('TECHNICAL SKILLS')) {
            inSkillsSection = true;
            console.log('🛠️ Entering technical skills section at line', index + 1, ':', trimmedLine);
            return;
        }
        
        // Check if we've moved to another section after skills
        if (inSkillsSection && (trimmedLine.toUpperCase().includes('PROFESSIONAL COMPETENCIES') ||
            trimmedLine.toUpperCase().includes('CERTIFICATIONS') ||
            trimmedLine.toUpperCase().includes('REFERENCES') ||
            trimmedLine.toUpperCase().includes('EDUCATION') ||
            trimmedLine.toUpperCase().includes('EXPERIENCE'))) {
            console.log('🛠️ Leaving skills section at line', index + 1, ':', trimmedLine);
            inSkillsSection = false;
            return;
        }
        
        // Extract skills - handle bullet points
        if (inSkillsSection && (trimmedLine.startsWith('●') || trimmedLine.startsWith('•') || trimmedLine.startsWith('-'))) {
            let skillLine = trimmedLine.replace(/^[●•\\-]\\s*/, '');
            
            // Clean up the skill name (remove extra text)
            skillLine = skillLine.trim();
            
            if (skillLine.length > 1) {
                skills.push(skillLine);
                console.log('✅ Added skill:', skillLine);
            }
        }
    });
    
    // Remove duplicates and clean up
    const uniqueSkills = [...new Set(skills)].filter(skill => 
        skill.length > 1 && !skill.toLowerCase().includes('&')
    ).map(skill => skill.trim());
    
    console.log('🛠️ Total skills extracted:', uniqueSkills.length, uniqueSkills);
    return uniqueSkills.slice(0, 8); // Return top 8 skills
}

// Extract relevant experience from resume for cover letter
function extractRelevantExperience(resumeContent, keywords) {
    if (!resumeContent) {
        console.log('❌ No resume content provided to extractRelevantExperience');
        return [];
    }
    
    console.log('🔍 Analyzing resume content for experience (length:', resumeContent.length, ')');
    console.log('🔍 Looking for keywords:', keywords);
    
    const lines = resumeContent.split('\\n');
    const relevantExperience = [];
    let inExperienceSection = false;
    
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Check if we're in experience section
        if (trimmedLine.toUpperCase().includes('EXPERIENCE') && 
            !trimmedLine.toUpperCase().includes('YEARS OF EXPERIENCE')) {
            inExperienceSection = true;
            console.log('📋 Found experience section at line', index + 1, ':', trimmedLine);
            return;
        }
        
        // Check if we've moved to another section
        if (inExperienceSection && (trimmedLine.toUpperCase().includes('EDUCATION') ||
            trimmedLine.toUpperCase().includes('SKILLS') ||
            trimmedLine.toUpperCase().includes('CERTIFICATIONS') ||
            trimmedLine.toUpperCase().includes('REFERENCES'))) {
            console.log('📋 Leaving experience section at line', index + 1, ':', trimmedLine);
            inExperienceSection = false;
            return;
        }
        
        // Extract relevant bullet points from experience
        if (inExperienceSection && (trimmedLine.startsWith('●') || trimmedLine.startsWith('•') || trimmedLine.startsWith('-'))) {
            const cleanedExperience = trimmedLine.replace(/^[●•\\-]\\s*/, '');
            
            // Check if this experience point contains relevant keywords or is accounting-related
            const hasRelevantKeyword = keywords.length === 0 || keywords.some(keyword => 
                cleanedExperience.toLowerCase().includes(keyword.toLowerCase())
            );
            
            // Always include accounting/finance-related experience
            const isAccountingRelated = cleanedExperience.toLowerCase().includes('accounting') ||
                                       cleanedExperience.toLowerCase().includes('payroll') ||
                                       cleanedExperience.toLowerCase().includes('payable') ||
                                       cleanedExperience.toLowerCase().includes('receivable') ||
                                       cleanedExperience.toLowerCase().includes('financial') ||
                                       cleanedExperience.toLowerCase().includes('tax') ||
                                       cleanedExperience.toLowerCase().includes('reconciliation') ||
                                       cleanedExperience.toLowerCase().includes('quickbooks') ||
                                       cleanedExperience.toLowerCase().includes('invoice');
            
            if (hasRelevantKeyword || isAccountingRelated || relevantExperience.length < 4) {
                relevantExperience.push(cleanedExperience);
                console.log('✅ Added experience:', cleanedExperience.substring(0, 60) + '...');
            }
        }
    });
    
    console.log('📋 Total experience points extracted:', relevantExperience.length);
    return relevantExperience.slice(0, 4); // Return top 4 relevant experiences
}

// Generate intro paragraph for cover letter
function generateIntro(position, company, tone) {
    const templates = {
        professional: `I am writing to express my strong interest in the ${position} position at ${company}. With my proven track record and relevant experience, I am confident that I would be a valuable addition to your team.`,
        enthusiastic: `I am thrilled to apply for the ${position} role at ${company}! Your company's reputation for excellence and innovation makes this opportunity incredibly exciting, and I am eager to contribute my skills and passion to your team.`,
        confident: `As an accomplished professional, I am writing to apply for the ${position} position at ${company}. My extensive experience and proven results make me an ideal candidate for this role.`,
        conversational: `I hope this letter finds you well! I'm reaching out because I'm genuinely excited about the ${position} opportunity at ${company}. From what I've learned about your organization, it seems like a perfect fit for my background and interests.`
    };
    
    return templates[tone] || templates.professional;
}

// Generate body content for cover letter
function generateBody(position, company, jobDescription, keywords, focusAreas, tone, length, relevantExperience = [], userSkills = []) {
    let bodyParagraphs = [];
    
    // Experience paragraph - now uses actual resume data
    if (focusAreas.includes('experience')) {
        bodyParagraphs.push(generateExperienceParagraph(tone, keywords, relevantExperience));
    }
    
    // Skills paragraph - now uses actual resume skills
    if (focusAreas.includes('skills')) {
        bodyParagraphs.push(generateSkillsParagraph(tone, keywords, userSkills));
    }
    
    // Passion paragraph
    if (focusAreas.includes('passion')) {
        bodyParagraphs.push(generatePassionParagraph(company, tone));
    }
    
    // Achievements paragraph - enhanced with resume data
    if (focusAreas.includes('achievements')) {
        bodyParagraphs.push(generateAchievementsParagraph(tone, relevantExperience));
    }
    
    // Ensure we have at least one paragraph
    if (bodyParagraphs.length === 0) {
        bodyParagraphs.push(generateExperienceParagraph(tone, keywords, relevantExperience));
    }
    
    // Adjust length based on preference
    if (length === 'concise' && bodyParagraphs.length > 2) {
        bodyParagraphs = bodyParagraphs.slice(0, 2);
    } else if (length === 'detailed' && bodyParagraphs.length < 3) {
        bodyParagraphs.push(generateCompanyParagraph(company, tone));
    }
    
    return bodyParagraphs.join('\\n\\n');
}

// Generate experience paragraph
function generateExperienceParagraph(tone, keywords, relevantExperience = []) {
    // Use actual resume experience if available
    if (relevantExperience.length > 0) {
        const experienceText = relevantExperience.slice(0, 2).join('. ') + '.';
        
        const templates = {
            professional: `In my professional experience, I have ${experienceText} These accomplishments demonstrate my ability to deliver results and add value to your organization.`,
            enthusiastic: `I'm excited to share some highlights from my background! ${experienceText} I'm passionate about bringing this same energy and success to your team.`,
            confident: `My track record includes significant achievements: ${experienceText} I'm confident in my ability to deliver similar results for ${keywords.length > 0 ? keywords[0] : 'your organization'}.`,
            conversational: `Let me share a bit about what I've accomplished: ${experienceText} I think these experiences would translate really well to this role.`
        };
        
        return templates[tone] || templates.professional;
    }
    
    // Fallback to generic experience paragraph
    const templates = {
        professional: `In my previous roles, I have developed strong expertise which directly aligns with the requirements of this position. My experience has taught me the importance of delivering high-quality results while maintaining excellent stakeholder relationships.`,
        enthusiastic: `Throughout my career, I've had the privilege of working on diverse and challenging projects that have shaped my professional growth. Each role has added to my skill set and passion for excellence!`,
        confident: `My professional journey has been marked by consistent success and recognition. I have repeatedly exceeded expectations and delivered measurable results that have contributed to organizational growth.`,
        conversational: `Over the years, I've been fortunate to work in various environments that have really shaped who I am as a professional. Each experience has taught me something valuable that I carry forward.`
    };
    
    return templates[tone] || templates.professional;
}

// Generate skills paragraph
function generateSkillsParagraph(tone, keywords, userSkills = []) {
    let skillsText = 'technical and soft skills';
    
    // Use actual skills if available
    if (userSkills.length > 0) {
        skillsText = userSkills.slice(0, 4).join(', ');
    }
    
    const templates = {
        professional: `My skill set encompasses ${skillsText}, which I believe are essential for success in this role. I am committed to continuous learning and staying current with industry best practices to ensure I can contribute effectively from day one.`,
        enthusiastic: `I'm particularly excited about how my skills in ${skillsText} align perfectly with what you're looking for! I love staying up-to-date with the latest trends and technologies in our field.`,
        confident: `I bring expertise in ${skillsText}, skills that have been instrumental in my professional success. My technical proficiency and problem-solving abilities enable me to tackle complex challenges effectively.`,
        conversational: `When it comes to skills, I'm pretty comfortable with ${skillsText}. I enjoy the challenge of learning new technologies and approaches, and I think that curiosity serves me well in dynamic work environments.`
    };
    
    return templates[tone] || templates.professional;
}

// Generate passion paragraph
function generatePassionParagraph(company, tone) {
    const templates = {
        professional: `I am particularly drawn to ${company} because of your commitment to innovation and excellence. I believe that my values align closely with your organizational culture, and I am excited about the opportunity to contribute to your continued success.`,
        enthusiastic: `What really excites me about ${company} is your incredible reputation and the amazing work you're doing! I've been following your recent projects and achievements, and I would be absolutely thrilled to be part of such a dynamic team.`,
        confident: `${company} stands out as an industry leader, and that's exactly the type of organization where I can make the greatest impact. I'm confident that my expertise and drive would be valuable assets to your team.`,
        conversational: `Honestly, ${company} has been on my radar for a while now, and everything I've learned just reinforces my interest. From your company culture to your innovative projects, it seems like the kind of place where I could really grow and contribute.`
    };
    
    return templates[tone] || templates.professional;
}

// Generate achievements paragraph  
function generateAchievementsParagraph(tone, relevantExperience = []) {
    let achievementText = 'consistently delivered exceptional results and exceeded performance targets';
    
    // Use actual experience if available
    if (relevantExperience.length > 1) {
        achievementText = relevantExperience.slice(-2).join(' and ');
    }
    
    const templates = {
        professional: `Throughout my career, I have ${achievementText}. These achievements reflect my commitment to excellence and my ability to drive meaningful outcomes for organizations.`,
        enthusiastic: `I'm really proud of how I've ${achievementText}! These experiences have not only been professionally rewarding but have also fueled my passion for making a positive impact.`,
        confident: `My professional achievements include ${achievementText}. These results demonstrate my ability to execute strategies effectively and deliver value that drives organizational success.`,
        conversational: `Looking back on my career, I'm pleased that I've been able to ${achievementText}. It's been really fulfilling to see the positive impact of my work, and I'm excited to bring that same dedication to a new opportunity.`
    };
    
    return templates[tone] || templates.professional;
}

// Generate company-specific paragraph
function generateCompanyParagraph(company, tone) {
    const templates = {
        professional: `I have researched ${company} extensively and am impressed by your commitment to innovation and customer satisfaction. I believe my background and experience would enable me to contribute meaningfully to your continued success.`,
        enthusiastic: `Everything I've learned about ${company} has only increased my excitement about this opportunity! From your company culture to your innovative approach to business, it's clear that this is where I want to build my career.`,
        confident: `${company} is clearly a leader in the industry, and I am confident that my expertise and drive would be valuable assets to your organization. I am ready to hit the ground running and make an immediate impact.`,
        conversational: `From what I've seen, ${company} seems like the kind of place where I could really thrive. I appreciate companies that value both results and relationships, and I think that's exactly what you've built there.`
    };
    
    return templates[tone] || templates.professional;
}

// Generate closing paragraph
function generateClosing(tone) {
    const templates = {
        professional: `I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's success. Thank you for considering my application, and I look forward to hearing from you soon.`,
        enthusiastic: `I would absolutely love the chance to discuss this opportunity with you further! Thank you so much for your time and consideration – I'm really hoping we can connect soon to talk about how I can contribute to your amazing team.`,
        confident: `I am confident that I would be a valuable addition to your team and would welcome the opportunity to discuss this role in detail. I look forward to demonstrating how I can contribute to your organization's continued success.`,
        conversational: `I'd really enjoy the chance to chat with you about this role and learn more about your team. Thanks for taking the time to consider my application – I hope we can connect soon!`
    };
    
    return templates[tone] || templates.professional;
}

// Analyze cover letter content
function analyzeCoverLetter(content, jobData = null) {
    const words = content.split(/\\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const paragraphs = content.split(/\\n\\s*\\n/).filter(para => para.trim().length > 0);
    
    // Calculate readability score (simplified Flesch Reading Ease)
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = 1.5; // Simplified assumption
    const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    // Determine readability level
    let readabilityLevel = 'Graduate';
    if (readabilityScore >= 60) readabilityLevel = 'Standard';
    if (readabilityScore >= 70) readabilityLevel = 'Fairly Easy';
    if (readabilityScore >= 80) readabilityLevel = 'Easy';
    
    // Analyze tone
    const enthusiasticWords = ['excited', 'thrilled', 'passionate', 'amazing', 'incredible', 'love'];
    const professionalWords = ['experience', 'qualified', 'skills', 'professional', 'accomplished'];
    const confidentWords = ['confident', 'proven', 'successfully', 'achieved', 'expert'];
    
    let toneScore = {
        professional: 0,
        enthusiastic: 0,
        confident: 0
    };
    
    const lowerContent = content.toLowerCase();
    enthusiasticWords.forEach(word => {
        if (lowerContent.includes(word)) toneScore.enthusiastic++;
    });
    professionalWords.forEach(word => {
        if (lowerContent.includes(word)) toneScore.professional++;
    });
    confidentWords.forEach(word => {
        if (lowerContent.includes(word)) toneScore.confident++;
    });
    
    const dominantTone = Object.keys(toneScore).reduce((a, b) => 
        toneScore[a] > toneScore[b] ? a : b
    );
    
    return {
        wordCount: words.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        readabilityScore: Math.round(readabilityScore),
        readabilityLevel: readabilityLevel,
        dominantTone: dominantTone,
        toneScores: toneScore
    };
}

// Update analysis display
function updateAnalysisDisplay(analysisData) {
    const analysisSection = document.getElementById('cover-letter-analysis');
    if (!analysisSection) return;
    
    analysisSection.innerHTML = `
        <div class="bg-white p-6 rounded-lg border">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">📊 Cover Letter Analysis</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-2xl font-bold text-indigo-600">${analysisData.wordCount}</div>
                    <div class="text-sm text-gray-600">Words</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">${analysisData.readabilityScore}</div>
                    <div class="text-sm text-gray-600">Readability Score</div>
                    <div class="text-xs text-gray-500">${analysisData.readabilityLevel}</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600 capitalize">${analysisData.dominantTone}</div>
                    <div class="text-sm text-gray-600">Dominant Tone</div>
                </div>
            </div>
        </div>
    `;
}

// Format file size utility
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Close all open modals
function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Remove any stacked dialogs or overlays
    document.querySelectorAll('[role="dialog"], .modal-overlay, .popup-overlay').forEach(element => {
        if (element.style.display !== 'none') {
            element.style.display = 'none';
        }
        element.remove();
    });
    
    // Clear any body overflow restrictions
    document.body.style.overflow = '';
}

// Prevent multiple modals from stacking
function openModal(modalId) {
    // Close any existing modals first
    closeAllModals();
    
    // Open the requested modal
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Tab switching functionality
function switchTab(tabElement) {
    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });
    
    // Add active class to clicked tab
    tabElement.classList.add('active-tab');
    
    // Hide all views
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show selected view
    const targetView = document.getElementById(tabElement.dataset.tab + '-view');
    if (targetView) {
        targetView.classList.remove('hidden');
    }
}
    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });
    
    // Add active class to clicked tab
    tabElement.classList.add('active-tab');
    
    // Hide all views
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show selected view
    const targetView = document.getElementById(tabElement.dataset.tab + '-view');
    if (targetView) {
        targetView.classList.remove('hidden');
    }
}

// Export utility functions
window.UtilsModule = {
    showToast,
    extractKeywords,
    extractSkillsFromResume,
    extractRelevantExperience,
    generateIntro,
    generateBody,
    generateClosing,
    analyzeCoverLetter,
    updateAnalysisDisplay,
    formatFileSize,
    switchTab,
    closeAllModals,
    openModal
};
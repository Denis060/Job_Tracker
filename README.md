# Job OS - AI-Powered Career Management Platform

The most intelligent career management platform ever built - featuring AI-powered resume tailoring, smart task automation, and seamless calendar integration.

## ✨ NEW: Smart Resume AI (v3.0)

- **🤖 AI Resume Tailoring**: Instantly optimize your resume for any job description
- **🎯 Keyword Optimization**: Automatically incorporate job-specific keywords
- **📄 ATS-Friendly**: Ensure your resume passes applicant tracking systems
- **⚡ One-Click Generation**: Transform your resume in seconds
- **💾 Multiple Formats**: Copy, download, or integrate with your workflow

## 🚀 Complete Feature Set

### **AI-Powered Intelligence**
- **🤖 Smart To-Do List**: AI-generated tasks based on your application status
- **⏰ Automated Reminders**: Never miss a follow-up or interview prep
- **📅 Calendar Integration**: Automatic event creation for interviews
- **📝 Resume Tailoring**: AI-powered resume optimization for specific jobs
- **🎯 Proactive Suggestions**: Get notified when to reconnect with contacts
- **📊 Priority Management**: Smart task prioritization with visual indicators
- **🔄 Status-Aware**: Tasks automatically adjust based on application progress

## Core Features

- **📊 Dashboard Overview**: Visual metrics and application funnel chart
- **💼 Job Application Tracker**: 
  - Table and Kanban board views
  - Document upload (resume, cover letter)
  - Status tracking and drag-and-drop organization
- **🌐 Network Manager**: Contact management for recruiters and professional connections
- **📚 Work History**: Complete employment history tracking
- **☁️ Real-time Data**: Firebase integration for cloud storage and sync

## How the Intelligence Works

### 🔥 Automatic Task Generation

**Follow-up Reminders**: 
- Automatically creates "Follow up with [Company]" tasks one week after applying
- Only triggers for applications still "Waiting for response"

**Interview Preparation**: 
- Generates research and prep tasks when status changes to any interview stage
- High priority with 2-day deadline

**Thank You Notes**: 
- Creates reminder to send thank you emails after interviews
- High priority with 24-hour deadline

**Networking Outreach**: 
- Suggests reconnecting with contacts you haven't spoken to in 3+ months
- Low priority with flexible timeline

### � AI Resume Tailoring

**Revolutionary Resume Optimization**:
- Paste any job description and your current resume
- AI analyzes requirements and optimizes your resume instantly
- Incorporates relevant keywords naturally throughout
- Maintains your authentic experience while highlighting relevant skills

**Professional Features**:
- **ATS Optimization**: Ensures your resume passes applicant tracking systems
- **Keyword Integration**: Strategic placement of job-specific terms
- **Impact Enhancement**: Transforms descriptions with action verbs and metrics
- **Format Optimization**: Clean, professional structure for maximum readability
- **Multiple Export Options**: Copy to clipboard or download as text file

### 🧠 How It Works

**Smart Analysis Process**:
1. **Job Analysis**: AI extracts key requirements, skills, and keywords from job description
2. **Resume Parsing**: Understands your experience, skills, and achievements
3. **Intelligent Matching**: Identifies the best ways to highlight relevant qualifications
4. **Content Optimization**: Rewrites and enhances content for maximum impact
5. **Keyword Integration**: Naturally incorporates job-specific terms throughout
6. **Final Polish**: Ensures professional formatting and ATS compatibility

**Automatic Event Creation**:
- Interview dates automatically create calendar events
- Support for Google Calendar, Outlook, and Apple Calendar
- Smart event details with preparation tips

**Premium Features**:
- **Event Details**: Company, position, interview type, and location
- **Smart Reminders**: 24-hour advance notifications
- **Preparation Tips**: Built-in interview prep checklist
- **Multiple Formats**: Google Calendar links, .ics files, or copy-paste
- **Visual Indicators**: See upcoming interviews at a glance

## Technology Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Charts**: Chart.js for data visualization
- **Icons**: Heroicons (via Tailwind CSS)
- **Fonts**: Inter from Google Fonts

## Setup Instructions

### Prerequisites
- A Firebase project with the following services enabled:
  - Authentication (Anonymous sign-in)
  - Firestore Database
  - Cloud Storage

### Installation

1. Clone or download this project
2. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication with Anonymous sign-in
   - Create a Firestore database
   - Enable Cloud Storage
   - Get your Firebase configuration

3. Update Firebase Configuration:
   - Open `index.html`
   - Find the `userProvidedConfig` object around line 436
   - Replace with your Firebase project configuration

4. Deploy:
   - For local development: Open `index.html` in a web browser
   - For production: Upload to any web hosting service

### Firebase Setup Details

1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Anonymous" authentication

2. **Firestore Database**:
   - Create database in production mode
   - The app will automatically create the required collections

3. **Storage**:
   - Set up Cloud Storage with default rules
   - Used for resume and cover letter uploads

## Usage

1. **Dashboard**: View your application metrics and visual funnel
2. **Job Tracker**: 
   - Add new job applications with detailed information
   - Switch between table and board views
   - Drag cards between columns in board view
   - Upload and manage documents
3. **Network Manager**: Track professional contacts and relationships
4. **Work History**: Maintain a complete employment record

## Project Structure

```
Job_OS/
├── index.html          # Main application file
├── README.md           # This file
├── LICENSE             # MIT License
├── .gitignore          # Git ignore file
├── package.json        # Project metadata and scripts
├── assets/             # Static assets
│   ├── images/         # Image files
│   └── icons/          # Icon files
├── docs/               # Documentation
│   ├── user-guide.md   # User documentation
│   └── screenshots/    # Application screenshots
└── deployment/         # Deployment configurations
    ├── netlify.toml    # Netlify configuration
    └── vercel.json     # Vercel configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainer.

## Roadmap

- [ ] Mobile app version
- [ ] Advanced analytics and reporting
- [ ] Integration with job boards
- [ ] Email notifications and reminders
- [ ] Export functionality (PDF, CSV)
- [ ] Team collaboration features
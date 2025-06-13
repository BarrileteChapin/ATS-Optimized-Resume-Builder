# Professional CV Generator - ATS-Optimized Resume Builder

A modern, web-based CV generator designed to create ATS (Applicant Tracking System) optimized resumes that help job seekers pass automated screening systems and land interviews.

## 🎯 What is This Project?

This is a simple CV/Resume builder that helps job seekers create professional resumes optimized for Applicant Tracking Systems (ATS). The application provides real-time ATS scoring, multiple professional templates, and generates both PDF and plain text versions of your resume.

## 🤖 Understanding ATS Systems

### What is an ATS?

An **Applicant Tracking System (ATS)** is software used by over 75% of companies to automatically screen, parse, and rank job applications before they reach human recruiters. These systems:

- **Parse resume content** using OCR (Optical Character Recognition) technology⁷
- **Extract structured data** (contact info, work experience, education, skills)
- **Match keywords** from job descriptions to resume content using Boolean search
- **Score and rank candidates** based on relevance and keyword density
- **Filter out resumes** that don't meet minimum criteria through "knockout questions"
- **Only pass top-ranked resumes** to human recruiters (often just the top 10-20%)

Popular ATS platforms include Workday, Greenhouse, Taleo (Oracle), iCIMS, Lever, and SmartRecruiters.

### Why ATS Optimization Matters

- **Up to 75% of resumes** are rejected by ATS before human review¹
- **Over 75% of companies** now use some form of ATS²
- **98% of Fortune 500 companies** use ATS systems³
- Even qualified candidates get filtered out due to poor ATS compatibility
- Nearly 9 out of 10 U.S. workers believe their applications were discarded despite being capable⁴

## 📊 How Our ATS Score is Calculated

Our ATS scoring algorithm simulates real-world ATS systems by evaluating multiple factors that actual ATS platforms consider:

### Scoring Breakdown (Total: 100 points)

| Factor | Points | Description |
|--------|--------|-------------|
| **Contact Information** | 20 pts | Complete contact details (name, email, phone, location) |
| **Professional Summary** | 15 pts | Well-written summary (minimum 50 characters) |
| **Work Experience** | 35 pts | Multiple experiences (10 pts each, max 25) + quantified achievements (10 pts) |
| **Education** | 10 pts | Educational background included |
| **Skills** | 15 pts | Adequate skills listed (10 pts for 3+ skills, 5 pts bonus for 6+ skills) |
| **Additional Sections** | 5 pts | Certifications, projects, or languages included |

### Score Interpretation

- **80-100%**: Excellent ATS compatibility - High chance of passing screening
- **60-79%**: Good compatibility - Likely to pass with minor improvements
- **Below 60%**: Needs improvement - May be filtered out by ATS

### Data-Based Simulation

Our scoring algorithm is based on research from:
- Harvard Business School's "Hidden Workers: Untapped Talent" study (2021)⁴
- ATS vendor documentation and industry analysis
- Recruiter surveys and hiring best practices
- Analysis of successful resume patterns from career counseling organizations

### How Real ATS Systems Work

When you submit a resume online, here's what actually happens:

1. **Resume Upload & Parsing**: Your file is scanned using OCR technology to extract text
2. **Data Extraction**: The system identifies and categorizes information (name, contact, experience, etc.)
3. **Keyword Matching**: Your resume is compared against the job description using Boolean search
4. **Scoring & Ranking**: You receive a compatibility score (often 0-100 or star ratings)
5. **Filtering**: Only top-ranked candidates (typically top 10-20%) are shown to recruiters
6. **Human Review**: Recruiters review the filtered list, not all applications

**Important**: If your resume scores low, it may never be seen by a human recruiter, regardless of your qualifications.

**Note**: This is a simulation based on industry data and best practices. Actual ATS systems may vary in their specific algorithms and criteria, as most companies keep their exact scoring methods proprietary.

## ✨ Features

### 🎨 Professional Templates
- **Classic Chronological**: Traditional ATS-optimized format
- **Modern Clean**: Contemporary design with subtle accents
- **Professional Minimal**: Clean, minimalist black and white design

### 📝 Comprehensive Sections
- Contact Information
- Professional Summary with character counter
- Work Experience with achievement tracking
- Education with GPA options
- Skills categorization and proficiency levels
- Optional sections (Certifications, Projects, Languages)
- Custom sections (up to 4 additional sections)

### 🔍 ATS Optimization Features
- Real-time ATS score calculation
- Keyword optimization guidance
- ATS-friendly formatting
- Standard section headers
- Clean, parseable layouts

### 📄 Export Options
- **PDF Download**: Professional formatted resume
- **Plain Text (.txt)**: ATS-compatible version for online applications

### 🎯 Smart Features
- Live preview with instant updates
- Form validation and error checking
- Responsive design for all devices
- Character counters for optimal length
- Date formatting and validation

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required - runs entirely in the browser

### Running the Application

1. **Clone or download** this repository
2. **Open `index.html`** in your web browser
3. **Start building** your resume using the form interface
4. **Preview** your resume in real-time
5. **Download** your optimized resume in PDF or TXT format

### File Structure
```
├── index.html          # Main application interface
├── app.js             # Core application logic and ATS scoring
├── style.css          # Styling and responsive design
└── README.md          # This documentation
```

## 🎯 How to Use

### Step 1: Choose Your Template
Select from three professional templates optimized for different industries and preferences.

### Step 2: Fill Out Your Information
Navigate through the sections using the sidebar:
- **Contact**: Essential contact information
- **Summary**: Professional summary (aim for 50-400 characters)
- **Experience**: Work history with quantified achievements
- **Education**: Academic background
- **Skills**: Technical and soft skills with proficiency levels
- **Optional**: Additional sections for certifications, projects, etc.
- **Custom**: Add up to 4 custom sections

### Step 3: Monitor Your ATS Score
Watch your ATS score improve as you add information. Aim for 80%+ for optimal results.

### Step 4: Download Your Resume
- **PDF**: For human recruiters and networking
- **TXT**: For online job applications and ATS systems

## 💡 ATS Optimization Tips

### ✅ Do's
- Use standard section headers (Experience, Education, Skills)
- Include keywords from job descriptions
- Quantify achievements with numbers and percentages
- Use simple, clean formatting
- List experience in reverse chronological order
- Include both hard and soft skills
- Use standard fonts (Arial, Calibri, Times New Roman)

### ❌ Don'ts
- Avoid graphics, images, or charts
- Don't use tables or complex layouts
- Avoid fancy fonts or excessive formatting
- Don't use headers/footers for important information
- Avoid abbreviations without spelling them out
- Don't keyword stuff unnaturally

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Responsive design and styling
- **Vanilla JavaScript**: Core functionality and interactivity
- **jsPDF**: PDF generation library
- **Local Storage**: Optional data persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- Lightweight: ~50KB total size
- Fast loading: No external dependencies except PDF library
- Responsive: Works on desktop, tablet, and mobile devices

## 📈 ATS Research & Data Sources

Our ATS scoring and optimization recommendations are based on verified research and industry data:

### Primary Sources:

1. **Harvard Business School & Accenture Study**: ["Hidden Workers: Untapped Talent" (2021)](https://www.hbs.edu/managing-the-future-of-work/Documents/research/hiddenworkers09032021.pdf)⁴
   - Found that over 90% of employers use AI tools (ATS) for filtering candidates
   - Nearly 9 out of 10 workers believe capable applications are discarded by ATS
   - Executives acknowledge ATS tools prevent them from seeing great candidates

2. **Industry Analysis**: Research from resume optimization platforms and ATS vendors⁵⁶
   - Analysis of major ATS platforms (Workday, Greenhouse, Taleo, iCIMS, Lever)
   - Keyword matching and parsing technology documentation
   - Boolean search functionality used by recruiters

3. **Recruiter Insights**: Professional feedback from HR practitioners⁷⁸
   - Real-world ATS usage patterns and screening criteria
   - Common resume parsing issues and formatting problems
   - Hiring manager preferences and decision-making processes

### Key Statistics Verified:
- **75% of resumes never seen by humans** due to ATS filtering¹
- **Over 75% of companies** use ATS systems²
- **40% of employers** confirmed using ATS for initial screening³
- **98% of Fortune 500 companies** utilize some form of automated screening³

## 🤝 Contributing

This is an open-source project. Contributions are welcome! Areas for improvement:
- Additional template designs
- Enhanced ATS scoring algorithms
- New export formats
- Accessibility improvements
- Internationalization
- Scalability (breaking down the js file)

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support & FAQ

### Common Issues

**Q: Why is my ATS score low?**
A: Ensure you have complete contact information, a professional summary, detailed work experience with achievements, and relevant skills listed.

**Q: Which file format should I use for job applications?**
A: Use PDF for human recruiters and the TXT version for online applications through company websites.

**Q: How accurate is the ATS scoring?**
A: Our scoring is a simulation based on industry research and best practices. Actual ATS systems may vary, but following our recommendations will improve your chances significantly.

**Q: Can I save my progress?**
A: The application saves your data locally in your browser. For permanent storage, download your resume files.

---

## 📚 References

1. [How to Get Your Resume Past AI Screening Systems - LinkedIn](https://www.linkedin.com/pulse/how-get-your-resume-past-ai-screening-systems-inside-guide-cammarata-syfef)
2. [How ATS Really Works in 2025 - ResumeAdapter](https://www.resumeadapter.com/blog/Inside-ats-algorithm-explained)
3. [What is ATS and How Does It Work? - Wisedoc](https://www.wisedoc.net/blogs/what's-ats-how-it-works/)
4. Fuller, J. B., Raman, M., Sage-Gavin, E., & Hines, K. (2021). ["Hidden Workers: Untapped Talent"](https://www.hbs.edu/managing-the-future-of-work/Documents/research/hiddenworkers09032021.pdf). Harvard Business School & Accenture.
5. [The Applicant Tracking System Algorithm - HigherMe](https://higherme.com/blog/the-applicant-tracking-system-algorithm-everything-you-need-to-know)
6. [How to Beat Applicant Tracking Software - Resume Solutions](https://www.resume-solutions.com.au/how-to-beat-applicant-tracking-software-ats-the-definitive-guide/)
7. [Understanding How The ATS Reads Your Resume - Kristen Fife](https://kristenfife.medium.com/understanding-how-the-ats-reads-and-interacts-with-your-resume-401bd00b66db)
8. [Why You Didn't Hear Back: ATS Systems - College Recruiter](https://www.collegerecruiter.com/blog/2025/04/01/why-you-didnt-hear-back-how-applicant-tracking-systems-score-rank-and-quietly-reject-job-seekers)

---

**Built with ❤️ for job seekers everywhere. Good luck with your job search!**
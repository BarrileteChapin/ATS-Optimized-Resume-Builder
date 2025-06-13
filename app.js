// CV Generator Application
class CVGenerator {
    constructor() {
        this.currentTemplate = 'classic';
        this.cvData = {
            contact: {},
            summary: '',
            experience: [],
            education: [],
            skills: [],
            certifications: '',
            projects: '',
            languages: ''
        };
        
        this.templates = {
            classic: {
                name: 'Classic Chronological',
                fontFamily: 'Arial, sans-serif',
                primaryColor: '#000000',
                accentColor: '#333333'
            },
            modern: {
                name: 'Modern Clean',
                fontFamily: 'Calibri, sans-serif',
                primaryColor: '#2c3e50',
                accentColor: '#3498db'
            },
            minimal: {
                name: 'Professional Minimal',
                fontFamily: 'Times New Roman, serif',
                primaryColor: '#000000',
                accentColor: '#666666'
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.updatePreview();
        this.updateATSScore();
    }

    bindEvents() {
        // Template selection
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const template = e.currentTarget.dataset.template;
                this.switchTemplate(template);
            });
        });

        // Section navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Form inputs
        document.getElementById('cv-form').addEventListener('input', (e) => {
            this.handleFormInput(e);
        });

        // Ensure skills changes always update preview (for dynamic fields)
        document.getElementById('skills-container').addEventListener('input', (e) => {
            this.updateComplexData();
            this.updatePreview();
            this.updateATSScore();
        });
        document.getElementById('skills-container').addEventListener('change', (e) => {
            this.updateComplexData();
            this.updatePreview();
            this.updateATSScore();
        });

        // Add/Remove buttons
        document.getElementById('add-experience').addEventListener('click', () => this.addExperience());
        document.getElementById('add-education').addEventListener('click', () => this.addEducation());
        document.getElementById('add-skill').addEventListener('click', () => this.addSkill());

        // Add Extra Section functionality
        const addExtraSectionBtn = document.getElementById('add-extra-section');
        if (addExtraSectionBtn) {
            addExtraSectionBtn.addEventListener('click', () => {
                const container = document.getElementById('extra-sections-container');
                const currentSections = container.querySelectorAll('.extra-section-item').length;
                if (currentSections < 4) {
                    const extraSectionHTML = `
                        <div class="extra-section-item">
                            <div class="form-group">
                                <label class="form-label">Section Title</label>
                                <input type="text" name="extraSectionTitle" class="form-control" placeholder="e.g. Volunteering, Publications">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Section Content</label>
                                <textarea name="extraSectionContent" class="form-control" rows="3" placeholder="• Description or list of items"></textarea>
                            </div>
                            <button type="button" class="btn btn--outline btn--sm remove-extra-section">Remove</button>
                        </div>
                    `;
                    container.insertAdjacentHTML('beforeend', extraSectionHTML);
                    this.updateComplexData();
                    this.updatePreview();
                    this.updateATSScore();
                }
            });
        }

        // Remove Extra Section (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-extra-section')) {
                const item = e.target.closest('.extra-section-item');
                if (item && document.querySelectorAll('.extra-section-item').length > 1) {
                    item.remove();
                    this.updateComplexData();
                    this.updatePreview();
                    this.updateATSScore();
                }
            }
        });

        // PDF and TXT Download
        document.getElementById('download-pdf').addEventListener('click', () => this.downloadPDF());
        document.getElementById('download-txt').addEventListener('click', () => this.downloadTXT());

        // Character counter for summary
        document.getElementById('summary').addEventListener('input', (e) => {
            this.updateCharCounter(e.target);
        });

        // Current job checkbox handling
        document.addEventListener('change', (e) => {
            if (e.target.name === 'currentJob') {
                const endDateInput = e.target.closest('.experience-item').querySelector('input[name="endDate"]');
                if (e.target.checked) {
                    endDateInput.disabled = true;
                    endDateInput.value = '';
                } else {
                    endDateInput.disabled = false;
                }
                this.updateComplexData();
                this.updatePreview();
                this.updateATSScore();
            }
        });
    }

    switchTemplate(templateName) {
        if (!this.templates[templateName]) return;

        this.currentTemplate = templateName;
        
        // Update active button
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-template="${templateName}"]`).classList.add('active');

        // Update preview
        const preview = document.getElementById('cv-preview');
        preview.className = `cv-preview ${templateName}-template`;
        
        this.updatePreview();
    }

    switchSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        document.getElementById(sectionId).classList.add('active');

        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    }

    handleFormInput(e) {
        const { name, value, type, checked } = e.target;
        
        // Handle different input types
        if (type === 'checkbox') {
            return; // Handled separately
        }

        // Update data based on input location
        if (e.target.closest('#contact-section')) {
            this.cvData.contact[name] = value;
        } else if (name === 'summary') {
            this.cvData.summary = value;
        } else if (name === 'certifications') {
            this.cvData.certifications = value;
        } else if (name === 'projects') {
            this.cvData.projects = value;
        } else if (name === 'languages') {
            this.cvData.languages = value;
        }

        // Handle experience, education, skills
        this.updateComplexData();
        
        // Update preview and validation
        this.updatePreview();
        this.validateForm();
        this.updateATSScore();
    }

    updateComplexData() {
        // Update experience data
        this.cvData.experience = [];
        document.querySelectorAll('.experience-item').forEach(item => {
            const exp = {
                jobTitle: item.querySelector('input[name="jobTitle"]').value,
                company: item.querySelector('input[name="company"]').value,
                startDate: item.querySelector('input[name="startDate"]').value,
                endDate: item.querySelector('input[name="endDate"]').value,
                currentJob: item.querySelector('input[name="currentJob"]').checked,
                achievements: item.querySelector('textarea[name="achievements"]').value
            };
            if (exp.jobTitle || exp.company) {
                this.cvData.experience.push(exp);
            }
        });

        // Update education data
        this.cvData.education = [];
        document.querySelectorAll('.education-item').forEach(item => {
            const edu = {
                degree: item.querySelector('input[name="degree"]').value,
                institution: item.querySelector('input[name="institution"]').value,
                startYear: item.querySelector('input[name="startYear"]') ? item.querySelector('input[name="startYear"]').value : '',
                graduationYear: item.querySelector('input[name="graduationYear"]').value,
                gpa: item.querySelector('input[name="gpa"]').value
            };
            if (edu.degree || edu.institution) {
                this.cvData.education.push(edu);
            }
        });

        // Extra sections (up to 4, dynamic)
        this.cvData.extraSections = [];
        const extraSectionItems = document.querySelectorAll('#extra-sections-container .extra-section-item');
        let i = 1;
        extraSectionItems.forEach(item => {
            const titleInput = item.querySelector('input[name="extraSectionTitle"]');
            const contentInput = item.querySelector('textarea[name="extraSectionContent"]');
            if (titleInput && contentInput) {
                const title = titleInput.value.trim();
                const content = contentInput.value.trim();
                if (title && content) {
                    this.cvData.extraSections.push({ title, content });
                }
            }
            i++;
        });

        // Update skills data
        this.cvData.skills = [];
        document.querySelectorAll('.skill-item').forEach(item => {
            const skill = {
                name: item.querySelector('input[name="skillName"]').value,
                category: item.querySelector('select[name="skillCategory"]').value,
                level: item.querySelector('select[name="skillLevel"]').value
            };
            if (skill.name) {
                this.cvData.skills.push(skill);
            }
        });
    }

    addExperience() {
        const container = document.getElementById('experience-container');
        const experienceHTML = `
            <div class="experience-item">
                <div class="form-group">
                    <label class="form-label">Job Title *</label>
                    <input type="text" name="jobTitle" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Company Name *</label>
                    <input type="text" name="company" class="form-control" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Start Date</label>
                        <input type="month" name="startDate" class="form-control">
                    </div>
                    <div class="form-group">
                        <label class="form-label">End Date</label>
                        <input type="month" name="endDate" class="form-control">
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="currentJob"> Currently employed here
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Key Achievements</label>
                    <textarea name="achievements" class="form-control" rows="3" 
                              placeholder="• Increased sales by 25% through strategic client outreach&#10;• Led a team of 8 developers on critical project delivery&#10;• Implemented new processes that reduced costs by $50K annually"></textarea>
                </div>
                <button type="button" class="btn btn--outline btn--sm remove-experience">Remove</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', experienceHTML);
    }

    removeExperience(item) {
        if (document.querySelectorAll('.experience-item').length > 1) {
            item.remove();
            this.updateComplexData();
            this.updatePreview();
            this.updateATSScore();
        }
    }

    addEducation() {
        const container = document.getElementById('education-container');
        const educationHTML = `
            <div class="education-item">
                <div class="form-group">
                    <label class="form-label">Degree *</label>
                    <input type="text" name="degree" class="form-control" placeholder="Bachelor of Science in Computer Science" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Institution *</label>
                    <input type="text" name="institution" class="form-control" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Start Year</label>
                        <input type="number" name="startYear" class="form-control" min="1950" max="2030">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Graduation Year</label>
                        <input type="number" name="graduationYear" class="form-control" min="1950" max="2030">
                    </div>
                    <div class="form-group">
                        <label class="form-label">GPA (Optional)</label>
                        <input type="number" name="gpa" class="form-control" step="0.01" min="0" max="4.0" placeholder="3.5">
                    </div>
                </div>
                <button type="button" class="btn btn--outline btn--sm remove-education">Remove</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', educationHTML);
    }

    removeEducation(item) {
        if (document.querySelectorAll('.education-item').length > 1) {
            item.remove();
            this.updateComplexData();
            this.updatePreview();
            this.updateATSScore();
        }
    }

    addSkill() {
        const container = document.getElementById('skills-container');
        const skillHTML = `
            <div class="skill-item">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Skill</label>
                        <input type="text" name="skillName" class="form-control" placeholder="JavaScript">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select name="skillCategory" class="form-control">
                            <option value="Technical Skills">Technical Skills</option>
                            <option value="Software Proficiency">Software Proficiency</option>
                            <option value="Programming Languages">Programming Languages</option>
                            <option value="Communication">Communication</option>
                            <option value="Leadership">Leadership</option>
                            <option value="Project Management">Project Management</option>
                            <option value="Languages">Languages</option>
                            <option value="Industry-Specific">Industry-Specific</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Level</label>
                        <select name="skillLevel" class="form-control">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                </div>
                <button type="button" class="btn btn--outline btn--sm remove-skill">Remove</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', skillHTML);
    }

    removeSkill(item) {
        if (document.querySelectorAll('.skill-item').length > 1) {
            item.remove();
            this.updateComplexData();
            this.updatePreview();
            this.updateATSScore();
        }
    }

    updateCharCounter(textarea) {
        const maxLength = 400;
        const currentLength = textarea.value.length;
        const counter = textarea.parentNode.querySelector('.char-counter');
        if (counter) {
            counter.textContent = `${currentLength}/${maxLength} characters`;
            if (currentLength > maxLength) {
                counter.style.color = 'var(--color-error)';
            } else {
                counter.style.color = 'var(--color-text-secondary)';
            }
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        // Parse year and month manually to avoid timezone issues
        const [year, month] = dateString.split('-').map(Number);
        if (!year || !month) return '';
        // month is 1-based from input, so subtract 1 for Date
        const date = new Date(year, month - 1);
        // Use toLocaleString for month name
        return date.toLocaleString('en-US', { year: 'numeric', month: 'long' });
    }

    updatePreview() {
        const preview = document.getElementById('cv-preview');
        const data = this.cvData;

        let html = '';

        // Header
        if (data.contact.fullName || data.contact.email || data.contact.phone) {
            html += '<div class="cv-header">';
            if (data.contact.fullName) {
                html += `<div class="cv-name">${this.escapeHtml(data.contact.fullName)}</div>`;
            }
            html += '<div class="cv-contact">';
            if (data.contact.email) {
                html += `<span class="cv-contact-item">📧 ${this.escapeHtml(data.contact.email)}</span>`;
            }
            if (data.contact.phone) {
                html += `<span class="cv-contact-item">📞 ${this.escapeHtml(data.contact.phone)}</span>`;
            }
            if (data.contact.location) {
                html += `<span class="cv-contact-item">📍 ${this.escapeHtml(data.contact.location)}</span>`;
            }
            if (data.contact.linkedin) {
                html += `<span class="cv-contact-item">🔗 LinkedIn Profile</span>`;
            }
            html += '</div>';
            html += '</div>';
        }

        // Professional Summary
        if (data.summary) {
            html += '<div class="cv-section">';
            html += '<div class="cv-section-title">Professional Summary</div>';
            html += `<div class="cv-summary">${this.escapeHtml(data.summary).replace(/\n/g, '<br>')}</div>`;
            html += '</div>';
        }

        // Work Experience
        if (data.experience.length > 0) {
            html += '<div class="cv-section">';
            html += '<div class="cv-section-title">Work Experience</div>';
            
            const sortedExperience = [...data.experience].sort((a, b) => new Date(b.startDate || '1900-01') - new Date(a.startDate || '1900-01'));
            sortedExperience.forEach(exp => {
                if (exp.jobTitle || exp.company) {
                    html += '<div class="cv-experience-item">';
                    html += '<div class="cv-job-header">';
                    html += '<div>';
                    if (exp.jobTitle) {
                        html += `<div class="cv-job-title">${this.escapeHtml(exp.jobTitle)}</div>`;
                    }
                    if (exp.company) {
                        html += `<div class="cv-company">${this.escapeHtml(exp.company)}</div>`;
                    }
                    html += '</div>';
                    if (exp.startDate || exp.endDate || exp.currentJob) {
                        html += '<div class="cv-dates">';
                        const startDate = this.formatDate(exp.startDate);
                        const endDate = exp.currentJob ? 'Present' : this.formatDate(exp.endDate);
                        if (startDate && endDate) {
                            html += `${startDate} - ${endDate}`;
                        } else if (startDate) {
                            html += startDate;
                        } else if (endDate && !exp.currentJob) {
                            html += endDate;
                        }
                        html += '</div>';
                    }
                    html += '</div>';
                    if (exp.achievements) {
                        html += '<div class="cv-achievements">';
                        const achievements = exp.achievements.split('\n').filter(line => line.trim());
                        if (achievements.length > 0) {
                            html += '<ul>';
                            achievements.forEach(achievement => {
                                const cleaned = achievement.replace(/^[•\-\*]\s*/, '').trim();
                                if (cleaned) {
                                    html += `<li>${this.escapeHtml(cleaned)}</li>`;
                                }
                            });
                            html += '</ul>';
                        }
                        html += '</div>';
                    }
                    html += '</div>';
                }
            });
            html += '</div>';
        }

        // Education
        if (data.education.length > 0) {
            html += '<div class="cv-section">';
            html += '<div class="cv-section-title">Education</div>';
            
            const sortedEducation = [...data.education].sort((a, b) => (parseInt(b.graduationYear) || 0) - (parseInt(a.graduationYear) || 0));
            sortedEducation.forEach(edu => {
                if (edu.degree || edu.institution) {
                    html += '<div class="cv-education-item">';
                    html += '<div class="cv-education-header">';
                    html += '<div>';
                    if (edu.degree) {
                        html += `<div class="cv-degree">${this.escapeHtml(edu.degree)}</div>`;
                    }
                    if (edu.institution) {
                        html += `<div class="cv-institution">${this.escapeHtml(edu.institution)}</div>`;
                    }
                    html += '</div>';
                    if (edu.startYear || edu.graduationYear || edu.gpa) {
                        html += '<div class="cv-dates">';
                        const parts = [];
                        if (edu.startYear) parts.push(`${edu.startYear}`);
                        if (edu.graduationYear) parts.push(`${edu.graduationYear}`);
                        if (edu.gpa) parts.push(`GPA: ${edu.gpa}`);
                        html += parts.join(' - ');
                        html += '</div>';
                    }
                    html += '</div>';
                    html += '</div>';
                }
            });
            html += '</div>';
        }

        // Skills
        if (data.skills.length > 0) {
            html += '<div class="cv-section">';
            html += '<div class="cv-section-title">Skills</div>';
            
            const skillsByCategory = {};
            data.skills.forEach(skill => {
                if (!skillsByCategory[skill.category]) {
                    skillsByCategory[skill.category] = [];
                }
                skillsByCategory[skill.category].push(skill);
            });

            html += '<div class="cv-skills-grid">';
            Object.entries(skillsByCategory).forEach(([category, skills]) => {
                html += '<div class="cv-skill-category">';
                html += `<div class="cv-skill-category-title">${this.escapeHtml(category)}</div>`;
                skills.forEach(skill => {
                    html += '<div class="cv-skill-item">';
                    html += `<span>${this.escapeHtml(skill.name)}</span>`;
                    html += `<span class="cv-skill-level">${this.escapeHtml(skill.level)}</span>`;
                    html += '</div>';
                });
                html += '</div>';
            });
            html += '</div>';
            html += '</div>';
        }

        // Additional sections
        const additionals = [
            { title: 'Certifications', content: data.certifications },
            { title: 'Notable Projects', content: data.projects },
            { title: 'Languages', content: data.languages }
        ];

        additionals.forEach(section => {
            if (section.content && section.content.trim()) {
                html += '<div class="cv-section">';
                html += `<div class="cv-section-title">${section.title}</div>`;
                const items = section.content.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    html += '<ul>';
                    items.forEach(item => {
                        const cleaned = item.replace(/^[•\-\*]\s*/, '').trim();
                        if (cleaned) {
                            html += `<li>${this.escapeHtml(cleaned)}</li>`;
                        }
                    });
                    html += '</ul>';
                }
                html += '</div>';
            }
        });

        // Extra Sections (up to 4, dynamic)
        if (Array.isArray(data.extraSections)) {
            data.extraSections.forEach(section => {
                if (section.title && section.content) {
                    html += '<div class="cv-section">';
                    html += `<div class="cv-section-title">${this.escapeHtml(section.title)}</div>`;
                    const items = section.content.split('\n').filter(line => line.trim());
                    if (items.length > 0) {
                        html += '<ul>';
                        items.forEach(item => {
                            const cleaned = item.replace(/^[•\-\*]\s*/, '').trim();
                            if (cleaned) {
                                html += `<li>${this.escapeHtml(cleaned)}</li>`;
                            }
                        });
                        html += '</ul>';
                    }
                    html += '</div>';
                }
            });
        }

        preview.innerHTML = html;
    }

    validateForm() {
        const errors = [];
        
        const requiredFields = [
            { field: 'fullName', message: 'Full name is required' },
            { field: 'email', message: 'Email is required' },
            { field: 'phone', message: 'Phone number is required' }
        ];

        requiredFields.forEach(({ field, message }) => {
            const input = document.querySelector(`input[name="${field}"]`);
            if (!input.value.trim()) {
                input.classList.add('error');
                errors.push(message);
            } else {
                input.classList.remove('error');
            }
        });

        const emailInput = document.querySelector('input[name="email"]');
        if (emailInput.value && !this.isValidEmail(emailInput.value)) {
            emailInput.classList.add('error');
            errors.push('Please enter a valid email address');
        }

        if (this.cvData.experience.length === 0 || !this.cvData.experience.some(exp => exp.jobTitle && exp.company)) {
            errors.push('At least one work experience is required');
        }

        return errors.length === 0;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    updateATSScore() {
        let score = 0;
        const maxScore = 100;

        if (this.cvData.contact.fullName) score += 5;
        if (this.cvData.contact.email && this.isValidEmail(this.cvData.contact.email)) score += 5;
        if (this.cvData.contact.phone) score += 5;
        if (this.cvData.contact.location) score += 5;
        if (this.cvData.summary && this.cvData.summary.length >= 50) score += 15;
        if (this.cvData.experience.length > 0) {
            score += Math.min(this.cvData.experience.length * 10, 25);
            const hasQuantifiedAchievements = this.cvData.experience.some(exp => exp.achievements && /\d+/.test(exp.achievements));
            if (hasQuantifiedAchievements) score += 10;
        }
        if (this.cvData.education.length > 0) score += 10;
        if (this.cvData.skills.length >= 3) score += 10;
        if (this.cvData.skills.length >= 6) score += 5;
        if (this.cvData.certifications || this.cvData.projects || this.cvData.languages) score += 5;

        const percentage = Math.min(Math.round((score / maxScore) * 100), 100);
        document.getElementById('ats-score-value').textContent = `${percentage}%`;
        
        const scoreElement = document.getElementById('ats-score-value');
        if (percentage >= 80) {
            scoreElement.style.color = 'var(--color-success)';
        } else if (percentage >= 60) {
            scoreElement.style.color = 'var(--color-warning)';
        } else {
            scoreElement.style.color = 'var(--color-error)';
        }
    }

    downloadPDF() {
        if (!this.validateForm()) {
            alert('Please fill in all required fields before downloading.');
            return;
        }
    
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'letter' });
    
        const data = this.cvData;
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40;
        const contentWidth = pageWidth - (margin * 2);
        let cursorY = margin;
    
        let styles = {};
        switch (this.currentTemplate) {
            case 'modern':
                styles = {
                    font: 'helvetica', nameSize: 26, nameColor: '#2c3e50',
                    contactSize: 10, contactColor: '#5a6c7d', sectionTitleSize: 12,
                    sectionTitleColor: '#2c3e50', accentColor: '#3498db', bodyColor: '#333333',
                    companyColor: '#5a6c7d', jobTitleSize: 11, degreeSize: 11,
                };
                break;
            case 'minimal':
                styles = {
                    font: 'times', nameSize: 22, nameColor: '#000000',
                    contactSize: 10, contactColor: '#666666', sectionTitleSize: 11,
                    sectionTitleColor: '#000000', bodyColor: '#333333',
                    companyColor: '#555555', jobTitleSize: 10, degreeSize: 10,
                };
                break;
            case 'classic':
            default:
                styles = {
                    font: 'helvetica', nameSize: 24, nameColor: '#000000',
                    contactSize: 10, contactColor: '#333333', sectionTitleSize: 11,
                    sectionTitleColor: '#000000', accentColor: '#333333',
                    bodyColor: '#333333', companyColor: '#555555', jobTitleSize: 10, degreeSize: 10,
                };
                break;
        }
    
        const checkPageBreak = (spaceNeeded) => {
            if (cursorY + spaceNeeded > pageHeight - margin) {
                doc.addPage();
                cursorY = margin;
            }
        };
    
        // --- RENDER HEADER ---
        const headerStartY = cursorY;
        let headerEndY;
        let nameX, nameAlign;
        if (this.currentTemplate === 'minimal') {
            nameX = pageWidth / 2;
            nameAlign = 'center';
        } else {
            nameX = margin;
            nameAlign = 'left';
        }

        // Modern template: draw background and blue line first, then text
        if (this.currentTemplate === 'modern') {
            // Estimate header height
            let tempY = cursorY;
            tempY += styles.nameSize * 1.1;
            tempY += styles.contactSize * 1.5;
            const headerHeight = tempY - headerStartY + 20; // +20 for extra bottom padding
            // Draw background
            doc.setFillColor('#f8f9fa').rect(margin - 10, headerStartY - 25, contentWidth + 20, headerHeight, 'F');
            // Draw blue line
            doc.setDrawColor(styles.accentColor).setLineWidth(4).line(margin - 10, headerStartY - 25, margin - 10, headerStartY - 25 + headerHeight);
        }

        // Draw header text (always after background)
        doc.setFont(styles.font, 'bold').setFontSize(styles.nameSize).setTextColor(styles.nameColor);
        doc.text(data.contact.fullName, nameX, cursorY, { align: nameAlign });
        cursorY += styles.nameSize * 1.1;

        const contactInfo = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin].filter(Boolean).join(' | ');
        doc.setFont(styles.font, 'normal').setFontSize(styles.contactSize).setTextColor(styles.contactColor);
        doc.text(contactInfo, nameX, cursorY, { align: nameAlign });
        cursorY += styles.contactSize * 1.5;
        headerEndY = cursorY;

        // Add extra bottom padding for modern template
        if (this.currentTemplate === 'modern') {
            cursorY += 20;
        } else {
            doc.setDrawColor(styles.accentColor || '#000000').setLineWidth(this.currentTemplate === 'classic' ? 2 : 1).line(margin, cursorY, pageWidth - margin, cursorY);
            cursorY += 15;
        }
    
        // --- RENDER SECTION TITLE HELPER ---
        const renderSectionTitle = (title) => {
            checkPageBreak(30);
            doc.setFont(styles.font, 'bold').setFontSize(styles.sectionTitleSize).setTextColor(styles.sectionTitleColor);
            const titleX = this.currentTemplate === 'minimal' ? pageWidth / 2 : margin;
            const titleAlign = this.currentTemplate === 'minimal' ? 'center' : 'left';
            doc.text(title.toUpperCase(), titleX, cursorY, { align: titleAlign });
            cursorY += 5;
            if (this.currentTemplate !== 'minimal') {
                const lineWidth = this.currentTemplate === 'modern' ? 2 : 1;
                const lineColor = this.currentTemplate === 'modern' ? styles.accentColor : styles.accentColor || '#333333';
                doc.setDrawColor(lineColor).setLineWidth(lineWidth).line(margin, cursorY, pageWidth - margin, cursorY);
            }
            cursorY += 15;
        };

        // --- RENDER SECTIONS ---
        if (data.summary) {
            renderSectionTitle('Professional Summary');
            doc.setFont(styles.font, 'normal').setFontSize(10).setTextColor(styles.bodyColor);
            const lines = doc.splitTextToSize(data.summary, contentWidth);
            checkPageBreak(lines.length * 12);
            doc.text(lines, margin, cursorY);
            cursorY += (lines.length * 12) + 10;
        }

        if (data.experience.length > 0) {
            renderSectionTitle('Work Experience');
            const sortedExperience = [...data.experience].sort((a, b) => new Date(b.startDate || '1900-01') - new Date(a.startDate || '1900-01'));
            sortedExperience.forEach(exp => {
                checkPageBreak(60);
                doc.setFont(styles.font, 'bold').setFontSize(styles.jobTitleSize).setTextColor(styles.bodyColor);
                doc.text(exp.jobTitle, margin, cursorY);

                const dateText = `${this.formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : this.formatDate(exp.endDate)}`;
                doc.setFont(styles.font, 'normal').setFontSize(9).setTextColor(styles.companyColor);
                doc.text(dateText, pageWidth - margin, cursorY, { align: 'right' });
                cursorY += 12;

                doc.setFont(styles.font, 'italic').setFontSize(10).setTextColor(styles.companyColor);
                doc.text(exp.company, margin, cursorY);
                cursorY += 14;

                if (exp.achievements) {
                    doc.setFont(styles.font, 'normal').setFontSize(10).setTextColor(styles.bodyColor);
                    const achievementsList = exp.achievements.split('\n').filter(line => line.trim());
                    achievementsList.forEach(ach => {
                        const achievementText = `• ${ach.replace(/^[•\-\*]\s*/, '').trim()}`;
                        const lines = doc.splitTextToSize(achievementText, contentWidth - 10);
                        checkPageBreak(lines.length * 12);
                        doc.text(lines, margin + 10, cursorY);
                        cursorY += (lines.length * 12);
                    });
                }
                cursorY += 10;
            });
        }
        
        if (data.education.length > 0) {
            renderSectionTitle('Education');
            const sortedEducation = [...data.education].sort((a, b) => (parseInt(b.graduationYear) || 0) - (parseInt(a.graduationYear) || 0));
            sortedEducation.forEach(edu => {
                checkPageBreak(40);
                doc.setFont(styles.font, 'bold').setFontSize(styles.degreeSize).setTextColor(styles.bodyColor);
                doc.text(edu.degree, margin, cursorY);
                let details = '';
                if (edu.startYear) details += `Start: ${edu.startYear}`;
                if (edu.graduationYear) details += (details ? ' | ' : '') + `Graduation: ${edu.graduationYear}`;
                if (edu.gpa) details += (details ? ' | ' : '') + `GPA: ${edu.gpa}`;
                doc.setFont(styles.font, 'normal').setFontSize(9).setTextColor(styles.companyColor);
                doc.text(details, pageWidth - margin, cursorY, { align: 'right' });
                cursorY += 12;
                doc.setFont(styles.font, 'italic').setFontSize(10).setTextColor(styles.companyColor);
                doc.text(edu.institution, margin, cursorY);
                cursorY += 20;
            });
        }
        
        if (data.skills.length > 0) {
            renderSectionTitle('Skills');
            const skillsByCategory = {};
            data.skills.forEach(skill => {
                if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
                skillsByCategory[skill.category].push(skill);
            });

            // --- 4 columns for skills ---
            const numColumns = Math.min(4, Object.keys(skillsByCategory).length || 1);
            const columnWidth = (contentWidth / numColumns) - 10;
            let columns = Array.from({ length: numColumns }, () => []);
            let i = 0;
            Object.entries(skillsByCategory).forEach(([category, skills]) => {
                columns[i % numColumns].push({ category, skills });
                i++;
            });

            // Find max rows in any column
            const maxRows = Math.max(...columns.map(col => col.length));
            let startY = cursorY;
            for (let row = 0; row < maxRows; row++) {
                let tempY = startY;
                for (let col = 0; col < numColumns; col++) {
                    const x = margin + col * (columnWidth + 10);
                    if (columns[col][row]) {
                        const { category, skills } = columns[col][row];
                        doc.setFont(styles.font, 'bold').setFontSize(9).setTextColor(styles.companyColor);
                        doc.text(category, x, tempY + 12);
                        doc.setFont(styles.font, 'normal').setFontSize(9).setTextColor(styles.bodyColor);
                        let skillY = tempY + 24;
                        skills.forEach(skill => {
                            doc.text(`${skill.name} (${skill.level})`, x + 5, skillY);
                            skillY += 12;
                        });
                        // Update tempY if this column is tallest
                        if (skillY > cursorY) cursorY = skillY;
                    }
                }
                startY = cursorY + 5;
            }
            cursorY += 15; // Add extra spacing after Skills section
        }

        const optionalSections = [
            { title: 'Certifications', data: data.certifications },
            { title: 'Notable Projects', data: data.projects },
            { title: 'Languages', data: data.languages }
        ];

        optionalSections.forEach(section => {
            if(section.data && section.data.trim()) {
                renderSectionTitle(section.title);
                doc.setFont(styles.font, 'normal').setFontSize(10).setTextColor(styles.bodyColor);
                const listItems = section.data.split('\n').filter(line => line.trim());
                listItems.forEach(item => {
                    const text = `• ${item.replace(/^[•\-\*]\s*/, '').trim()}`;
                    const lines = doc.splitTextToSize(text, contentWidth - 10);
                    checkPageBreak(lines.length * 12);
                    doc.text(lines, margin + 10, cursorY);
                    cursorY += (lines.length * 12);
                });
                cursorY += 10;
            }
        });

        // Extra Sections (up to 4, dynamic)
        if (Array.isArray(data.extraSections)) {
            data.extraSections.forEach(section => {
                if (section.title && section.content) {
                    renderSectionTitle(section.title);
                    doc.setFont(styles.font, 'normal').setFontSize(10).setTextColor(styles.bodyColor);
                    const listItems = section.content.split('\n').filter(line => line.trim());
                    listItems.forEach(item => {
                        const text = `• ${item.replace(/^[•\-\*]\s*/, '').trim()}`;
                        const lines = doc.splitTextToSize(text, contentWidth - 10);
                        checkPageBreak(lines.length * 12);
                        doc.text(lines, margin + 10, cursorY);
                        cursorY += (lines.length * 12);
                    });
                    cursorY += 10;
                }
            });
        }

        const fileName = `${this.cvData.contact.fullName || 'CV'}_Resume.pdf`.replace(/[^a-zA-Z0-9_\-.]/g, '_');
        doc.save(fileName);
    }
    
    downloadTXT() {
        if (!this.validateForm()) {
            alert('Please fill in all required fields before downloading.');
            return;
        }
    
        const data = this.cvData;
        let content = '';
    
        const addSection = (title, body) => {
            if (body && body.trim()) {
                content += `\n\n--- ${title.toUpperCase()} ---\n\n`;
                content += `${body.trim()}\n`;
            }
        };
    
        if (data.contact.fullName) content += `${data.contact.fullName}\n`;
        const contactLine = [data.contact.email, data.contact.phone, data.contact.location].filter(Boolean).join(' | ');
        if (contactLine) content += `${contactLine}\n`;
        if (data.contact.linkedin) content += `LinkedIn: ${data.contact.linkedin}\n`;
    
        addSection('Professional Summary', data.summary);
    
        if (data.experience.length > 0) {
            let expBody = '';
            const sortedExperience = [...data.experience].sort((a, b) => new Date(b.startDate || '1900-01') - new Date(a.startDate || '1900-01'));
            sortedExperience.forEach(exp => {
                if (exp.jobTitle && exp.company) {
                    expBody += `${exp.jobTitle} at ${exp.company}\n`;
                    const startDate = exp.startDate ? this.formatDate(exp.startDate) : '';
                    const endDate = exp.currentJob ? 'Present' : (exp.endDate ? this.formatDate(exp.endDate) : '');
                    if (startDate || endDate) {
                        expBody += `${startDate} to ${endDate}\n`;
                    }
                    if (exp.achievements) {
                        const achievements = exp.achievements.split('\n')
                            .map(line => `  • ${line.replace(/^[•\-\*]\s*/, '').trim()}`)
                            .filter(line => line.length > 4)
                            .join('\n');
                        expBody += `${achievements}\n\n`;
                    }
                }
            });
            addSection('Work Experience', expBody);
        }
        
        if (data.education.length > 0) {
            let eduBody = '';
            const sortedEducation = [...data.education].sort((a, b) => (parseInt(b.graduationYear) || 0) - (parseInt(a.graduationYear) || 0));
            sortedEducation.forEach(edu => {
                if (edu.degree && edu.institution) {
                    eduBody += `${edu.degree}, ${edu.institution}\n`;
                    const details = [edu.graduationYear, edu.gpa ? `GPA: ${edu.gpa}` : ''].filter(Boolean).join(' | ');
                    if (details) {
                        eduBody += `${details}\n\n`;
                    }
                }
            });
            addSection('Education', eduBody);
        }
    
        if (data.skills.length > 0) {
            let skillsBody = '';
            const skillsByCategory = {};
            data.skills.forEach(skill => {
                if (!skillsByCategory[skill.category]) {
                    skillsByCategory[skill.category] = [];
                }
                skillsByCategory[skill.category].push(skill.name);
            });
            Object.entries(skillsByCategory).forEach(([category, skills]) => {
                skillsBody += `${category}: ${skills.join(', ')}\n`;
            });
            addSection('Skills', skillsBody);
        }
    
        const cleanList = (text) => text.split('\n').map(line => `  • ${line.replace(/^[•\-\*]\s*/, '').trim()}`).filter(line => line.length > 4).join('\n');
        addSection('Certifications', data.certifications ? cleanList(data.certifications) : '');
        addSection('Notable Projects', data.projects ? cleanList(data.projects) : '');
        addSection('Languages', data.languages ? cleanList(data.languages) : '');
    
        // Extra Sections (up to 4, dynamic)
        if (Array.isArray(data.extraSections)) {
            data.extraSections.forEach(section => {
                if (section.title && section.content) {
                    let sectionBody = section.content.split('\n').map(line => `  • ${line.replace(/^[•\-\*]\s*/, '').trim()}`)
                        .filter(line => line.length > 4).join('\n');
                    addSection(section.title, sectionBody);
                }
            });
        }
    
        const blob = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileName = `${data.contact.fullName || 'CV'}_Resume.txt`.replace(/[^a-zA-Z0-9_\-.]/g, '_');
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof jspdf === 'undefined') {
        console.warn('jsPDF library not loaded - PDF export will not work');
    }
    
    new CVGenerator();
});
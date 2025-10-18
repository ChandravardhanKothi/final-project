// ===== GLOBAL VARIABLES =====
let selectedFile = null;
let isPhotoUploaded = false;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// ===== PAGE NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeEnquiryForm();
    initializeCalendar();
    initializeOtherPageTabs();
    initializeMachineryRental();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target page from href
            const targetPage = this.getAttribute('href').substring(1);
            
            // Remove active class from all pages and links
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // Add active class to clicked link and target page
            this.classList.add('active');
            document.getElementById(targetPage).classList.add('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ===== ENQUIRY FORM =====
function initializeEnquiryForm() {
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    const previewImage = document.getElementById('previewImage');
    const uploadControls = document.getElementById('uploadControls');
    const contactForm = document.getElementById('contactForm');
    
    if (uploadBox) {
        uploadBox.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', previewFile);
    }
    
    // Upload button
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', uploadPhoto);
    }
    
    // Change button
    const changeBtn = document.querySelector('.change-btn');
    if (changeBtn) {
        changeBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function previewFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    if (file) {
        selectedFile = file;
        reader.onload = function(e) {
            const preview = document.getElementById('previewImage');
            const uploadBox = document.getElementById('uploadBox');
            const uploadControls = document.getElementById('uploadControls');
            
            preview.src = e.target.result;
            preview.classList.add('show');
            uploadBox.classList.add('has-image');
            uploadControls.classList.add('show');
            
            // Hide upload instructions
            const uploadIcon = uploadBox.querySelector('.upload-icon');
            const uploadText = uploadBox.querySelector('.upload-text');
            const uploadHint = uploadBox.querySelector('.upload-hint');
            
            if (uploadIcon) uploadIcon.style.display = 'none';
            if (uploadText) uploadText.style.display = 'none';
            if (uploadHint) uploadHint.style.display = 'none';
            
            isPhotoUploaded = false;
        }
        reader.readAsDataURL(file);
    }
}

function uploadPhoto() {
    if (selectedFile) {
        isPhotoUploaded = true;
        
        const uploadBtn = document.querySelector('.upload-btn');
        if (uploadBtn) {
            uploadBtn.textContent = 'Photo Uploaded ✓';
            uploadBtn.style.background = '#4a7c2c';
        }
        
        setTimeout(() => {
            alert('Photo uploaded successfully! You can now submit your enquiry.');
        }, 300);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (selectedFile && !isPhotoUploaded) {
        alert('Please upload the photo before submitting the form.');
        return;
    }
    
    alert('Thank you for your enquiry! Our team will contact you within 24 hours.');
    
    // Reset form
    e.target.reset();
    resetPhotoUpload();
}

function resetPhotoUpload() {
    const preview = document.getElementById('previewImage');
    const uploadBox = document.getElementById('uploadBox');
    const uploadControls = document.getElementById('uploadControls');
    
    if (preview) preview.classList.remove('show');
    if (uploadBox) uploadBox.classList.remove('has-image');
    if (uploadControls) uploadControls.classList.remove('show');
    
    const uploadIcon = uploadBox?.querySelector('.upload-icon');
    const uploadText = uploadBox?.querySelector('.upload-text');
    const uploadHint = uploadBox?.querySelector('.upload-hint');
    
    if (uploadIcon) uploadIcon.style.display = 'block';
    if (uploadText) uploadText.style.display = 'block';
    if (uploadHint) uploadHint.style.display = 'block';
    
    selectedFile = null;
    isPhotoUploaded = false;
    
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.textContent = 'Upload Photo';
        uploadBtn.style.background = '';
    }
}

// ===== CALENDAR =====
function initializeCalendar() {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }
    
    renderCalendar();
}

function renderCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const monthYearDisplay = document.getElementById('current-month-year');
    if (monthYearDisplay) {
        monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    const calendarDates = document.getElementById('calendar-dates');
    if (!calendarDates) return;
    
    calendarDates.innerHTML = '';
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'calendar-date';
        emptyDiv.style.visibility = 'hidden';
        calendarDates.appendChild(emptyDiv);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'calendar-date';
        dateDiv.textContent = day;
        
        // Check if today
        if (day === today.getDate() && 
            currentMonth === today.getMonth() && 
            currentYear === today.getFullYear()) {
            dateDiv.classList.add('today');
        }
        
        dateDiv.addEventListener('click', function() {
            // Remove selected from all dates
            document.querySelectorAll('.calendar-date').forEach(d => {
                d.classList.remove('selected');
            });
            
            // Add selected to clicked date
            this.classList.add('selected');
            
            // Show selected date info
            showSelectedDateInfo(day, currentMonth, currentYear);
        });
        
        calendarDates.appendChild(dateDiv);
    }
}

function showSelectedDateInfo(day, month, year) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const selectedDateSection = document.getElementById('selected-date-info');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    
    if (selectedDateSection && selectedDateDisplay) {
        selectedDateDisplay.textContent = `${monthNames[month]} ${day}, ${year}`;
        selectedDateSection.style.display = 'block';
        
        // Simulate weather data (in real app, this would come from API)
        updateWeatherDisplay();
        
        // Scroll to the section
        selectedDateSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function updateWeatherDisplay() {
    // Simulate random weather data
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
    const icons = ['☀️', '⛅', '☁️', '🌧️'];
    const randomIndex = Math.floor(Math.random() * conditions.length);
    
    const temp = Math.floor(Math.random() * 15) + 20;
    const humidity = Math.floor(Math.random() * 40) + 40;
    const wind = Math.floor(Math.random() * 15) + 5;
    const rainfall = Math.floor(Math.random() * 30);
    const uv = Math.floor(Math.random() * 8) + 1;
    
    document.getElementById('weather-icon-display').textContent = icons[randomIndex];
    document.getElementById('temperature-display').textContent = `${temp}°C`;
    document.getElementById('condition-display').textContent = conditions[randomIndex];
    document.getElementById('humidity-display').textContent = `${humidity}%`;
    document.getElementById('wind-display').textContent = `${wind} km/h`;
    document.getElementById('rainfall-display').textContent = `${rainfall}%`;
    document.getElementById('uv-display').textContent = uv;
}

// ===== CROP PLANNING =====
const cropPlanningForm = document.getElementById('crop-planning-form');
if (cropPlanningForm) {
    cropPlanningForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const crop = document.getElementById('crop-select').value;
        const duration = document.getElementById('duration-select').value;
        const startDate = document.getElementById('start-date').value;
        const landSize = document.getElementById('land-size').value;
        
        if (!crop || !duration || !startDate) {
            alert('Please fill in all required fields');
            return;
        }
        
        generateCropPlan(crop, duration, startDate, landSize);
    });
}

function generateCropPlan(crop, duration, startDate, landSize) {
    const generatedPlan = document.getElementById('generated-plan');
    if (!generatedPlan) return;
    
    // Calculate harvest date
    const start = new Date(startDate);
    const durationDays = {
        'short': 75,
        'medium': 105,
        'long': 135,
        'very-long': 165
    };
    
    const days = durationDays[duration] || 100;
    const harvestDate = new Date(start);
    harvestDate.setDate(harvestDate.getDate() + days);
    
    // Update plan summary
    document.getElementById('plan-crop').textContent = crop.charAt(0).toUpperCase() + crop.slice(1);
    document.getElementById('plan-duration').textContent = `${days} days`;
    document.getElementById('plan-start').textContent = start.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
    document.getElementById('plan-harvest').textContent = harvestDate.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    // Show the plan
    generatedPlan.style.display = 'block';
    
    // Scroll to plan
    generatedPlan.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== API CONFIGURATION =====
const apiSaveBtn = document.querySelector('.api-save-btn');
if (apiSaveBtn) {
    apiSaveBtn.addEventListener('click', function() {
        const apiKey = document.getElementById('weather-api-key').value;
        const location = document.getElementById('location-input').value;
        
        if (!apiKey || !location) {
            alert('Please enter both API key and location');
            return;
        }
        
        // Store in memory (not localStorage as per restrictions)
        alert('Configuration saved successfully!');
    });
}

// ===== DOWNLOAD PLAN =====
const downloadBtn = document.querySelector('.download-plan-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
        alert('Plan download feature would be implemented here. In a real application, this would generate a PDF of the crop plan.');
    });
}

// ===== OTHER PAGE TABS =====
function initializeOtherPageTabs() {
    const navPills = document.querySelectorAll('.nav-pill');
    
    navPills.forEach(pill => {
        pill.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remove active from all pills and sections
            navPills.forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active to clicked pill and target section
            this.classList.add('active');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });
}

// ===== MACHINERY RENTAL =====
function initializeMachineryRental() {
    const showRentalFormBtn = document.getElementById('show-rental-form');
    const rentalFormModal = document.getElementById('rental-form-modal');
    const closeModal = document.querySelector('.close-modal');
    const machineryRentalForm = document.getElementById('machinery-rental-form');
    const machineryPhoto = document.getElementById('machinery-photo');
    
    if (showRentalFormBtn) {
        showRentalFormBtn.addEventListener('click', function() {
            if (rentalFormModal) {
                rentalFormModal.style.display = 'flex';
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if (rentalFormModal) {
                rentalFormModal.style.display = 'none';
            }
        });
    }
    
    // Close modal when clicking outside
    if (rentalFormModal) {
        rentalFormModal.addEventListener('click', function(e) {
            if (e.target === rentalFormModal) {
                rentalFormModal.style.display = 'none';
            }
        });
    }
    
    // Machinery photo preview
    if (machineryPhoto) {
        machineryPhoto.addEventListener('change', function() {
            const file = this.files[0];
            const preview = document.getElementById('machinery-preview');
            
            if (file && preview) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 150px; border-radius: 8px; margin-top: 10px;">`;
                }
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Machinery rental form submission
    if (machineryRentalForm) {
        machineryRentalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            alert('Thank you! Your machinery listing has been submitted for review. It will be visible once approved.');
            
            if (rentalFormModal) {
                rentalFormModal.style.display = 'none';
            }
            
            this.reset();
            const preview = document.getElementById('machinery-preview');
            if (preview) {
                preview.innerHTML = '';
            }
        });
    }
    
    // Contact buttons for machinery
    const contactBtns = document.querySelectorAll('.contact-btn');
    contactBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.machinery-card');
            const ownerName = card.querySelector('.owner-detail span:nth-child(2)').textContent;
            const phone = card.querySelectorAll('.owner-detail span')[5].textContent;
            
            alert(`Contact Information:\nName: ${ownerName}\nPhone: ${phone}\n\nYou can call or message them directly.`);
        });
    });
}

// ===== STORAGE CONTACT =====
const storageContactBtns = document.querySelectorAll('.storage-contact-btn');
storageContactBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Opening map directions... In a real application, this would open Google Maps with the storage location.');
    });
});

// // ===== SCHEME CARDS =====
// const schemeCards = document.querySelectorAll('.scheme-card');
// schemeCards.forEach(card => {
//     card.addEventListener('click', function(e) {
//         e.preventDefault();
//         const schemeName = this.querySelector('h3').textContent;
//         alert(`Redirecting to application page for ${schemeName}...\n\nIn a real application, this would open the MeeSeva portal or government website.`);
//     });
// });

// ===== PRODUCT BUY BUTTONS =====
const buyBtns = document.querySelectorAll('.buy-btn');
buyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const productName = card.querySelector('h4').textContent;
        const price = card.querySelector('.current-price').textContent;
        
        alert(`Adding ${productName} to cart at ${price}\n\nIn a real application, this would add the product to your shopping cart.`);
    });
});

// ===== RESOURCE LINKS =====
const resourceLinks = document.querySelectorAll('.resource-link');
resourceLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const title = this.closest('.resource-card').querySelector('.resource-title').textContent;
        alert(`Opening ${title} section...\n\nIn a real application, this would navigate to the detailed ${title.toLowerCase()} page.`);
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== FORM VALIDATION ENHANCEMENT =====
const allInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
allInputs.forEach(input => {
    input.addEventListener('invalid', function(e) {
        e.preventDefault();
        this.classList.add('error');
    });
    
    input.addEventListener('input', function() {
        this.classList.remove('error');
    });
});

// ===== ANIMATION ON SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards and sections for animation
document.querySelectorAll('.feature-card, .news-card, .resource-card, .profit-card, .machinery-card, .storage-card, .scheme-card, .product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});


// ===== CONSOLE LOG =====
console.log('Agri-advisory agent initialized successfully!');
console.log('Current date:', new Date().toLocaleDateString());
console.log('All features loaded and ready to use.');
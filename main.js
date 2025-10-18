// ===== GLOBAL VARIABLES =====
let selectedFile = null;
let enquiryImageData = null;
let isPhotoUploaded = false;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let machineryImageData = null;

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
            
            const targetPage = this.getAttribute('href').substring(1);
            
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            this.classList.add('active');
            document.getElementById(targetPage).classList.add('active');
            
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
    
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', uploadPhoto);
    }
    
    const changeBtn = document.querySelector('.change-btn');
    if (changeBtn) {
        changeBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
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
            enquiryImageData = e.target.result;
            const preview = document.getElementById('previewImage');
            const uploadBox = document.getElementById('uploadBox');
            const uploadControls = document.getElementById('uploadControls');
            
            preview.src = enquiryImageData;
            preview.classList.add('show');
            uploadBox.classList.add('has-image');
            uploadControls.classList.add('show');
            
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
    
    const message = document.getElementById('message').value;
    
    // Show response with image and information
    displayEnquiryResponse(enquiryImageData, message);
    
    // Reset form
    e.target.reset();
    resetPhotoUpload();
}

function displayEnquiryResponse(imageData, query) {
    // Create response container
    let responseContainer = document.getElementById('enquiry-response-container');
    
    if (!responseContainer) {
        responseContainer = document.createElement('div');
        responseContainer.id = 'enquiry-response-container';
        responseContainer.className = 'enquiry-response-container';
        
        const enquiryContainer = document.querySelector('.enquiry-container');
        const adSpace = enquiryContainer.querySelector('.ad-space');
        enquiryContainer.insertBefore(responseContainer, adSpace);
    }
    
    // Generate mock response based on query
    const response = generateMockResponse(query);
    
    const responseHTML = `
        <div class="response-card">
            <div class="response-header">
                <h2>🌱 Analysis Result</h2>
                <span class="response-time">${new Date().toLocaleString()}</span>
            </div>
            <div class="response-content">
                ${imageData ? `
                <div class="response-image-container">
                    <img src="${imageData}" alt="Uploaded crop image" class="response-image">
                </div>
                ` : ''}
                <div class="response-details">
                    <div class="query-section">
                        <h3>Your Query:</h3>
                        <p>${query}</p>
                    </div>
                    <div class="analysis-section">
                        <h3>Our Analysis:</h3>
                        <p>${response.analysis}</p>
                    </div>
                    ${response.diagnosis ? `
                    <div class="diagnosis-section">
                        <h3>🔍 Diagnosis:</h3>
                        <p class="diagnosis-highlight">${response.diagnosis}</p>
                    </div>
                    ` : ''}
                    <div class="recommendations-section">
                        <h3>💡 Recommendations:</h3>
                        <ul>
                            ${response.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    responseContainer.innerHTML = responseHTML;
    responseContainer.style.display = 'block';
    
    // Scroll to response
    setTimeout(() => {
        responseContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function generateMockResponse(query) {
    // Simple keyword-based response generation
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('disease') || lowerQuery.includes('leaf') || lowerQuery.includes('spot') || lowerQuery.includes('yellow')) {
        return {
            analysis: "Based on your image and description, we've analyzed the crop condition carefully.",
            diagnosis: "Possible Leaf Spot Disease or Nutrient Deficiency detected",
            recommendations: [
                "Remove and destroy affected leaves immediately",
                "Apply fungicide spray (Mancozeb or Copper-based) every 7-10 days",
                "Ensure proper drainage in the field",
                "Apply balanced NPK fertilizer to boost plant immunity",
                "Monitor surrounding plants for similar symptoms"
            ]
        };
    } else if (lowerQuery.includes('pest') || lowerQuery.includes('insect') || lowerQuery.includes('worm')) {
        return {
            analysis: "Your crop shows signs of pest infestation that requires immediate attention.",
            diagnosis: "Pest Infestation - Early intervention recommended",
            recommendations: [
                "Apply neem oil spray (5ml per liter) in early morning or evening",
                "Use biological control - introduce natural predators if possible",
                "Remove severely damaged parts to prevent spread",
                "Install yellow sticky traps to monitor pest population",
                "Maintain field hygiene by removing crop residues"
            ]
        };
    } else if (lowerQuery.includes('fertilizer') || lowerQuery.includes('nutrient') || lowerQuery.includes('growth')) {
        return {
            analysis: "Your query about plant nutrition and growth has been processed.",
            diagnosis: null,
            recommendations: [
                "Apply NPK fertilizer at recommended doses: 120:60:40 kg/ha for most crops",
                "Use organic manure (FYM) @ 10 tons/ha for soil health",
                "Apply micronutrients (Zinc, Boron) if deficiency symptoms appear",
                "Split nitrogen application into 3 doses for better utilization",
                "Conduct soil testing every season for precise recommendations"
            ]
        };
    } else if (lowerQuery.includes('water') || lowerQuery.includes('irrigation') || lowerQuery.includes('drought')) {
        return {
            analysis: "Water management is crucial for optimal crop growth and yield.",
            diagnosis: null,
            recommendations: [
                "Implement drip irrigation for water efficiency (50-60% water saving)",
                "Apply mulch to reduce evaporation and maintain soil moisture",
                "Irrigate during critical growth stages: flowering and grain filling",
                "Monitor soil moisture regularly - water when 50% available water is depleted",
                "Create proper drainage channels to prevent waterlogging"
            ]
        };
    } else {
        return {
            analysis: "Thank you for your enquiry. Our agricultural experts have reviewed your query.",
            diagnosis: null,
            recommendations: [
                "Maintain proper crop spacing for good air circulation",
                "Regular monitoring of crop health is essential",
                "Follow integrated pest management (IPM) practices",
                "Ensure timely application of fertilizers and pesticides",
                "Contact your local agricultural extension office for personalized advice"
            ]
        };
    }
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
    enquiryImageData = null;
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
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'calendar-date';
        emptyDiv.style.visibility = 'hidden';
        calendarDates.appendChild(emptyDiv);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'calendar-date';
        dateDiv.textContent = day;
        
        if (day === today.getDate() && 
            currentMonth === today.getMonth() && 
            currentYear === today.getFullYear()) {
            dateDiv.classList.add('today');
        }
        
        dateDiv.addEventListener('click', function() {
            document.querySelectorAll('.calendar-date').forEach(d => {
                d.classList.remove('selected');
            });
            
            this.classList.add('selected');
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
        updateWeatherDisplay();
        selectedDateSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function updateWeatherDisplay() {
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
    
    document.getElementById('plan-crop').textContent = crop.charAt(0).toUpperCase() + crop.slice(1);
    document.getElementById('plan-duration').textContent = `${days} days`;
    document.getElementById('plan-start').textContent = start.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
    document.getElementById('plan-harvest').textContent = harvestDate.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    generatedPlan.style.display = 'block';
    generatedPlan.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
            
            navPills.forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
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
    
    if (rentalFormModal) {
        rentalFormModal.addEventListener('click', function(e) {
            if (e.target === rentalFormModal) {
                rentalFormModal.style.display = 'none';
            }
        });
    }
    
    if (machineryPhoto) {
        machineryPhoto.addEventListener('change', function() {
            const file = this.files[0];
            const preview = document.getElementById('machinery-preview');
            
            if (file && preview) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    machineryImageData = e.target.result;
                    preview.innerHTML = `<img src="${machineryImageData}" style="max-width: 100%; max-height: 150px; border-radius: 8px; margin-top: 10px;">`;
                }
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (machineryRentalForm) {
        machineryRentalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                ownerName: document.getElementById('owner-name').value,
                machineryType: document.getElementById('machinery-type').value,
                price: document.getElementById('rental-price').value,
                description: document.getElementById('machinery-description').value,
                contact: document.getElementById('contact-number').value,
                location: document.getElementById('location').value,
                image: machineryImageData
            };
            
            // Add machinery card
            addMachineryCard(formData);
            
            // Close modal and reset form
            if (rentalFormModal) {
                rentalFormModal.style.display = 'none';
            }
            
            this.reset();
            const preview = document.getElementById('machinery-preview');
            if (preview) {
                preview.innerHTML = '';
            }
            machineryImageData = null;
            
            alert('Success! Your machinery has been added to the rental list.');
        });
    }
    
    // Contact buttons for machinery
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('contact-btn')) {
            const card = e.target.closest('.machinery-card');
            const ownerName = card.querySelector('.owner-detail:nth-child(1) span:nth-child(2)').textContent;
            const phone = card.querySelector('.owner-detail:nth-child(3) span:nth-child(2)').textContent;
            
            alert(`Contact Information:\nName: ${ownerName}\nPhone: ${phone}\n\nYou can call or message them directly.`);
        }
    });
}

function addMachineryCard(data) {
    const machineryGrid = document.querySelector('.machinery-grid');
    
    // Get machinery type display name
    const typeNames = {
        'tractor': 'Tractor',
        'harvester': 'Harvester',
        'plough': 'Plough',
        'sprayer': 'Sprayer',
        'seeder': 'Seed Drill',
        'thresher': 'Thresher',
        'rotavator': 'Rotavator',
        'cultivator': 'Cultivator'
    };
    
    const typeName = typeNames[data.machineryType] || data.machineryType;
    
    const newCard = document.createElement('div');
    newCard.className = 'machinery-card';
    newCard.style.opacity = '0';
    newCard.style.transform = 'translateY(20px)';
    
    newCard.innerHTML = `
        <div class="machinery-image-container">
            <img src="${data.image || 'https://via.placeholder.com/350x250?text=' + typeName}" alt="${typeName}">
            <div class="availability-badge">Available</div>
        </div>
        <div class="machinery-details">
            <div class="machinery-header">
                <h3>${typeName}</h3>
                <div class="price-tag">₹${data.price}/day</div>
            </div>
            <p class="machinery-description">${data.description}</p>
            <div class="owner-info">
                <div class="owner-detail">
                    <span class="info-icon">👤</span>
                    <span>${data.ownerName}</span>
                </div>
                <div class="owner-detail">
                    <span class="info-icon">📍</span>
                    <span>${data.location}</span>
                </div>
                <div class="owner-detail">
                    <span class="info-icon">📞</span>
                    <span>${data.contact}</span>
                </div>
            </div>
            <button class="contact-btn">Contact Owner</button>
        </div>
    `;
    
    machineryGrid.insertBefore(newCard, machineryGrid.firstChild);
    
    // Animate the new card
    setTimeout(() => {
        newCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        newCard.style.opacity = '1';
        newCard.style.transform = 'translateY(0)';
    }, 100);
    
    // Scroll to the new card
    setTimeout(() => {
        newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}

// ===== STORAGE CONTACT =====
const storageContactBtns = document.querySelectorAll('.storage-contact-btn');
storageContactBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Opening map directions... In a real application, this would open Google Maps with the storage location.');
    });
});

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

document.querySelectorAll('.feature-card, .news-card, .resource-card, .profit-card, .machinery-card, .storage-card, .scheme-card, .product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

console.log('Agri-advisory agent initialized successfully!');
console.log('Current date:', new Date().toLocaleDateString());
console.log('All features loaded and ready to use.');
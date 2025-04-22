// Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });

    // Initialize counters when they come into view
    initCounters();

    // Initialize testimonial slider
    initTestimonialSlider();

    // Handle newsletter form submission
    initNewsletterForm();

    // Initialize adoption form
    initAdoptionForm();
});

// UTILITY FUNCTIONS - Define these at the top level so they're available everywhere
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isValidPhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phone));
}

// Adoption Form Functions
function initAdoptionForm() {
    const adoptionForm = document.getElementById('adoptionForm');
    if (!adoptionForm) return;

    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const pet = document.getElementById('petName');
    const agree = document.getElementById('agreeTerms');

    const nameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const petError = document.getElementById('petNameError');
    const agreeError = document.getElementById('agreeTermsError');
    
    adoptionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearAdoptionErrors();

        let isValid = true;

        if (!fullName.value.trim()) {
            showAdoptionError(fullName, nameError, "Please enter your name");
            isValid = false;
        }

        if (!email.value.trim()) {
            showAdoptionError(email, emailError, "Please enter your email");
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showAdoptionError(email, emailError, "Please enter a valid email");
            isValid = false;
        }

        if (phone.value.trim() && !isValidPhone(phone.value)) {
            showAdoptionError(phone, phoneError, "Invalid phone number");
            isValid = false;
        }

        if (!pet.value.trim()) {
            showAdoptionError(pet, petError, "Please enter the pet name you wish to adopt");
            isValid = false;
        }

        if (!agree.checked) {
            showAdoptionError(agree, agreeError, "You must agree to the terms");
            isValid = false;
        }

        if (isValid) {
            alert("Adoption request submitted successfully!");
            adoptionForm.reset();
        }
    });

    const resetButton = document.getElementById('resetForm');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            adoptionForm.reset();
            clearAdoptionErrors();
            
            // Check if thankYouMessage exists before trying to hide it
            const thankYouMessage = document.getElementById('thankYouMessage');
            if (thankYouMessage) {
                thankYouMessage.style.display = 'none';
                adoptionForm.style.display = 'block';
            }
        });
    }
}

function showAdoptionError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
}

function clearAdoptionErrors() {
    const adoptionForm = document.getElementById('adoptionForm');
    if (!adoptionForm) return;
    
    const inputs = adoptionForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.classList.remove('error'));

    const errorMessages = adoptionForm.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.textContent = '');
}

// Testimonial Slider Functions
let testimonialInterval;
let testimonials = [];
let dots = [];
let currentSlide = 0;

function initTestimonialSlider() {
    // Select all testimonials and dots at the beginning
    testimonials = document.querySelectorAll('.testimonial');
    dots = document.querySelectorAll('.dot');
    
    if (testimonials.length === 0 || dots.length === 0) return;
    
    showTestimonial(0);
    
    // Auto-advance testimonials
    testimonialInterval = setInterval(() => {
        nextTestimonial();
    }, 5000);
}

function showTestimonial(n) {
    // Reset current active classes
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Set new active classes
    testimonials[n].classList.add('active');
    dots[n].classList.add('active');
    currentSlide = n;
}

function nextTestimonial() {
    let nextSlide = currentSlide + 1;
    if (nextSlide >= testimonials.length) {
        nextSlide = 0;
    }
    showTestimonial(nextSlide);
}

function currentTestimonial(n) {
    // Clear auto advance when user clicks a dot
    clearInterval(testimonialInterval);
    showTestimonial(n);
    
    // Restart auto advance
    testimonialInterval = setInterval(() => {
        nextTestimonial();
    }, 5000);
}

// Animated Counter Functions
function initCounters() {
    const impactSection = document.querySelector('.impact');
    if (!impactSection) return;
    
    const counters = [
        { id: 'adoptionCount', target: 1245 },
        { id: 'shelterCount', target: 28 },
        { id: 'volunteerCount', target: 153 }
    ];
    
    // Check if element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    let started = false;
    
    // Start counter animation when scrolled into view
    window.addEventListener('scroll', () => {
        if (!started && isInViewport(impactSection)) {
            started = true;
            counters.forEach(counter => {
                animateCounter(counter.id, counter.target);
            });
        }
    });
    
    // Initial check in case section is already in viewport when page loads
    if (isInViewport(impactSection)) {
        started = true;
        counters.forEach(counter => {
            animateCounter(counter.id, counter.target);
        });
    }
}

function animateCounter(id, target) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const duration = 2000; // 2 seconds
    const frameRate = 50; // 50 frames per second
    const totalFrames = duration / 1000 * frameRate;
    let frame = 0;
    
    const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(progress * target);
        
        if (frame === totalFrames) {
            clearInterval(counter);
        }
        
        element.textContent = currentCount;
    }, 1000 / frameRate);
}

// Newsletter Form Functions
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    const messageElement = document.getElementById('formMessage');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('emailInput').value;
        
        // Simulate form submission
        messageElement.textContent = 'Subscribing...';
        messageElement.style.color = '#606060';
        
        // Simulate API call with setTimeout
        setTimeout(() => {
            messageElement.textContent = 'Thank you for subscribing!';
            messageElement.style.color = '#5e2ca5';
            form.reset();
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                messageElement.textContent = '';
            }, 3000);
        }, 1500);
    });
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animation for elements
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.85;
    
    // Add animations to elements as they come into view
    document.querySelectorAll('.pet-card, .step, .stat').forEach(element => {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        
        if (scrollPosition > elementPosition && !element.classList.contains('animated')) {
            element.classList.add('animated');
            element.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
});

// Add a bit of animation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .pet-card, .step, .stat {
            opacity: 0;
        }
    </style>
`);

function initPetCardFlip() {
    const petCards = document.querySelectorAll('.pet-card');
    
    petCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
}
initPetCardFlip();
// Form Validation for Donation Form
function initDonationForm() {
    const donationForm = document.getElementById('donationForm');
    if (!donationForm) return;

    const formMessage = document.getElementById('formMessage');
    const donationType = document.getElementById('donationType');
    const amountGroup = document.getElementById('amountGroup');
    const suppliesGroup = document.getElementById('suppliesGroup');
    const resetFormButton = document.getElementById('resetForm');
    const amountButtons = document.querySelectorAll('.amount-btn');

    // Show/hide fields based on donation type
    if (donationType) {
        donationType.addEventListener('change', function() {
            if (this.value === 'supplies') {
                amountGroup.style.display = 'none';
                suppliesGroup.style.display = 'block';
                document.getElementById('donationAmount').required = false;
                document.getElementById('supplies').required = true;
            } else {
                amountGroup.style.display = 'block';
                suppliesGroup.style.display = 'none';
                document.getElementById('donationAmount').required = true;
                document.getElementById('supplies').required = false;
            }
        });
    }

    // Amount button functionality
    amountButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            document.getElementById('donationAmount').value = amount;
            
            // Remove active class from all buttons
            amountButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });

    // Reset form button
    if (resetFormButton) {
        resetFormButton.addEventListener('click', function() {
            donationForm.reset();
            clearDonationErrors();
            if (formMessage) {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }
            
            // Reset active amount buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            
            // Reset conditional fields
            if (donationType && donationType.value === 'supplies') {
                amountGroup.style.display = 'none';
                suppliesGroup.style.display = 'block';
            } else {
                amountGroup.style.display = 'block';
                suppliesGroup.style.display = 'none';
            }
        });
    }

    // Form submission
    donationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearDonationErrors();
        
        // Validate form
        let isValid = validateDonationForm();
        
        if (isValid) {
            alert("Thank you for your donation!");
            donationForm.reset();
        }
    });

    function validateDonationForm() {
        let valid = true;
        
        // Get form elements
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const donationAmount = document.getElementById('donationAmount');
        const supplies = document.getElementById('supplies');
        const agreeTerms = document.getElementById('agreeTerms');
        
        // Get error elements
        const fullNameError = document.getElementById('fullNameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError'); 
        const donationTypeError = document.getElementById('donationTypeError');
        const donationAmountError = document.getElementById('donationAmountError');
        const suppliesError = document.getElementById('suppliesError');
        const agreeTermsError = document.getElementById('agreeTermsError');
        
        // Validate full name
        if (!fullName.value.trim()) {
            showDonationError(fullName, fullNameError, 'Please enter your full name');
            valid = false;
        }
        
        // Validate email
        if (!email.value.trim()) {
            showDonationError(email, emailError, 'Please enter your email address');
            valid = false;
        } else if (!isValidEmail(email.value)) {
            showDonationError(email, emailError, 'Please enter a valid email address');
            valid = false;
        }
        
        // Validate phone if provided
        if (phone.value.trim() && !isValidPhone(phone.value)) {
            showDonationError(phone, phoneError, 'Please enter a valid phone number');
            valid = false;
        }
        
        // Validate donation type
        if (!donationType.value) {
            showDonationError(donationType, donationTypeError, 'Please select a donation type');
            valid = false;
        }
        
        // Validate donation amount for monetary donations
        if (donationType.value && donationType.value !== 'supplies') {
            if (!donationAmount.value) {
                showDonationError(donationAmount, donationAmountError, 'Please enter a donation amount');
                valid = false;
            } else if (donationAmount.value <= 0) {
                showDonationError(donationAmount, donationAmountError, 'Amount must be greater than 0');
                valid = false;
            }
        }
        
        // Validate supplies for supplies donations
        if (donationType.value === 'supplies' && supplies && !supplies.value.trim()) {
            showDonationError(supplies, suppliesError, 'Please list the supplies you would like to donate');
            valid = false;
        }
        
        // Validate terms agreement
        if (!agreeTerms.checked) {
            showDonationError(agreeTerms, agreeTermsError, 'You must agree to the terms and conditions');
            valid = false;
        }
        
        return valid;
    }

    function showDonationError(input, errorElement, message) {
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearDonationErrors() {
        // Remove error classes
        const inputs = donationForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => input.classList.remove('error'));
        
        // Clear error messages
        const errorMessages = donationForm.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.textContent = '');
    }
}


// Call this for donation form initialization
document.addEventListener('DOMContentLoaded', function() {
    initDonationForm();

    
});

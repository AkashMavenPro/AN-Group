$(function() { // Shorthand for $(document).ready()

    // =======================================================
    // SWIPER.JS SLIDER INITIALIZATIONS
    // =======================================================
  // --- 1. HERO SLIDER (WITH CLICK-TO-CHANGE FUNCTIONALITY) ---
    new Swiper('.hero-swiper', {
        // Core settings
        loop: true,
        effect: 'fade', // Use 'fade' effect to match the old style
        fadeEffect: {
            crossFade: true
        },
        
        // Autoplay
        autoplay: {
            delay: 5000,
            disableOnInteraction: false, // Continue autoplay after user interaction
        },

        // Navigation arrows
        navigation: {
            nextEl: '.hero-button-next',
            prevEl: '.hero-button-prev',
        },

        // Custom pagination for the '01', '02' style
        pagination: {
            el: '.hero-pagination',
            clickable: true,
            // This function creates the '01', '02', etc. format
            renderBullet: function (index, className) {
                const number = (index + 1).toString().padStart(2, '0');
                return '<span class="' + className + '">' + number + '</span>';
            },
        },

        // --- CHANGED: LOGIC UPDATED TO PREVENT SLIDE CHANGE WHEN CLICKING VIDEO ---
        // This listens for a click. If the click is not on a video trigger, it moves to the next slide.
        on: {
            click: function (swiper, event) {
                // Check if the clicked element (or its parent) is the video play button.
                if ($(event.target).closest('.js-lightbox').length) {
                    // If it is, do nothing. The universal lightbox script will handle opening the video.
                    return; 
                }
                // Otherwise, if the click was anywhere else on the slide, go to the next one.
                this.slideNext();
            },
        },
    });

    // --- 1. Ongoing Projects Slider ---
    // ... (keep existing code for this slider)
    const ongoingSwiper = new Swiper('.ongoing-projects-swiper', {
        loop: true,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        navigation: { nextEl: '#project-next', prevEl: '#project-prev' },
        pagination: {
            el: '#project-dots',
            clickable: true,
            renderBullet: (index, className) => `<span class="${className}"></span>`,
        },
        on: {
            slideChange: function () {
                const activeSlide = this.slides[this.activeIndex];
                const projectName = $(activeSlide).data('name');
                const projectLink = $(activeSlide).data('link');
                
                $('#ongoing-projects-info').animate({ opacity: 0 }, 200, function() {
                    $('#project-name').text(projectName);
                    $('#project-link').attr('href', projectLink);
                    $(this).animate({ opacity: 1 }, 200);
                });
            },
            init: function() { this.emit('slideChange'); }
        }
    });

    // --- 2. Testimonial Slider ---
    // ... (keep existing code for this slider)
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
        loop: true,
        navigation: { nextEl: '#testimonial-next', prevEl: '#testimonial-back' },
        pagination: {
            el: '#testimonial-dots',
            clickable: true,
            renderBullet: (index, className) => `<span class="${className}"></span>`,
        },
        on: {
            slideChange: function() {
                $('#testimonial-avatars .avatar').removeClass('active').eq(this.realIndex).addClass('active');
            },
            init: function() {
                 $('#testimonial-avatars .avatar').first().addClass('active');
            }
        }
    });

    $('#testimonial-avatars').on('click', '.avatar', function() {
        testimonialSwiper.slideToLoop($(this).index());
    });
    
    // --- 3. Master Plan Slider ---
    // ... (keep existing code for this slider)
    const masterplanSwiper = new Swiper('.masterplan-swiper', {
        loop: true,
        navigation: { nextEl: '#masterplan-next', prevEl: '#masterplan-back' },
        pagination: {
            el: '#masterplan-dots',
            clickable: true,
            renderBullet: (index, className) => `<span class="${className}"></span>`,
        },
    });

    // --- 4. Floor Plans Tabbed Slider ---
    // ... (keep existing code for this slider)
    const floorplanData = {
        category1: [{ image: 'assets/images/image/building-1.png' }, { image: 'assets/images/image/building-1.png' }, { image: 'assets/images/image/building-1.png' },],
        category2: [{ image: 'assets/images/image/Rectangle 45.png' },],
        category3: [{ image: 'assets/images/image/building-1.png' },{ image: 'assets/images/image/Rectangle 45.png' },],
        category4: [{ image: 'assets/images/image/building-1.png' },]
    };
    let floorplanSwiper = null;
    function initFloorplanSwiper(category) {
        if (floorplanSwiper) floorplanSwiper.destroy(true, true);
        const slides = floorplanData[category].map(p => `<div class="swiper-slide p-2"><img src="${p.image}" class="w-full h-auto object-contain"></div>`).join('');
        $('.floorplan-swiper .swiper-wrapper').html(slides);
        floorplanSwiper = new Swiper('.floorplan-swiper', {
            loop: true,
            slidesPerView: 1.3,
            spaceBetween: 10,
            centeredSlides: true,
            navigation: { nextEl: '#floorplan-next', prevEl: '#floorplan-back' },
            pagination: { el: '#floorplan-dots', clickable: true, renderBullet: (i, c) => `<span class="${c}"></span>` },
            breakpoints: { 1024: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false } }
        });
    }
    $('#floorplan-categories').on('click', '.floorplan-category-btn', function() {
        const category = $(this).data('category');
        $('.floorplan-category-btn').removeClass('active');
        $(this).addClass('active');
        initFloorplanSwiper(category);
    });
    initFloorplanSwiper('category1');

       // --- 5. Glimpses Gallery Tabbed Slider (UPDATED) ---
    const galleryData = {
        flatA: [ { image: 'assets/images/image/Rectangle 47.png' }, { image: 'assets/images/image/building-1.png' }, { image: 'assets/images/image/Rectangle 45.png' } ],
        flatB: [ { image: 'assets/images/image/Rectangle 41.png' }, { image: 'assets/images/image/Rectangle 12.png' } ],
        flatC: [ { image: 'assets/images/image/banner.png' } ]
    };

    let gallerySwiper = null;

    function initGallerySwiper(category) {
        if (gallerySwiper) {
            gallerySwiper.destroy(true, true);
        }

        const slides = galleryData[category].map(item =>
            `<div class="swiper-slide"><img src="${item.image}" alt="Gallery Image" class="w-full h-full object-cover  shadow-lg"></div>`
        ).join('');

        $('.gallery-swiper .swiper-wrapper').html(slides);

        gallerySwiper = new Swiper('.gallery-swiper', {
            loop: true,
            slidesPerView: 'auto', // This is crucial for the peek effect
            centeredSlides: true,    // This centers the active slide
            spaceBetween: 20,        // Adjust gap between slides as needed
            navigation: {
                nextEl: '#gallery-next',
                prevEl: '#gallery-back',
            },
            pagination: {
                el: '#gallery-dots',
                clickable: true,
                renderBullet: (index, className) => `<span class="${className}"></span>`,
            },
        });
    }

    $('#gallery-tabs').on('click', '.gallery-tab-btn', function() {
        const category = $(this).data('category');
        $('.gallery-tab-btn').removeClass('active');
        $(this).addClass('active');
        initGallerySwiper(category);
    });

    // Initial load for the first tab
    initGallerySwiper('flatA');

    // --- 6. Recent Projects Slider ---
    const recentSwiper = new Swiper('.recent-projects-swiper', {
        loop: true,
        slidesPerView: 1.1,
        spaceBetween: 10,
        navigation: { nextEl: '#recent-next', prevEl: '#recent-prev' },
        pagination: {
            el: '#recent-dots',
            clickable: true,
            renderBullet: (index, className) => `<span class="${className}"></span>`,
        },
        breakpoints: {
            768: { slidesPerView: 1.25, spaceBetween: 20 },
            1024: { slidesPerView: 1.5, spaceBetween: 30 }
        }
    });

  // --- 6. Amenities Slider (NEW) ---
    const amenitiesSwiper = new Swiper('.amenities-swiper', {
        loop: true,
        slidesPerView: 'auto', // Mobile: auto width for peeking effect
        centeredSlides: true,  // Mobile: center the active slide
        spaceBetween: 15,      // Mobile: space between slides
        navigation: {
            nextEl: '#amenities-next',
            prevEl: '#amenities-back',
        },
        pagination: {
            el: '#amenities-dots',
            clickable: true,
            renderBullet: (index, className) => `<span class="${className}"></span>`,
        },
        breakpoints: {
            // Desktop: 768px and up
            768: {
                slidesPerView: 3,        // Show 3 slides
                centeredSlides: false,   // Do not center slides in a grid
                spaceBetween: 30,      // Wider space for desktop
            }
        }
    });

    
      // --- Location Benefits Tabs ---
    if ($('#location-tabs').length) {
        $('.location-tab').on('click', function() {
            const targetId = $(this).data('target');

            // Update button active state
            $('.location-tab').removeClass('active');
            $(this).addClass('active');

            // Hide all panels, then show the target panel
            $('.location-panel').addClass('hidden');
            $('#' + targetId).removeClass('hidden');
        });
    }

    
    // =======================================================
    // VANILLA JS COUNTER ANIMATION (NO LIBRARIES)
    // =======================================================
    const statsSection = document.getElementById('stats-section');
    const counters = document.querySelectorAll('.stat-number');
    const animationDuration = 2000; // Animation duration in milliseconds

    // Function to animate a single number
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        let startTime = null;

        // The step function that runs on each frame
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / animationDuration, 1);
            let currentValue = Math.floor(progress * target);
            
            // Format numbers with commas (e.g., 10,000)
            let formattedValue = currentValue.toLocaleString();
            
            // Custom formatting for large numbers like Lakh
            if (target === 300000) {
                 // Start showing "Lakh" after reaching 100,000
                 if(currentValue >= 100000) {
                     formattedValue = (currentValue / 100000).toFixed(1).replace('.0', '');
                 } else {
                     // Show comma-separated number until then
                      formattedValue = currentValue.toLocaleString();
                 }
            } else if (target === 10000) {
                 // Start showing "K" after reaching 1,000
                 if (currentValue >= 1000) {
                     formattedValue = (currentValue / 1000).toFixed(1).replace('.0', '');
                 } else {
                     formattedValue = currentValue.toLocaleString();
                 }
            }

            element.innerText = formattedValue;
            
            // Continue the animation until the end
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        // Start the animation
        window.requestAnimationFrame(step);
    };

    // Use IntersectionObserver to trigger the animation on scroll
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the section is in view
            if (entry.isIntersecting) {
                // Start the animation for each counter
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                // Stop observing once the animation has been triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the section is visible
    });

    // Start observing the section if it exists
    if (statsSection) {
        observer.observe(statsSection);
    }


    // =======================================================
    // CONTACT FORM SUBMISSION (AJAX to Node.js backend)
    // =======================================================
    $('#contact-form').on('submit', function(e) {
        e.preventDefault(); // Prevent the default page reload on submit

        const submitButton = $('#submit-button');
        const feedbackMessage = $('#form-feedback');

        // Get all selected projects
        const selectedProjects = [];
        $('input[name="projects"]:checked').each(function() {
            selectedProjects.push($(this).val());
        });

        // Collect all form data into an object
        const formData = {
            name: $('#name').val(),
            contact: $('#contact').val(),
            email: $('#email').val(),
            message: $('#message').val(),
            projects: selectedProjects,
        };

        // Change button text to show it's processing
        submitButton.text('SENDING...').prop('disabled', true);
        feedbackMessage.text('').removeClass('text-green-600 text-red-600');

        // Send the data to your backend server using AJAX
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/send-email', // The URL of your backend endpoint
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                // Handle success
                feedbackMessage.text(response.message).addClass('text-green-600');
                submitButton.text('SUBMIT').prop('disabled', false);
                $('#contact-form')[0].reset(); // Clear the form
            },
            error: function(xhr) {
                // Handle errors
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'An error occurred.';
                feedbackMessage.text(errorMessage).addClass('text-red-600');
                submitButton.text('SUBMIT').prop('disabled', false);
            }
        });
    });

    // =======================================================
    // UNIVERSAL LIGHTBOX/POPUP LOGIC (ADD THIS CODE)
    // =======================================================
    const lightbox = $('#lightbox');
    const lightboxContent = $('#lightbox-content');
    const lightboxClose = $('#lightbox-close');

    // Open lightbox when a trigger is clicked
    $('.js-lightbox').on('click', function(e) {
        e.preventDefault(); // Prevent page from jumping
        
        const type = $(this).data('type');
        const src = $(this).data('src');

        if (type === 'video') {
            // Use the new wrapper class for consistent aspect ratio
            lightboxContent.html('<div class="lightbox-video-wrapper"><iframe src="' + src + '?autoplay=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>');
        } else if (type === 'image') {
            // For image, create an img tag
            lightboxContent.html('<img src="' + src + '" class="max-w-full max-h-[90vh] object-contain">');
        }

        // Show the lightbox with animation
        lightbox.removeClass('opacity-0 pointer-events-none');
        setTimeout(() => lightboxContent.removeClass('scale-95'), 50);
    });

    // Function to close the lightbox
    function closeLightbox() {
        lightboxContent.addClass('scale-95');
        lightbox.addClass('opacity-0 pointer-events-none');
        
        // Stop video playback by clearing the content after animation
        setTimeout(() => lightboxContent.html(''), 300);
    }

    // Close lightbox when the close button or background is clicked
    lightboxClose.on('click', closeLightbox);
    lightbox.on('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });

  // =======================================================
    // HEADER & NAVIGATION LOGIC (REVISED FOR MULTI-LEVEL)
    // =======================================================

    // --- Header 1: Mobile Menu Panel ---
    const $mobileMenu = $('#mobile-menu');
    $('#mobile-menu-btn').on('click', function() {
        $mobileMenu.removeClass('hidden');
        $('body').addClass('overflow-hidden');
    });

    $('#mobile-menu-close-btn').on('click', function() {
        $mobileMenu.addClass('hidden');
        $('body').removeClass('overflow-hidden');
    });

    // --- Header 2: Full Screen Menu (Mobile) ---
    const $fullMenuOverlay = $('#full-menu-overlay');
    $('#mobile-menu-btn-header2').on('click', function() {
        $fullMenuOverlay.removeClass('hidden');
        $('body').addClass('overflow-hidden'); // Prevent background scrolling
    });

    $('#menu-close-btn').on('click', function() {
        $fullMenuOverlay.addClass('hidden');
        $('body').removeClass('overflow-hidden');
    });

    // --- Universal Multi-level Mobile Submenu Toggle ---
    // This code works for BOTH mobile menus automatically.
    $('.mobile-submenu-trigger').on('click', function() {
        const $submenu = $(this).next('div'); // Get the submenu div right after the button
        $submenu.slideToggle(300);
        $(this).toggleClass('is-open');

        // Optional: Close other open submenus at the same level
        $(this).parent().siblings().find('.mobile-submenu-trigger').removeClass('is-open');
        $(this).parent().siblings().find('div').slideUp(300);
    });
});

let lastScrollPosition = 0; // Keep the previous scroll position
    const header = document.querySelector('header'); 
    
    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.scrollY; // Current scroll position
    
        if (currentScrollPosition > lastScrollPosition) {
            // Scroll down -> hide the navbar
            header.classList.add('hidden');
        } else {
            // Scroll up -> show the navbar
            header.classList.remove('hidden');
        }
    
        // Update the scroll position
        lastScrollPosition = currentScrollPosition;
    });
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('footer');

    // Check the scroll position
    const updateFooterVisibility = () => {
        //  The sum of the current vertical scroll position of the window and the window
        //  height -> the current position of the window relative to the top of the document
        const scrollOffset = window.scrollY + window.innerHeight;
        const documentHeight = document.body.offsetHeight; // Total height of the document

        if (scrollOffset >= documentHeight - 10) { // If the user has scrolled within 10 pixels of the bottom of the page
            footer.classList.remove('hidden'); // Show footer
            footer.classList.add('visible');
        } else {
            footer.classList.remove('visible'); // Hide footer
            footer.classList.add('hidden');
        }
    };

    // Initial call to set the correct state on page load
    updateFooterVisibility();

    // Add verification to the scroll event
    window.addEventListener('scroll', updateFooterVisibility);
});

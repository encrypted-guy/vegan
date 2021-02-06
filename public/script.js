document.querySelector('.menu').addEventListener('click', () => {
    const nav = document.querySelector('nav');
    nav.classList.toggle('responsive');
    nav.style.cssText ="transition: all 0.5s ease-in-out;";
});

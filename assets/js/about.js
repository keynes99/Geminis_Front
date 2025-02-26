// Function to toggle mission and vision sections
function toggleSection(section) {
    const mision = document.querySelector('.mision');
    const vision = document.querySelector('.vision');

    if (section === 'mision') {
        vision.classList.add('hidden'); // Oculta visión
        mision.classList.remove('hidden'); // Muestra misión
    } else if (section === 'vision') {
        mision.classList.add('hidden'); // Oculta misión
        vision.classList.remove('hidden'); // Muestra visión
    }
}

window.addEventListener('scroll', function() {
    const developersSection = document.getElementById('developers');
    const scrollPosition = window.scrollY;
    if (scrollPosition > 500) {
        developersSection.style.display = 'block';
        developersSection.classList.add('fadeIn');
    } else {
        developersSection.style.display = 'none';
        developersSection.classList.remove('fadeIn');
    }
});
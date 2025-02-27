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

function handleBackgroundImage() {
    const aboutValues = document.querySelector('.about-values');
    const propositionsBg = document.querySelector('.propositions-bg');
    const newDiv = document.createElement('div');
    newDiv.classList.add('image-values');

    if (window.innerWidth < 1050) {

        aboutValues.style.backgroundImage = 'none';
        propositionsBg.parentNode.insertBefore(newDiv, propositionsBg);
        newDiv.innerHTML = '<img src="../assets/images/about-md.webp" alt="valores corporativos ">';
    }
}

window.addEventListener('resize', handleBackgroundImage);
window.addEventListener('load', handleBackgroundImage);

document.addEventListener("DOMContentLoaded", () => {
    // animacion mision y vision
    const about = window.location.pathname;
    if (about.includes('about.html')) {
        toggleSection('mision');
    }
});

const toogleBtn = document.getElementsByClassName("toogle-btn")[0]; 
const navbarLinks = document.getElementsByClassName("navbar-links")[0]; 

toogleBtn.addEventListener("click", () => {
    navbarLinks.classList.toggle("active"); 
})
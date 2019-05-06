// jshint esversion: 6
// save the input for all input fields, 
// so if login/register/whatever attempt is rejected, and the page reloads
// we won't have to re-enter everything
window.addEventListener('load', function() {
    Array.from(document.getElementsByClassName("form")).forEach(element => {
        // save info as you type
        element.addEventListener('change', function () {
            localStorage.setItem(element.name, element.value);
        });
        // retrieve previous entry
        element.value = localStorage.getItem(element.name);
    });
});
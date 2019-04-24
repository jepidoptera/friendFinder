window.addEventListener('load', function () {
    // find error message embedded in url parameters
    var url = new URL(window.location.href);
    var message = url.searchParams.get("message");
    if (message) {
        document.getElementById('errorMessage').textContent = message;
    }
});
msgRelay = {
    load: function () {window.addEventListener('load', function () {
        // find error message embedded in url parameters
        var url = new URL(window.location.href);
        msgRelay.message = url.searchParams.get("message");
        if (msgRelay.message) {
            document.getElementById('errorMessage').textContent = msgRelay.message;
            if (messageHandler) messageHandler(msgRelay.message);
        }
    });}
};
msgRelay.load();

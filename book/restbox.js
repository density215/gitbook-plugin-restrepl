require(["gitbook", "jQuery"], function (gitbook, $) {
    gitbook.events.bind("page.change", function () {
        initRestBox();
    })
});

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function initRestBox() {
    var restBoxDivs = document.getElementsByClassName("restbox");

    Object.keys(restBoxDivs).forEach(function (div) {
        var thisRestBox = restBoxDivs[div],
            tryItButton = thisRestBox.getElementsByClassName('tryit')[0],
            hideItButton = thisRestBox.getElementsByClassName('hideit')[0],
            expandItButton = thisRestBox.getElementsByClassName('expandit')[0];

        tryItButton.addEventListener('click', function (e) {
            tryItHandler({
                requestedUrl: thisRestBox.getElementsByClassName('url')[0].textContent,
                httpMethod: 'GET',
                restBoxElement: thisRestBox
            })
        }, false);

        hideItButton.addEventListener('click', function() {
            thisRestBox.getElementsByClassName('body')[0].style.display = '';
            hideItButton.style.display = '';
            expandItButton.style.display = '';
            thisRestBox.getElementsByClassName('body')[0].style.height = '';
        }, false);

        expandItButton.addEventListener('click', function() {
            thisRestBox.getElementsByClassName('body')[0].style.height = '100%';
            expandItButton.style.display = '';
        }, false)
    });
}

function tryItHandler(spec) {
    var requestedUrl = spec.requestedUrl,
        httpMethod = spec.httpMethod || 'GET',
        payload = spec.payload || null,
        restbox = spec.restBoxElement,
        bodyDiv = spec.restBoxElement.getElementsByClassName('body')[0],
        timer;
    bodyDiv.style.height = '';
    bodyDiv.style.display = 'block';
    restbox.getElementsByTagName('button')[1].style.display = 'inline-block';
    restbox.getElementsByTagName('button')[2].style.display = 'inline-block';
    bodyDiv.innerHTML = 'waiting for response';
    $.ajax({
        url: requestedUrl,
        contentType: 'application/json',
        data: payload,
        method: httpMethod,
        beforesend: addDots(),
        cache: true // setting cache to false causes _=... to be added to the queryParams
    }).then(
        function (jsonResponse) {
            window.clearInterval(timer);
            bodyDiv.innerHTML = 'All loaded, formatting...';
            bodyDiv.innerHTML =
                syntaxHighlight(JSON.stringify(jsonResponse, undefined, 2));
        },
        function (error) {
            window.clearInterval(timer);
            errorResponse =
                (error.responseJSON && error.responseJSON.error.detail)
                || error.responseText
                || error.statusText;
            if (error.status == 0) {
                errorResponse = 'No Response from the Server';
                console.log(error.statusText);
                errorCode = 'internal';
            }
            else {
                errorResponse = 'The server responded: "' + errorResponse + '"';
                errorCode = (typeof error.responseJSON == 'object' && error.responseJSON.error.status) || error.errorCode || 'unknown';
            }
            bodyDiv.lastChild.innerHTML =
                "HTTP Error " + errorCode + "\n" + errorResponse;

        }
    );

    function addDots() {
        var count = 0,
            bodyDiv = document.getElementsByClassName('restbox')[0].lastChild;
        timer = window.setInterval(function () {
            if (count++ > 22) {
                bodyDiv.innerHTML = 'Still waiting, this takes longer than expected';
                count = 0;
            }
            bodyDiv.insertAdjacentHTML('beforeend', '.');
        }, 250);
    }
}

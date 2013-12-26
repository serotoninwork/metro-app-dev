// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
            }
            else {
                restoreStateAfterSuspension();
            }

            args.setPromise(WinJS.UI.processAll().then(function completed() {
                // rating control handler
                var ratingControlDiv = document.getElementById("ratingControlDiv");
                var ratingControl = ratingControlDiv.winControl;
                ratingControl.addEventListener("change", ratingControlHandler, false);

                // greeting click handler
                var helloButton = document.getElementById("helloBtn");
                helloButton.addEventListener("click", buttonClickHandler, false);

                // user name change handler
                var nameInput = document.getElementById("nameInput");
                nameInput.addEventListener("change", nameInputChangeHandler);

                // restore user name and rating if they exist in app data
                var roamingData = Windows.Storage.ApplicationData.current.roamingSettings;
                var userName = roamingData.values["userName"];
                if (userName) {
                    nameInput.value = userName;
                }
                var rating = roamingData.values["appRating"];
                if (rating) {
                    var ratingOutput = document.getElementById("ratingOutput");
                    ratingOutput.innerText = rating;
                }
            }));
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    function buttonClickHandler(eventInfo) {
        var userName = document.getElementById("nameInput").value;
        var greetingString = "Hello, " + userName + "!";
        document.getElementById("greetingOutput").innerText = greetingString;

        // save greeting in session
        WinJS.Application.sessionState.greetingOutput = greetingString;
    }

    function ratingControlHandler(eventInfo) {
        var ratingOutput = document.getElementById("ratingOutput");
        var rating = eventInfo.detail.tentativeRating;
        ratingOutput.innerText = rating;

        // store rating to be available on multiple sessions
        var appData = Windows.Storage.ApplicationData.current;
        var roamingSettings = appData.roamingSettings;
        roamingSettings.values["appRating"] = rating;
    }

    function nameInputChangeHandler(eventInfo) {
        var nameInput = eventInfo.srcElement;

        // store name to be available on multiple sessions
        var appData = Windows.Storage.ApplicationData.current;
        var roamingSettings = appData.roamingSettings;
        roamingSettings.values["userName"] = nameInput.value;
    }

    function restoreStateAfterSuspension() {
        var greeting = WinJS.Application.sessionState.greetingOutput;
        if (greeting) {
            document.getElementById("greetingOutput").innerText = greeting;
        }
    }

    app.start();
})();

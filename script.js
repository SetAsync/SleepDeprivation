// Script.js
// I'm very tired; this code will demonstrate that.

// I'm aware other variable declaration keywords exist than Let; I don't like them.

// Elements
let SetupSection = document.getElementById("setup");
let SleepDeprivedSection = document.getElementById("sleepdeprived");
let SetupButton = document.getElementById("awoken-confirm");
let SetupInput = document.getElementById("awoken-input");
let Summary = document.getElementById("summary");
let EquivalentDisplays = [
    [document.getElementById("eq-d"), 86400, "DAYS"],
    [document.getElementById("eq-h"), 3600, "HOURS"],
    [document.getElementById("eq-m"), 60, "MINS"],
    [document.getElementById("eq-s"), 1, "SECS"]
]
let ResetButton = document.getElementById("resetbutton");

let Stages = [
    0,
    16,
    20,
    24,
    30,
    36,
    48,
    60,
    72
]

// Get Time
let Params = new URLSearchParams(window.location.search);
let AwokenEpoch = Params.get("t");

if(! AwokenEpoch) {
    AwokenEpoch = localStorage.getItem("setup");
}

// Core
function SleepDeprived() {
    let StageArray = [];
    let StageIndex = 1;
    for(let MinimumHourRequirement of Stages) {
        let Element = document.getElementById("stage-"+StageIndex);
        Element.className = "stage-tocome";

        StageArray.push({
            "MinimumHourRequirement": MinimumHourRequirement,
            "Element": Element
        });

        StageIndex += 1;
    }

    function Sync() {
        let CurrentEpoch = Math.floor(Date.now() / 1000);
        let TimeElapsed = CurrentEpoch - AwokenEpoch;

        // # SUMMARY #
        let InitialSeconds = TimeElapsed;

        let Days = Math.floor(InitialSeconds / 86400);
        InitialSeconds -= (Days * 86400)

        let Hours = Math.floor(InitialSeconds / 3600);
        InitialSeconds -= (Hours * 3600);

        let Minutes = Math.floor(InitialSeconds / 60);
        InitialSeconds -= (Minutes * 60);

        Summary.innerHTML = Days+"D "+Hours+"H "+Minutes+"M "+InitialSeconds+"S.";
    
        // # EQUIVALENT TO # //
        for(let Display of EquivalentDisplays) {
            Display[0].innerHTML = Math.floor(TimeElapsed / Display[1] * 10)/10 + " " + Display[2];
        };

        // # STAGES # //
        // This could be way more efficient, but alas:
        let ActualHours = (TimeElapsed / 3600)
        for(let Stage of StageArray) {
            if(ActualHours >= Stage["MinimumHourRequirement"]) {
                Stage.Element.className = "stage";
            }
        }
    }

    Sync();
    setInterval(Sync, 500);

    ResetButton.onclick = function() {
        localStorage.removeItem("setup");
        window.location.href = window.location.pathname;
    }
}

function Setup() {
    SetupButton.onclick = function() {
        if(SetupInput.value == "") {
            alert("Complete the required field!");
            return;
        }

        let DateValue = SetupInput.value;
        let Epoch = Math.floor(new Date(DateValue).getTime() / 1000);
        let Url = new URL(window.location.href);
        Url.searchParams.set("t", Epoch);

        window.location.href = Url;
    };
}

// Init
if( ! AwokenEpoch) {
    Setup();
    SetupSection.style = "";
} else {
    localStorage.setItem("setup", AwokenEpoch);
    SleepDeprived();
    SleepDeprivedSection.style = "";
}







/* =========================================================
   BLACK HOLE INTERACTIVE SIMULATION
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const massSlider = document.getElementById("mass");
const massValue = document.getElementById("mass-value");

const spinSlider = document.getElementById("spin");
const spinValue = document.getElementById("spin-value");

const blackHole = document.getElementById("black-hole");
const radiusValue = document.getElementById("radius-value");

const accretionDiskBack =
    document.getElementById("accretion-disk-back");

const accretionDiskFront =
    document.getElementById("accretion-disk-front");

const photonRadiusValue =
    document.getElementById("photon-radius-value");

const photonOrbit =
    document.getElementById("photon-orbit");

const rayDistanceSlider =
    document.getElementById("ray-distance");

const rayDistanceValue =
    document.getElementById("ray-distance-value");

const lightRayCanvas =
    document.getElementById("light-ray");

const deflectionValue =
    document.getElementById("deflection-value");

const photonWarning =
    document.getElementById("photon-warning");

const criticalImpactValue =
    document.getElementById("critical-impact-value");


/* =========================================================
   CANVAS
   ========================================================= */

let ctx = null;

if (lightRayCanvas) {
    ctx = lightRayCanvas.getContext("2d");
}


/* =========================================================
   TIME DILATION ELEMENTS
   ========================================================= */

const timeDistanceSlider =
    document.getElementById("time-distance");

const timeDistanceValue =
    document.getElementById("time-distance-value");

const farClock =
    document.getElementById("far-clock");

const nearClock =
    document.getElementById("near-clock");

const timeExplanation =
    document.getElementById("time-explanation");

const timeFactorDisplay =
    document.getElementById("time-factor-display");


/* =========================================================
   BLACK HOLE CALCULATION
   ========================================================= */

async function updateBlackHole() {

    if (
        !massSlider ||
        !spinSlider
    ) {
        return;
    }


    const mass =
        Number(massSlider.value);

    const spin =
        Number(spinSlider.value);


    /* -----------------------------------------
       Display values
    ----------------------------------------- */

    if (massValue) {
        massValue.textContent =
            mass.toFixed(1);
    }

    if (spinValue) {
        spinValue.textContent =
            spin.toFixed(3);
    }


    /* -----------------------------------------
       Ask backend for Kerr calculation
    ----------------------------------------- */

    try {

        const response =
            await fetch(
                `/calculate?mass=${encodeURIComponent(mass)}&spin=${encodeURIComponent(spin)}`
            );


        if (!response.ok) {
            throw new Error(
                "Calculation request failed."
            );
        }


        const data =
            await response.json();


        /* -----------------------------------------
           Physical values
        ----------------------------------------- */

        if (radiusValue) {

            radiusValue.textContent =
                Number(
                    data.event_horizon_radius
                ).toFixed(2);

        }


        if (photonRadiusValue) {

            photonRadiusValue.textContent =
                Number(
                    data.photon_sphere_radius
                ).toFixed(2);

        }


        /* -----------------------------------------
           Visual sizes
        ----------------------------------------- */

        const eventRadius =
            Number(
                data.event_horizon_radius
            );

        const photonRadius =
            Number(
                data.photon_sphere_radius
            );


        const size =
            50 + eventRadius * 2;

        const photonSize =
            50 + photonRadius * 2;


        /* -----------------------------------------
           Photon orbit
        ----------------------------------------- */

        if (photonOrbit) {

            photonOrbit.style.width =
                `${photonSize}px`;

            photonOrbit.style.height =
                `${photonSize}px`;

            photonOrbit.style.left =
                `calc(50% - ${photonSize / 2}px)`;

            photonOrbit.style.top =
                `calc(50% - ${photonSize / 2}px)`;

        }


        /* -----------------------------------------
           Black hole
        ----------------------------------------- */

        if (blackHole) {

            blackHole.style.width =
                `${size}px`;

            blackHole.style.height =
                `${size}px`;

            blackHole.style.left =
                `calc(50% - ${size / 2}px)`;

            blackHole.style.top =
                `calc(50% - ${size / 2}px)`;

        }


        /* -----------------------------------------
           Accretion disk
        ----------------------------------------- */

        // ==========================================
        // Update accretion disk
        // ==========================================

        const diskWidth = size * 4;
        const diskHeight = size * 1.3;

        [
            accretionDiskBack,
            accretionDiskFront
        ].forEach(disk => {

            if (!disk) return;

            disk.style.width =
                diskWidth + "px";

            disk.style.height =
                diskHeight + "px";

            disk.style.left =
                `calc(50% - ${diskWidth / 2}px)`;

            disk.style.top =
                `calc(50% - ${diskHeight / 2}px)`;

        });

    }

    catch (error) {

        console.error(
            "Black hole calculation error:",
            error
        );

    }

}


/* =========================================================
   LIGHT RAY
   ========================================================= */

function drawLightRay() {

    if (
        !lightRayCanvas ||
        !ctx ||
        !massSlider ||
        !rayDistanceSlider
    ) {
        return;
    }


    const mass =
        Number(massSlider.value);

    const distance =
        Number(rayDistanceSlider.value);


    /* =========================================
       Physical constants
    ========================================= */

    const G =
        6.67430e-11;

    const c =
        299792458;

    const solarMass =
        1.989e30;


    /* =========================================
       Black hole mass
    ========================================= */

    const massKg =
        mass * solarMass;


    /* =========================================
       Schwarzschild radius
    ========================================= */

    const rs =
        2 * G * massKg /
        (c * c);


    /* =========================================
       Impact parameter
    ========================================= */

    const b =
        distance * rs;


    /* =========================================
       Critical impact parameter
    ========================================= */

    const criticalImpact =
        3 * Math.sqrt(3) / 2;


    if (criticalImpactValue) {

        criticalImpactValue.textContent =
            criticalImpact.toFixed(2);

    }


    /* =========================================
       Deflection angle
    ========================================= */

    let deflectionDegrees =
        0;


    if (b > 0) {

        const deflectionAngle =
            4 * G * massKg /
            (b * c * c);


        deflectionDegrees =
            deflectionAngle *
            180 /
            Math.PI;

    }


    if (deflectionValue) {

        if (
            distance <=
            criticalImpact
        ) {

            deflectionValue.textContent =
                "Captured";

        } else {

            deflectionValue.textContent =
                deflectionDegrees.toFixed(1);

        }

    }


    /* =========================================
       Canvas size
    ========================================= */

    const parent =
        lightRayCanvas.parentElement;


    if (!parent) {
        return;
    }


    const width =
        parent.clientWidth;

    const height =
        parent.clientHeight;


    if (
        width <= 0 ||
        height <= 0
    ) {
        return;
    }


    lightRayCanvas.width =
        width;

    lightRayCanvas.height =
        height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* =========================================
       Canvas center
    ========================================= */

    const centerX =
        width / 2;

    const centerY =
        height / 2;


    /* =========================================
       Schwarzschild units
    ========================================= */

    const M =
        0.5;


    /* =========================================
       Numerical integration
    ========================================= */

    const step =
        0.01;

    const startX =
        -5;

    const endX =
        5;


    let x =
        startX;

    let y =
        distance * 0.52;

    let slope =
        0;


    const points = [];


    /* =========================================
       Integrate light path
    ========================================= */

    while (x <= endX) {

        const r =
            Math.sqrt(
                x * x +
                y * y
            );


        /* Event horizon */

        if (r <= 1.0) {
            break;
        }


        points.push({
            x: x,
            y: y
        });


        /* Gravitational bending */

        const acceleration =
            -3 *
            M *
            y /
            Math.pow(r, 5);


        slope +=
            acceleration * step;


        y +=
            slope * step;


        x +=
            step;

    }


    /* =========================================
       Draw ray
    ========================================= */

    const scale =
        50;


    if (points.length > 1) {

        ctx.beginPath();


        points.forEach(
            (point, index) => {

                const screenX =
                    centerX +
                    point.x * scale;

                const screenY =
                    centerY -
                    point.y * scale;


                if (index === 0) {

                    ctx.moveTo(
                        screenX,
                        screenY
                    );

                } else {

                    ctx.lineTo(
                        screenX,
                        screenY
                    );

                }

            }
        );


        ctx.strokeStyle =
            "white";

        ctx.lineWidth =
            3;

        ctx.shadowColor =
            "white";

        ctx.shadowBlur =
            10;


        ctx.stroke();


        /* Reset shadow */

        ctx.shadowBlur =
            0;

    }


    /* =========================================
       Status text
    ========================================= */

    if (photonWarning) {

        if (
            distance <=
            criticalImpact
        ) {

            photonWarning.textContent =
                "Light is captured by the black hole.";

        }

        else if (
            distance <
            criticalImpact + 0.4
        ) {

            photonWarning.textContent =
                "Light is near the critical orbit.";

        }

        else {

            photonWarning.textContent =
                "Light escapes the black hole.";

        }

    }

}


/* =========================================================
   RAY DISTANCE
   ========================================================= */

function updateRayDistance() {

    if (!rayDistanceSlider) {
        return;
    }


    const distance =
        Number(
            rayDistanceSlider.value
        );


    if (rayDistanceValue) {

        rayDistanceValue.textContent =
            distance.toFixed(1);

    }


    drawLightRay();

}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

if (massSlider) {

    massSlider.addEventListener(
        "input",
        updateBlackHole
    );

    massSlider.addEventListener(
        "input",
        drawLightRay
    );

}


if (spinSlider) {

    spinSlider.addEventListener(
        "input",
        updateBlackHole
    );

}


if (rayDistanceSlider) {

    rayDistanceSlider.addEventListener(
        "input",
        updateRayDistance
    );

}


/* =========================================================
   TIME DILATION
   ========================================================= */

function updateTimeDilation() {

    if (!timeDistanceSlider) {
        return;
    }


    const distance =
        Math.max(
            Number(
                timeDistanceSlider.value
            ),
            1.001
        );


    /* -----------------------------------------
       Display distance
    ----------------------------------------- */

    if (timeDistanceValue) {

        timeDistanceValue.textContent =
            distance.toFixed(2);

    }


    /* -----------------------------------------
       Time dilation factor
    ----------------------------------------- */

    const timeFactor =
        Math.sqrt(
            Math.max(
                0,
                1 - 1 / distance
            )
        );


    /* -----------------------------------------
       Clock speed
    ----------------------------------------- */

    if (farClock) {

        farClock.textContent =
            "1.00 ×";

    }


    if (nearClock) {

        nearClock.textContent =
            timeFactor.toFixed(2) +
            " ×";

    }


    /* -----------------------------------------
       Explanation
    ----------------------------------------- */

    if (timeExplanation) {

        if (distance > 5) {

            timeExplanation.textContent =
                "Far from the black hole, time passes almost normally.";

        }

        else if (distance > 2) {

            timeExplanation.textContent =
                "Closer to the black hole, time passes more slowly.";

        }

        else {

            timeExplanation.textContent =
                "Very close to the event horizon, time passes much more slowly.";

        }

    }


    /* -----------------------------------------
       Percentage
    ----------------------------------------- */

    const percentage =
        timeFactor * 100;


    if (timeFactorDisplay) {

        timeFactorDisplay.textContent =
            "Time passes at " +
            percentage.toFixed(0) +
            "% of the rate far away.";

    }

}


/* =========================================================
   CLOCK ANIMATION
   ========================================================= */

let farTime =
    0;

let nearTime =
    0;

let lastTime =
    performance.now();


function updateClocks(currentTime) {

    const deltaTime =
        (currentTime - lastTime) / 1000;


    lastTime =
        currentTime;


    if (timeDistanceSlider) {

        const distance =
            Math.max(
                Number(
                    timeDistanceSlider.value
                ),
                1.001
            );


        const timeFactor =
            Math.sqrt(
                Math.max(
                    0,
                    1 - 1 / distance
                )
            );


        /* Far clock */

        farTime +=
            deltaTime;


        /* Near clock */

        nearTime +=
            deltaTime *
            timeFactor;


        if (farClock) {

            farClock.textContent =
                formatTime(farTime);

        }


        if (nearClock) {

            nearClock.textContent =
                formatTime(nearTime);

        }

    }


    requestAnimationFrame(
        updateClocks
    );

}


/* =========================================================
   FORMAT CLOCK
   ========================================================= */

function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        Math.floor(
            seconds % 60
        );


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );

}


/* =========================================================
   TIME DILATION EVENTS
   ========================================================= */

if (timeDistanceSlider) {

    timeDistanceSlider.addEventListener(
        "input",
        updateTimeDilation
    );

}


/* =========================================================
   INFORMATION POPUPS
   ========================================================= */

const infoButtons =
    document.querySelectorAll(
        ".info-button"
    );

const infoPopups =
    document.querySelectorAll(
        ".info-popup"
    );

const infoCloseButtons =
    document.querySelectorAll(
        ".info-close"
    );


/* -----------------------------------------
   Open information panel
----------------------------------------- */

infoButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.dataset.info;


                if (!targetId) {
                    return;
                }


                const target =
                    document.getElementById(
                        targetId
                    );


                if (!target) {
                    return;
                }


                /* Close other panels */

                infoPopups.forEach(
                    popup => {

                        if (
                            popup !== target
                        ) {

                            popup.classList.remove(
                                "active"
                            );

                        }

                    }
                );


                /* Toggle current */

                target.classList.toggle(
                    "active"
                );

            }
        );

    }
);


/* -----------------------------------------
   Close information panel
----------------------------------------- */

infoCloseButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                const popup =
                    button.closest(
                        ".info-popup"
                    );


                if (popup) {

                    popup.classList.remove(
                        "active"
                    );

                }

            }
        );

    }
);


/* =========================================================
   TUTORIAL
   ========================================================= */

const tutorialOverlay =
    document.getElementById(
        "tutorial-overlay"
    );

const tutorialWindow =
    document.querySelector(
        ".tutorial-window"
    );

const tutorialTitle =
    document.getElementById(
        "tutorial-title"
    );

const tutorialText =
    document.getElementById(
        "tutorial-text"
    );

const tutorialImage =
    document.getElementById(
        "tutorial-image"
    );

const tutorialStepNumber =
    document.getElementById(
        "tutorial-step-number"
    );

const tutorialPrev =
    document.getElementById(
        "tutorial-prev"
    );

const tutorialNext =
    document.getElementById(
        "tutorial-next"
    );

const tutorialStart =
    document.getElementById(
        "tutorial-start"
    );

const tutorialClose =
    document.getElementById(
        "tutorial-close"
    );

const tutorialDots =
    document.querySelectorAll(
        ".tutorial-dot"
    );

const tutorialContent =
    document.querySelector(
        ".tutorial-content"
    );


/* =========================================================
   TUTORIAL DATA
   ========================================================= */

const tutorialSteps = [

    {
        title:
            "Step 1: Meet the Black Hole",

        text:
            "This is the event horizon. Nothing that crosses it can escape.",

        image:
            "/static/tutorial/Step_1.png"

    },

    {
        title:
            "Step 2: Change the Mass",

        text:
            "What happens when the black hole becomes more massive?",

        image:
            "/static/tutorial/Step_2.png"

    },

    {
        title:
            "Step 3: Bend the Light",

        text:
            "Move the impact parameter closer and watch the path of light bend.",

        image:
            "/static/tutorial/Step_3.png"

    },

    {
        title:
            "Step 4: Find the Photon Orbit",

        text:
            "Can you find the point where light can orbit the black hole?",

        image:
            "/static/tutorial/Step_4.png"

    },

    {
        title:
            "Step 5: Time Runs Differently",

        text:
            "Compare the clock far away with the clock near the black hole.",

        image:
            "/static/tutorial/Step_5.png"

    }

];


let currentTutorialStep =
    0;


/* =========================================================
   TUTORIAL IMAGE LOADER
   ========================================================= */

/*
   Try several common file formats.

   This makes the tutorial more tolerant if the
   image extension or capitalization is different.
*/

function loadTutorialImage(
    imagePath,
    title
) {

    if (!tutorialImage) {
        return;
    }


    tutorialImage.alt =
        title;


    /* Normal path */

    tutorialImage.src =
        imagePath;


    tutorialImage.style.display =
        "block";


    /* -----------------------------------------
       If image fails
    ----------------------------------------- */

    tutorialImage.onerror =
        function () {

            console.warn(
                "Tutorial image could not be loaded:",
                imagePath
            );


            const match =
                imagePath.match(
                    /^(.*\/)([^/]+)\.(png|jpg|jpeg)$/i
                );


            if (!match) {

                tutorialImage.style.display =
                    "none";

                return;

            }


            const folder =
                match[1];

            const filename =
                match[2];


            const extension =
                match[3].toLowerCase();


            /*
               Try alternative extensions / names.
               Stop after a few attempts.
            */

            const attempts = [

                `${folder}${filename}.png`,
                `${folder}${filename}.jpg`,
                `${folder}${filename}.jpeg`,

                `${folder}${filename.toLowerCase()}.png`,
                `${folder}${filename.toLowerCase()}.jpg`,
                `${folder}${filename.toLowerCase()}.jpeg`

            ];


            const current =
                tutorialImage.dataset.attempt || "0";

            const index =
                Number(current);


            if (
                index <
                attempts.length
            ) {

                tutorialImage.dataset.attempt =
                    String(index + 1);

                tutorialImage.src =
                    attempts[index];

            }

            else {

                /*
                   If none of the files exist,
                   hide the broken image icon.
                */

                tutorialImage.style.display =
                    "none";

            }

        };


    tutorialImage.onload =
        function () {

            tutorialImage.style.display =
                "block";

            tutorialImage.dataset.attempt =
                "0";

        };

}


/* =========================================================
   UPDATE TUTORIAL
   ========================================================= */

function updateTutorial() {

    if (
        !tutorialSteps.length ||
        !tutorialOverlay
    ) {
        return;
    }


    /* Make sure index is valid */

    if (
        currentTutorialStep < 0
    ) {

        currentTutorialStep =
            0;

    }


    if (
        currentTutorialStep >=
        tutorialSteps.length
    ) {

        currentTutorialStep =
            tutorialSteps.length - 1;

    }


    const step =
        tutorialSteps[
            currentTutorialStep
        ];


    /* -----------------------------------------
       Title
    ----------------------------------------- */

    if (tutorialTitle) {

        tutorialTitle.textContent =
            step.title;

    }


    /* -----------------------------------------
       Text
    ----------------------------------------- */

    if (tutorialText) {

        tutorialText.textContent =
            step.text;

    }


    /* -----------------------------------------
       Image
    ----------------------------------------- */

    if (tutorialImage) {

        tutorialImage.dataset.attempt =
            "0";

        loadTutorialImage(
            step.image,
            step.title
        );

    }


    /* -----------------------------------------
       Step number
    ----------------------------------------- */

    if (tutorialStepNumber) {

        tutorialStepNumber.textContent =
            String(
                currentTutorialStep + 1
            );

    }


    /* -----------------------------------------
       Dots
    ----------------------------------------- */

    tutorialDots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentTutorialStep
            );

        }
    );


    /* -----------------------------------------
       Previous button
    ----------------------------------------- */

    if (tutorialPrev) {

        tutorialPrev.style.visibility =
            currentTutorialStep === 0
                ? "hidden"
                : "visible";

    }


    /* -----------------------------------------
       Next button
    ----------------------------------------- */

    const isLastStep =
        currentTutorialStep ===
        tutorialSteps.length - 1;


    if (tutorialNext) {

        tutorialNext.style.visibility =
            isLastStep
                ? "hidden"
                : "visible";

    }


    /* -----------------------------------------
       Last step styling
    ----------------------------------------- */

    if (tutorialWindow) {

        tutorialWindow.classList.toggle(
            "last-step",
            isLastStep
        );

    }

}


/* =========================================================
   CHANGE TUTORIAL STEP
   ========================================================= */

function changeTutorialStep(
    direction
) {

    const newStep =
        currentTutorialStep +
        direction;


    /* Prevent going outside */

    if (
        newStep < 0 ||
        newStep >=
        tutorialSteps.length
    ) {

        return;

    }


    /* -----------------------------------------
       Fade animation
    ----------------------------------------- */

    if (tutorialContent) {

        tutorialContent.classList.add(
            "tutorial-changing"
        );

    }


    setTimeout(
        function () {

            currentTutorialStep =
                newStep;


            updateTutorial();


            if (tutorialContent) {

                tutorialContent.classList.remove(
                    "tutorial-changing"
                );

            }

        },
        180
    );

}


/* =========================================================
   NEXT BUTTON
   ========================================================= */

if (tutorialNext) {

    tutorialNext.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            changeTutorialStep(1);

        }
    );

}


/* =========================================================
   PREVIOUS BUTTON
   ========================================================= */

if (tutorialPrev) {

    tutorialPrev.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            changeTutorialStep(-1);

        }
    );

}


/* =========================================================
   DOT NAVIGATION
   ========================================================= */

tutorialDots.forEach(
    (dot, index) => {

        dot.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    index ===
                    currentTutorialStep
                ) {

                    return;

                }


                if (tutorialContent) {

                    tutorialContent.classList.add(
                        "tutorial-changing"
                    );

                }


                setTimeout(
                    function () {

                        currentTutorialStep =
                            index;


                        updateTutorial();


                        if (tutorialContent) {

                            tutorialContent.classList.remove(
                                "tutorial-changing"
                            );

                        }

                    },
                    180
                );

            }
        );

    }
);


/* =========================================================
   CLOSE TUTORIAL
   ========================================================= */

function closeTutorial() {

    if (!tutorialOverlay) {
        return;
    }


    /*
       Important:
       use display:none directly.

       This works regardless of the CSS
       display:flex setting.
    */

    tutorialOverlay.style.display =
        "none";


    /*
       Prevent tutorial from interfering
       with the rest of the page.
    */

    tutorialOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   OPEN TUTORIAL
   ========================================================= */

function openTutorial() {

    if (!tutorialOverlay) {
        return;
    }


    tutorialOverlay.style.display =
        "flex";


    tutorialOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    updateTutorial();

}


/* =========================================================
   X BUTTON
   ========================================================= */

if (tutorialClose) {

    tutorialClose.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            closeTutorial();

        }
    );

}


/* =========================================================
   GET STARTED BUTTON
   ========================================================= */

if (tutorialStart) {

    tutorialStart.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            closeTutorial();

        }
    );

}


/* =========================================================
   KEYBOARD CONTROL
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        /*
           If tutorial doesn't exist,
           do nothing.
        */

        if (!tutorialOverlay) {
            return;
        }


        /*
           Check actual computed visibility.

           This is more reliable than checking
           tutorialOverlay.style.display === "none".
        */

        const isVisible =
            window.getComputedStyle(
                tutorialOverlay
            ).display !== "none";


        if (!isVisible) {
            return;
        }


        /* -----------------------------------------
           Right arrow
        ----------------------------------------- */

        if (
            event.key ===
            "ArrowRight"
        ) {

            event.preventDefault();

            changeTutorialStep(1);

            return;

        }


        /* -----------------------------------------
           Left arrow
        ----------------------------------------- */

        if (
            event.key ===
            "ArrowLeft"
        ) {

            event.preventDefault();

            changeTutorialStep(-1);

            return;

        }


        /* -----------------------------------------
           X / x
        ----------------------------------------- */

        if (
            event.key === "x" ||
            event.key === "X"
        ) {

            event.preventDefault();

            closeTutorial();

            return;

        }


        /* -----------------------------------------
           Escape
        ----------------------------------------- */

        if (
            event.key ===
            "Escape"
        ) {

            event.preventDefault();

            closeTutorial();

        }

    }
);

/* =========================================================
   TUTORIAL TOGGLE
   ========================================================= */

const tutorialToggle =
    document.getElementById("tutorial-toggle");

if (tutorialToggle) {

    tutorialToggle.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            /* 每次重新打开时，从第一步开始 */
            currentTutorialStep = 0;

            openTutorial();

        }
    );

}

/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializePage() {

    /* Black hole */

    updateBlackHole();


    /* Light ray */

    updateRayDistance();


    /* Time dilation */

    updateTimeDilation();


    /* Tutorial */

    updateTutorial();


    /* Clock animation */

    requestAnimationFrame(
        updateClocks
    );

}


/* =========================================================
   START
   ========================================================= */

initializePage();
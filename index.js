import { simulate } from "./simul.js";

const canvas = document.querySelector("#mainCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

// coordenadas del canvas
const x0_canva = 10;
const y0_canva = 0; // cero es el borde

// parametros variables
let v0 = 20; // [m/s]
let angle = 60; // [degrees]
let gravity = 9.80665;

const DEFAULTS = {
    v0: 20,
    angle: 60,
    gravity: "earth"
};

const gravityList = {
    earth: 9.80665,
    moon: 1.6249,
    mars: 3.72076
}

const [x0_simul, y0_simul] = pixelsToMeters(x0_canva, y0_canva); // conversion de coordenadas a metros (no se cambian)
let [x_array, y_array] = simulate(x0_simul, y0_simul, v0, angle, 9.80665); // simulacion
drawBall(x0_canva, y0_canva)

// Se dibuja el centro de la bola desplazado +radius px hacia arriba
// para que la base toque el suelo (y = 0 física).
function drawBall(x, y, radius = 10) {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x, height - (y + radius), radius, 0, Math.PI * 2);
    ctx.fill();
}

const animationController = createAnimation();

const playButton = document.getElementById("play");
playButton.addEventListener("click", (e) => {
    animationController.start_pause();
    playButton.textContent = animationController.isRunning() ? "Pause" : "Play"
})

const stopButton = document.getElementById("stop");
stopButton.addEventListener("click", (e) => {
    animationController.stop();
    playButton.textContent = "Play";
    drawBall(x0_canva, y0_canva)
})

const slowButton = document.getElementById("slow");
slowButton.addEventListener("click", (e) => {
    animationController.slow();
    slowButton.textContent = animationController.isSlow() ? "Normal" : "Slow";
})

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", (e) => {
    inputs.forEach(input => {
        const name = input.name;
        if (DEFAULTS.hasOwnProperty(name)) {
            input.value = DEFAULTS[name]
        }
    })

    v0 = 20;
    angle = 60;
    gravity = 9.80665;

    [x_array, y_array] = simulate(x0_simul, y0_simul, v0, angle, gravity);

    drawBall(x0_canva, y0_canva)
})

const inputs = document.querySelectorAll(".param-input");
inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        const { name, value } = e.target;

        switch (e.target.name) {
            case "v0":
                v0 = Number(e.target.value);
                break;
            case "angle":
                angle = Number(e.target.value);
                break;
            case "gravity":
                gravity = gravityList[e.target.value]
                break;

            default:
                break;
        }
        [x_array, y_array] = simulate(x0_simul, y0_simul, v0, angle, gravity);
    })
})

function metersToPixels(x, y) {
    const scale = width / 20;
    return [x * scale, y * scale];
}

function pixelsToMeters(x, y) {
    const scale = width / 20;
    return [x / scale, y / scale];
}


function createAnimation() {
    let i = 0;
    let slowDelay = 20; // ms (camara lenta)
    let isRunning = false;
    let isSlow = false;

    function animateTrajectory() {

        if (!isRunning) return;
        if (i >= x_array.length) {
            isRunning = false;
            i = 0;
            playButton.textContent = "Play"; // desacoplar
            return;
        }

        let [x, y] = metersToPixels(x_array[i], y_array[i])
        drawBall(x, y);

        i++;
        setTimeout(() => {
            requestAnimationFrame(animateTrajectory); // animacion fluida
        }, isSlow ? slowDelay : 0);
    }

    return {
        start_pause() {
            if (!isRunning) {
                isRunning = true;
                animateTrajectory()
            } else {
                isRunning = false
            }
        },
        stop() {
            isRunning = false
            i = 0;
        },
        slow() {
            isSlow = !isSlow;
        },
        isRunning: () => isRunning,
        isSlow: () => isSlow
    }

}





import { simulate } from "./simul.js";

const canvas = document.querySelector("#mainCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
// console.log(`${width} ${height}`);

function drawBall(x, y, radius=10) {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x, height - y, radius, 0, Math.PI * 2); // (x, y) centro de bola
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

const x0_canva = 10;
const y0_canva = 10;
let v0 = 20; // [m/s]
let angle = 60; // [degrees]
let [x_array, y_array] = simulate(0, 0, v0, angle);

const inputs = document.querySelectorAll(".param-input");
inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        console.log(`${e.target.name} = ${e.target.value}`)
        switch (e.target.name) {
            case "v0":
                v0 = Number(e.target.value);
                break;
            case "angle":
                angle = Number(e.target.value);
                break;
        
            default:
                break;
        }
        [x_array, y_array] = simulate(0, 0, v0, angle);
    })
})

function scaleWorld2Canvas(x, y){
    let scale = width / 20; // width[px]/20[m]

    return [x0_canva + x * scale, y0_canva + y * scale]
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

        let [x, y] = scaleWorld2Canvas(x_array[i], y_array[i])
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

drawBall(x0_canva, y0_canva)



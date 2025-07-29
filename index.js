import { simulate } from "./simul.js";

const canvas = document.querySelector("#mainCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
// console.log(`${width} ${height}`);


function drawBall(x, y) {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x, height - y, 10, 0, Math.PI * 2); // (x, y) centro de bola
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
    drawBall(x0, y0)
})

const slowButton = document.getElementById("slow");
slowButton.addEventListener("click", (e) => {
    animationController.slow();
    slowButton.textContent = animationController.isSlow() ? "Normal" : "Slow";
})

const x0 = 0;
const y0 = 0;
const v0 = 20; // [m/s]
const angle = 60; // [degrees]
let [x_array, y_array] = simulate(x0, y0, v0, angle);

function createAnimation() {
    let i = 0;
    let scale = width / 20; // width[px]/20[m]
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

        let x = x_array[i] * scale;
        let y = y_array[i] * scale;
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
        slow(){
            isSlow = !isSlow;
        },
        isRunning: () => isRunning,
        isSlow: () => isSlow
    }

}

drawBall(x0, y0)



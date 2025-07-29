import { simulate } from "./simul.js";

const canvas = document.querySelector("#mainCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
console.log(`${width} ${height}`);


function drawBall(x, y) {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x, height - y, 10, 0, Math.PI * 2); // (x, y) centro de bola
    ctx.fill();
}

let isPlaying = false;

const playButton = document.getElementById("play");
playButton.addEventListener("click", (e) => {
    startAnimation();
})

const stopButton = document.getElementById("stop");
stopButton.addEventListener("click", (e) => {
    isPlaying = false;
    drawBall(x0, y0)
})

const x0 = 0;
const y0 = 0;
const v0 = 20; // [m/s]
const angle = 60; // [degrees]
let [x_array, y_array] = simulate(x0, y0, v0, angle);

function startAnimation() {
    let i = 0;
    let scale = width / 20; // width[px]/20[m]
    let delay = 0; // ms (camara lenta)
    isPlaying = true;

    function animateTrajectory() {
        if (i >= x_array.length && isPlaying) return;

        let x = x_array[i] * scale;
        let y = y_array[i] * scale;
        drawBall(x, y);

        i++;
        setTimeout(() => {
            requestAnimationFrame(animateTrajectory); // animacion fluida
        }, delay);
    }
    animateTrajectory();

}

drawBall(x0, y0)



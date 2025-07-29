import { simulate } from "./simul.js";

const canvas = document.querySelector("#mainCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
console.log(`${width} ${height}`);

// centro de bola
let x = 0;
let y = 0;

function drawBall(){
    ctx.clearRect(0,0,width,height);
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x, height - y, 10, 0, Math.PI*2);
    ctx.fill()
    // requestAnimationFrame(drawBall); // animacion fluida
}

let [x_array,y_array] = simulate();

let i = 0;
let scale = 54; // width[px]/20[m]
let delay = 0; // ms (camara lenta)
function animateTrajectory(){
    if (i >= x_array.length) return;
    
    x = x_array[i]*scale;
    y = y_array[i]*scale;
    drawBall();

    i++;
    setTimeout(() =>{
        requestAnimationFrame(animateTrajectory); // animacion fluida
    }, delay);
    
}

animateTrajectory();
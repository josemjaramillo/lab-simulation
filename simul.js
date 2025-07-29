

// const x0 = 0;
// const y0 = 0;
// const v0 = 20; // [m/s]
// const angle = 60; // [degrees]


function eqRoots(a, b, c) {
    let dis = Math.pow(b, 2) - 4 * a * c;
    if (dis < 0) {
        console.log("Complex roots, not viable solution");
        return;
    }
    let x1 = (-b + Math.sqrt(dis)) / (2 * a);
    let x2 = (-b - Math.sqrt(dis)) / (2 * a);
    return [x1, x2];
}

function calc_Yequal0(ay, vy0, y0) {
    let [t1, t2] = eqRoots(3 / 2 * ay, vy0, y0);
    let ans = t1 > 0 ? t1 : t2;
    console.log(t1, t2);
    return ans;
}

export function simulate(x0, y0, v0, angle, g = 9.80665) {
    const vx0 = v0 * Math.cos(angle * (Math.PI / 180));
    const vy0 = v0 * Math.sin(angle * (Math.PI / 180));
    const ax = 0;
    const ay = -g;
    const maxTime = calc_Yequal0(ay, vy0, y0);
    const dt = 0.01
    let x = [];
    let y = [];

    for (let t = 0; t < maxTime; t += dt) {
        //  Velocity calculation
        let vx_t = vx0 + ax * t;
        let vy_t = vy0 + ay * t;

        // Position calculation
        let x_t = x0 + vx_t * t + ax * Math.pow(t, 2) / 2;
        let y_t = y0 + vy_t * t + ay * Math.pow(t, 2) / 2;

        x.push(x_t);
        y.push(y_t);

    }
    return [x, y]
}





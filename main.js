const pageX = window.innerWidth;
const pageY = window.innerHeight;
const mass = 0.1; //kg
const area = 0.03; //m^2
const gravity = 9.81; //m*s^-2
const velocity = (d) => { return Math.sqrt(2 * 9.81 * d) };
const getRandomFloat = (min, max) => { return Math.random() * (max - min) + min; }
const bounceVelocity = (d) => { return getRandomFloat(0.4, 0.6) * Math.sqrt(2 * 9.81 * d) }
const getAirResistanceForce = (velocity) => { return 0.5 * getRandomFloat(0.44, 0.5) * area * mass * velocity * velocity };
const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) }
window.balls = [];

class Ball {
    constructor({ coords, color }) {
        this.coords = coords;
        this.color = color;
        this.draw()
    }

    draw() {
        this.ball = document.createElement("ball");
        this.ball.style.setProperty('--color', `${this.color}`);
        this.count = 0
        this.ball.textContent = this.count;
        this.ball.className = "ball";
        this.ball.style.left = this.coords[0] - (1.5 * pageX) / 100 + "px";
        this.ball.style.bottom = this.coords[1] - (1.5 * pageY) / 100 + "px";
        document.getElementById("emu").appendChild(this.ball);
        console.log("ball:", this.ball);
        console.log("coords:", this.coords);
        console.log("color:", this.color);
        this.fall()
    }

    fall() {
        let velocityWithResistance = velocity(this.coords[1]);
        var timetaken = 0;

        for (let t = 0; t < this.coords[1]; t += 0.01) {
            var airResistance = getAirResistanceForce(velocityWithResistance);
            var acceleration = (gravity - airResistance) / mass;
            velocityWithResistance += acceleration * 0.01;
            timetaken += 0.01;
        }

        timetaken /= 2 * velocityWithResistance;
        console.log("timetaken:", timetaken);

        this.ball.style.setProperty('--time', `${timetaken}s`);
        const newPos = pageY - emulator.offsetHeight - (pageY - emulator.offsetHeight) / 1;
        this.ball.style.setProperty('--newpos', `${newPos}px`);
        this.ball.classList.add("makefall");

        sleep(timetaken * 1000).then(() => {
            this.ball.style.bottom = `${newPos}px`;
            this.ball.classList.remove("makefall");
            this.oldcoords = this.coords;
            this.coords = [this.oldcoords[0], newPos];
            const bounceHeight = (bounceVelocity(this.oldcoords[1]) ** 2) / (2 * gravity);

            console.log("bounceHeight:", bounceHeight);

            if (bounceHeight > 14.5 && this.count < 10) {
                this.count += 1;
                this.ball.textContent = this.count;
                this.bounce(bounceHeight);
            }
        });
    }

    bounce(height) {
        this.oldcoords = this.coords;
        this.coords = [this.oldcoords[0], (height + (pageY - emulator.offsetHeight) / 1)];
        let velocityWithResistance = velocity(height);

        for (let t = 0; t < height; t += 0.01) {
            const airResistance = getAirResistanceForce(velocityWithResistance);
            const acceleration = (gravity - airResistance) / mass;
            velocityWithResistance += acceleration * 0.01;
        }

        const timetaken = height / (1.3 * velocityWithResistance);

        this.ball.style.setProperty('--time', `${timetaken}s`);
        this.ball.style.setProperty('--newpos', `${(height)}px`);
        this.ball.classList.add("makebounce");

        console.log("Waiting for the ball to bounce...");

        sleep(timetaken * 1000).then(async () => {
            this.ball.style.bottom = `${height}px`;
            this.ball.classList.remove("makebounce");
            this.oldcoords = this.coords;
            this.coords = [this.oldcoords[0], height + (pageY - emulator.offsetHeight)];
            await sleep(50);
            console.log("Ball has finished floating. Falling...");
            this.fall();
        })
    }
}

window.addEventListener("click", function (event) {
    var x = event.clientX - 1.7 * (pageY - emulator.offsetHeight) / 2;
    var y = -1 * (event.clientY - emulator.offsetHeight - (pageY - emulator.offsetHeight) / 2.7);
    console.log("X Coordinate: " + x);
    console.log("Y Coordinate: " + y);
    ball = new Ball({ coords: [x, y], color: "white" }); // you can adjust the color here if you want
    window.balls.push(ball)
});

window.addEventListener('load', () => {
    emulator = document.getElementById("emu");
    leftlabelpos = (pageX - emulator.offsetWidth) / 4;
    bottomlabelpos = (pageY - emulator.offsetHeight) / 4;
    for (i = 1; i <= Math.floor(emulator.offsetHeight / 100); i++) {
        p = document.createElement("plotI");
        p.className = "plotI";
        bottompos = pageY - bottomlabelpos - i * 100;
        p.style.bottom = bottompos + "px";
        p.style.left = leftlabelpos / 4 + "px";
        p.textContent = Math.floor(emulator.offsetHeight / 100) - i + 1 + 'm';
        document.body.appendChild(p);
    }
    for (i = 1; i <= Math.floor(emulator.offsetWidth / 100); i++) {
        p = document.createElement("plotI");
        p.className = "plotI";
        leftpos = pageX - leftlabelpos - i * 100;
        p.style.left = leftpos + "px";
        p.style.bottom = bottomlabelpos * 0.0 + "px";
        p.textContent = Math.floor(emulator.offsetWidth / 100) - i + 1 + "m";
        document.body.appendChild(p);
    }
})
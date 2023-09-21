const carCanvas = document.getElementById('car-canvas');

const laneWidth = 60;
const lanes = 3;

carCanvas.width = lanes * laneWidth * 1.1;

const networkCanvas = document.getElementById('network-canvas');
networkCanvas.width = 500;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, lanes);
const cars = generateCars(1000);
let bestCar = cars[0];
if (localStorage.getItem('bestBrain')) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));

        if (i !== 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.15);
        }
    }
}
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),

    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -650, 30, 50, "DUMMY", 2, getRandomColor()),

    new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -1050, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -1200, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -1200, 30, 50, "DUMMY", 2, getRandomColor()),
]

animate();

function save() {
    localStorage.setItem(
        'bestBrain',
        JSON.stringify(bestCar.brain)
    )
}

function discard() {
    localStorage.removeItem('bestBrain');
}

function generateCars(n) {
    const cars = [];
    for (let i = 0; i < n; i++) {
        cars.push(new Car(
            road.getLaneCenter(1), 100, 30, 50, 'AI', 10, 'blue'
        ));
    }

    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    // TODO this is the reward function, kind of. Look up the difference between reward function and fittness function again :)
    bestCar = cars.find(c => c.y === Math.min(...cars.map(c => c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, carCanvas.height * 0.7 - bestCar.y);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }

    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);

    carCtx.restore();
    
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}


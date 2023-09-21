const carCanvas = document.getElementById('car-canvas');

const laneWidth = 60;
const lanes = 3;

carCanvas.width = lanes * laneWidth * 1.1;

const networkCanvas = document.getElementById('network-canvas');
networkCanvas.width = 500;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, lanes);
const car = new Car(
    road.getLaneCenter(1),
    100,
    30,
    50,
    "AI"
);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
]

animate();

// function generateCars(n) {
//     const cars = [];
//     for (let i = 0; i < n; i++) {
//         cars.push(new Car(
//             road.getLaneCenter(1), 100, 30, 50, 'AI'
//         ));
//     }
//
//     return cars;
// }

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    car.update(road.borders, traffic);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, carCanvas.height * 0.7 - car.y);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'red');
    }
    car.draw(carCtx, 'blue');

    carCtx.restore();
    
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
}


class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 100;
        this.raySpread = Math.PI / 4;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic) {
        this.#castRays();
        this.readings = [];

        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(
                    this.rays[i],
                    roadBorders,
                    traffic
                )
            )
        }
    }

    #getReading(ray, roadBorders, traffic) {
        let touches = [];

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            )

            if (touch) {
                touches.push(touch);
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;

            for (let j = 0; j < poly.length; j++) {
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j + 1) % poly.length]
                )

                if (value) {
                    touches.push(value);
                }
            }
        }

        if (touches.length === 0)
            return null;

        const offsets = touches.map(({ offset }) => offset);
        const minOffset = Math.min(...offsets);

        return touches.find(({ offset }) => offset === minOffset);
    }

    #castRays() {
        this.rays = [];

        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;
            const { x, y } = this.car;
            const start = { x, y };
            const end = {
                x: x - Math.sin(rayAngle) * this.rayLength,
                y: y - Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];

            let end = ray[1];

            if (this.readings[i]) {
                end = this.readings[i];
            }

            // yellow ray
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'yellow';
            ctx.moveTo(ray[0].x, ray[0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // black ray
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(ray[1].x, ray[1].y);
            ctx.stroke();
        }
    }
}

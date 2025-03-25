let drawObjects = [];



class GameObject {
    constructor(source, name) {
        this.sourceImage = source;
        this.name = name;
        this.createElement();
        this.transform = {
            position: { x: 10, y: 10 },
            rotation: { z: 0 },
            scale: { x: 100, y: 100 },
        };
        this.drawAtTransform();
    }

    createElement() {
        const img = document.createElement("img");
        img.src = this.sourceImage;
        img.style.position = "absolute";
        img.id = this.name;
        document.getElementById("view").appendChild(img);
        this.obj = img;
    }

    drawAtTransform() {
        if (!this.obj) return;

        this.obj.style.top = `${this.transform.position.y}px`;
        this.obj.style.left = `${this.transform.position.x}px`;
        this.obj.width = this.transform.scale.x;
        this.obj.height = this.transform.scale.y;
    }
}

const obj = new GameObject("square.png", "deneme");
obj.transform.position.x = 10;
obj.transform.position.y = 0;
obj.drawAtTransform();

const obj2 = new GameObject("square.png", "deneme2");
obj2.transform.position.x = 80;
obj2.transform.position.y = 80;
obj2.drawAtTransform();

let movingRight = false;
let movingLeft = false;
let movingUp = false;
let movingDown = false;

move();

document.addEventListener("keydown", function (event) {
    if (event.key === "d") movingRight = true;
    if (event.key === "a") movingLeft = true;
    if (event.key === "w") movingUp = true;
    if (event.key === "s") movingDown = true;
});

document.addEventListener("keyup", function (event) {
    if (event.key === "d") movingRight = false;
    if (event.key === "a") movingLeft = false;
    if (event.key === "w") movingUp = false;
    if (event.key === "s") movingDown = false;
});

function move() {
    // 60 FPS güncelleme (16ms aralıklarla çalışır)
    setInterval(() => {
        if (movingRight) obj.transform.position.x += 5; // Her 16ms'de bir 5px hareket
        if (movingLeft) obj.transform.position.x -= 5;
        if (movingUp) obj.transform.position.y -= 5;
        if (movingDown) obj.transform.position.y += 5;
    
        obj.drawAtTransform();
    }, 16); // Yaklaşık 60 FPS
        
}



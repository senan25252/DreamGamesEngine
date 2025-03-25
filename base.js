let drawObjects = []
drawObjects.push(`<script src="base.js"></script>`);

class GameObject{
    static allObjects = [];
    constructor(source, name) {
        this.sourceImage = source;
        this.name = name;
        drawObjects.push(`<img src="${this.sourceImage}" style="position: absolute;" id="${this.name}">`);
        this.drawAtTransform();
    }

    transform = {
        position: {
            x: 10,
            y: 10,
        },
        rotation: {
            z: 0,
        },
        scale: {
            x: 100,
            y: 100,
        },

    };

    drawAtTransform() {
        document.getElementById("view").innerHTML = drawObjects.join("");
        const obj = document.getElementById(this.name);
        obj.style.top = `${-this.transform.position.y}px` ;
        obj.style.left = `${this.transform.position.x}px` ;
        obj.width = this.transform.scale.x;
        obj.height = this.transform.scale.y;
    }

    isSolid = false;  
}

const obj = new GameObject("square.png", "deneme");
obj.transform.position.x = 10;
obj.transform.position.y = 0;
obj.drawAtTransform();


document.addEventListener("keydown", function(event) {
    if(event.key == "w") {
        obj.transform.position.y += 5;
        obj.drawAtTransform();
    }
    if(event.key == "s") {
        obj.transform.position.y -= 5;
        obj.drawAtTransform();
    }
    if(event.key == "d") {
        obj.transform.position.x += 5;
        obj.drawAtTransform();
    }
    if(event.key == "a") {
        obj.transform.position.x -= 5;
        obj.drawAtTransform();
    }
    console.log(`${obj.transform.position.y} ${obj.transform.position.x}`);
})


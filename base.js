let drawObjects = []

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
        console.log(document.getElementById(this.name));
        console.log(drawObjects);
        document.getElementById("view").innerHTML = drawObjects;
        const obj = document.getElementById(this.name);
        obj.style.top = `${this.transform.position.y - (obj.width / 2)}em` ;
        obj.style.left = `${this.transform.position.x - (obj.height / 2)}em` ;
        obj.width = this.transform.scale.x;
        obj.height = this.transform.scale.y;
    }

    isSolid = false;  
}

const obj = new GameObject("square.png", "deneme");
obj.transform.position.x = 10;
obj.transform.position.y = 10;
obj.drawAtTransform();

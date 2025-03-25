class GameObject {
    static allObjects = [];
    constructor(source, name, isSolid) {
        GameObject.allObjects.push(this);
        this.sourceImage = source;
        this.name = name;
        this.isSolid = isSolid;
        this.createElement();
        this.transform = {
            position: { x: 10, y: 10 },
            rotation: { z: 0 },
            scale: { x: 100, y: 100 },
        };
        this.drawAtTransform();
        
    }

    static FindWithName(name) {
        if (typeof name === "string") {
            return this.allObjects.find(obj => obj.name === name);
        } else {
            console.error("Wrong Arguments");
            return null;
        }
    }

    static isCollidedWithObject(target, current) {
        const targetObj = GameObject.FindWithName(target);
        const currentObj = GameObject.FindWithName(current);
        
        if (!targetObj || !currentObj) {
            throw new Error("Object not found");
        }
    
        const targetDoc = document.getElementById(targetObj.name);
        const currentDoc = document.getElementById(currentObj.name);
    
        if (!targetDoc || !currentDoc) {
            throw new Error("HTML elements not found");
        }
    
        const targetLeft = parseInt(targetDoc.style.left) || 0;
        const targetTop = parseInt(targetDoc.style.top) || 0;
        const targetWidth = targetDoc.offsetWidth;
        const targetHeight = targetDoc.offsetHeight;
    
        const currentLeft = parseInt(currentDoc.style.left) || 0;
        const currentTop = parseInt(currentDoc.style.top) || 0;
        const currentWidth = currentDoc.offsetWidth;
        const currentHeight = currentDoc.offsetHeight;
    
        return (
            targetLeft < currentLeft + currentWidth &&
            targetLeft + targetWidth > currentLeft &&
            targetTop < currentTop + currentHeight &&
            targetTop + targetHeight > currentTop
        );
    }
    
    getAllColliders() {
        this.Others = [];
        
        GameObject.allObjects.forEach(value => {
            if (value.name !== this.name) {
                this.Others.push(value);
            }
        });
    
        this.output = [];
    
        this.Others.forEach(obj => {
            if (GameObject.isCollidedWithObject(obj.name, this.name)) {
                this.output.push(obj);
            }
        });
    
        return this.output;
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

const obj = new GameObject("square.png", "deneme", true);
obj.transform.position.x = 10;
obj.transform.position.y = 0;
obj.drawAtTransform();

const obj2 = new GameObject("square.png", "deneme2", true);
obj2.transform.position.x = 150;
obj2.transform.position.y = 150;
obj2.drawAtTransform();

const obj3 = new GameObject("square.png", "deneme3", true);
obj2.transform.position.x = 130;
obj2.transform.position.y = 130;
obj2.drawAtTransform();


console.log(GameObject.FindWithName("deneme"));

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
    setInterval(() => {
        if (movingRight) obj.transform.position.x += 5;
        if (movingLeft) obj.transform.position.x -= 5;
        if (movingUp) obj.transform.position.y -= 5;
        if (movingDown) obj.transform.position.y += 5;
    
        obj.drawAtTransform();
    }, 16);
        
}



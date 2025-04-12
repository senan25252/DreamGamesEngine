class GameObject {
    static allObjects = [];
    constructor(source, name, isSolid, hasGravity, animations) {
        this.motions = animations;

        GameObject.allObjects.push(this);
        this.sourceImage = source;
        this.name = name;
        this.isSolid = isSolid;
        this.hasGravity = hasGravity;
        this.createElement();
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.transform = {
            position: { x: 10, y: 10 },
            rotation: { z: 0 },
            scale: { x: 100, y: 100 },
        };
        this.drawAtTransform();
        this.physicLoop();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async playAnimation(index, timeout) {
        console.log(this.motions, this.motions[index]);
        console.log(index);
    
        for (const obj of this.motions[index].frames) {
            this.obj.src = obj;
            await this.delay(timeout);
        }
    }

    jump() {
        if(this.raycast({x: 0, y: 1}, this.obj.height / 2 + 1) != null) {
            console.log("grounded");
            this.velocity.y = -5;
        }
    }

    physicLoop() {
        setInterval(() => {
            if (!this.isSolid) return;

            this.transform.position.y += this.velocity.y;
            this.transform.position.x += this.velocity.x;

            if(this.hasGravity) {
                this.velocity.y += 0.1;
            }
        
            this.getAllColliders().forEach(obj => {
                let objWidth = obj.obj.offsetWidth;
                let objHeight = obj.obj.offsetHeight;
        
                let thisWidth = this.obj.offsetWidth;
                let thisHeight = this.obj.offsetHeight;
        
                this.objRightLine = obj.transform.position.x + objWidth;
                this.objLeftLine = obj.transform.position.x;
                this.objTopLine = obj.transform.position.y;
                this.objBottomLine = obj.transform.position.y + objHeight;
        
                this.thisRightLine = this.transform.position.x + thisWidth;
                this.thisBottomLine = this.transform.position.y + thisHeight;
                this.thisTopLine = this.transform.position.y;
                this.thisLeftLine = this.transform.position.x;
                
                if (this.thisBottomLine > this.objTopLine && this.thisTopLine < this.objBottomLine &&
                    this.thisRightLine > this.objLeftLine && this.thisLeftLine < this.objRightLine) {
        
                    let overlapX1 = this.thisRightLine - this.objLeftLine; 
                    let overlapX2 = this.objRightLine - this.thisLeftLine;  
                    let overlapY1 = this.thisBottomLine - this.objTopLine; 
                    let overlapY2 = this.objBottomLine - this.thisTopLine;  
        
                    let minOverlapX = Math.min(overlapX1, overlapX2);
                    let minOverlapY = Math.min(overlapY1, overlapY2);
        
                    if (minOverlapX < minOverlapY) {
                        if (overlapX1 < overlapX2) {
                            this.transform.position.x -= minOverlapX;
                        } else {
                            this.transform.position.x += minOverlapX;
                        }
                    } else {
                        if (overlapY1 < overlapY2) {
                            this.transform.position.y -= minOverlapY - (minOverlapY / 2);
                            this.velocity.y = 0;
                            
                        } else {
                            this.transform.position.y += minOverlapY;
                        }
                    }
                }
            });
        }, 16);
        
         
    }



    static FindWithName(name) {
        return typeof name === "string" ? this.allObjects.find(obj => obj.name === name) : null;
    }

    static isCollidedWithObject(target, current) {
        const targetObj = GameObject.FindWithName(target);
        const currentObj = GameObject.FindWithName(current);

        if (!targetObj || !currentObj) return false;

        const targetDoc = document.getElementById(targetObj.name);
        const currentDoc = document.getElementById(currentObj.name);

        if (!targetDoc || !currentDoc) return false;

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
        return GameObject.allObjects.filter(obj => obj.name !== this.name && GameObject.isCollidedWithObject(obj.name, this.name));
    }

    createElement() {
        const img = document.createElement("img");
        img.src = this.sourceImage;
        img.style.position = "absolute";
        img.id = this.name;
        document.getElementById("view").appendChild(img);
        this.obj = img;
        setInterval(() => {
            this.drawAtTransform();
            
        }, 16);
    }

    drawAtTransform() {
        if (!this.obj) return;
        this.obj.style.top = `${this.transform.position.y}px`;
        this.obj.style.left = `${this.transform.position.x}px`;
        this.obj.width = this.transform.scale.x;
        this.obj.height = this.transform.scale.y;

        
    }
    
    raycast(direction, length = 1000) {
        const hits = [];
    
        const startX = this.transform.position.x + this.transform.scale.x / 2;
        const startY = this.transform.position.y + this.transform.scale.y / 2;
        const endX = startX + direction.x * length;
        const endY = startY + direction.y * length;
    
        const rayLine = { x1: startX, y1: startY, x2: endX, y2: endY };
    
        for (const obj of GameObject.allObjects) {
            if (obj.name === this.name) continue;
    
            const edges = this.getBoxEdges(obj);
            for (const edge of edges) {
                const intersection = this.lineIntersect(rayLine, edge);
                if (intersection) {
                    hits.push({
                        object: obj,
                        point: intersection
                    });
                }
            }
        }
    
        if (hits.length === 0) return null;
    
        hits.sort((a, b) => {
            const distA = Math.hypot(a.point.x - startX, a.point.y - startY);
            const distB = Math.hypot(b.point.x - startX, b.point.y - startY);
            return distA - distB;
        });
    
        return hits[0]; // En yakın nesne ve çarpışma noktası
    }

    getBoxEdges(obj) {
        const x = obj.transform.position.x;
        const y = obj.transform.position.y;
        const w = obj.transform.scale.x;
        const h = obj.transform.scale.y;
    
        return [
            { x1: x, y1: y, x2: x + w, y2: y },           // top
            { x1: x + w, y1: y, x2: x + w, y2: y + h },   // right
            { x1: x + w, y1: y + h, x2: x, y2: y + h },   // bottom
            { x1: x, y1: y + h, x2: x, y2: y }            // left
        ];
    }

    lineIntersect(ray, edge) {
        const { x1, y1, x2, y2 } = ray;
        const { x1: x3, y1: y3, x2: x4, y2: y4 } = edge;
    
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denom === 0) return null;
    
        const px = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4)) / denom;
        const py = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4)) / denom;
    
        // Kesişim noktası çizgi aralıklarında mı?
        const onSegment = (x, y, xA, yA, xB, yB) =>
            x >= Math.min(xA, xB) && x <= Math.max(xA, xB) &&
            y >= Math.min(yA, yB) && y <= Math.max(yA, yB);
    
        if (
            onSegment(px, py, x1, y1, x2, y2) &&
            onSegment(px, py, x3, y3, x4, y4)
        ) {
            return { x: px, y: py };
        }
    
        return null;
    }
}

class Input {
    static axises = [];
    static keys = {};

    static AddAxis(axis) {
        this.axises.push(axis);
    }

    static init() {
        document.addEventListener('keydown', e => {
            this.keys[e.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', e => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    static GetAxis(name) {
        const axis = this.axises.find(ax => ax.name.toLowerCase() === name.toLowerCase());
        if (!axis) return 0;

        if (this.keys[axis.posKey.toLowerCase()]) return 1;
        if (this.keys[axis.negKey.toLowerCase()]) return -1;
        return 0;
    }
}


Input.init();

let horizontal = Input.GetAxis("Horizontal");
console.log(horizontal);


class Axis{
    constructor(negKey, posKey, name) {
        this.negKey = negKey;
        this.posKey = posKey;
        this.name = name;
    }
}


class motion {
    constructor(frames) {
        this.frames = frames;
    }
}

let anim = [new motion(["square.png", "squarered.jpg", "square.png"]), new motion(["squarered.jpg", "square.png", "squarered.jpg"])]

const obj = new GameObject("square.png", "deneme", true, true, anim);
obj.transform.position.x = 10;
obj.transform.position.y = 0;
obj.drawAtTransform();

const direction = { x: 0, y: 1 };


Input.AddAxis(new Axis('A', 'D', "horizontal"));
Input.AddAxis(new Axis('W', 'S', "vertical"));
setInterval(() => {
    obj.transform.position.x += Input.GetAxis("horizontal") * 3;
    obj.transform.position.y += Input.GetAxis("vertical") * 3;
}, 16);


setInterval(() => {
    obj.playAnimation(0, 1000);
}, 3000);


const obj2 = new GameObject("square.png", "deneme2", false);
obj2.transform.position.x = 300;
obj2.transform.position.y = 150;
obj2.drawAtTransform();

const obj3 = new GameObject("square.png", "deneme3", false);
obj3.transform.position.x = 0;
obj3.transform.position.y = 250;
obj3.drawAtTransform();

obj3.transform.scale.x = 1000;


function getCurrentObjects() {
    console.log(obj);
    console.log(obj2);
    console.log(obj3);
}

console.log(GameObject.FindWithName("deneme"));




document.addEventListener("keydown", function (event) {
    if (event.key === " ") obj.jump();
});
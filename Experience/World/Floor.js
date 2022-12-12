import * as THREE from "three";
import GSAP from "gsap";
import Experience from "../Experience";

export default class Floor{
    constructor(){
        this.experience = new Experience();
        this.scene=this.experience.scene;
        this.room = this.experience.world.room.actualRoom;
        this.setFloor();
        this.setCircle();
    }
    setCircle(){
        const geometry = new THREE.CircleGeometry(5,64);
        const material1 = new THREE.MeshStandardMaterial({color:"#de354c"});
        const material2 = new THREE.MeshStandardMaterial({color:"#e5a1aa"});
        const material3 = new THREE.MeshStandardMaterial({color:"#4d774e"});
        this.circleFirst=new THREE.Mesh(geometry,material1);
        this.circleSecond=new THREE.Mesh(geometry,material2);
        this.circleThird=new THREE.Mesh(geometry,material3);
        this.circleFirst.position.y=-6.3;
        this.circleSecond.position.y=-6.2;
        this.circleThird.position.y=-6.1;


        this.circleFirst.scale.set(0,0,0);
        this.circleSecond.scale.set(0,0,0);
        this.circleThird.scale.set(0,0,0);

        this.circleFirst.rotation.x=-Math.PI/2;
        this.circleSecond.rotation.x=-Math.PI/2;
        this.circleThird.rotation.x=-Math.PI/2;

        this.circleFirst.receiveShadow=true;
        this.circleSecond.receiveShadow=true;
        this.circleThird.receiveShadow=true;
        this.room.add(this.circleFirst);
        this.room.add(this.circleSecond);
        this.room.add(this.circleThird);

    }
    setFloor(){
        this.geogetry = new THREE.PlaneGeometry(220,220);
        this.material = new THREE.MeshStandardMaterial({
            color:"#96b389",
        });
        this.plane = new THREE.Mesh(this.geogetry,this.material);
        this.plane.rotation.x=-Math.PI/2;
        this.plane.position.y=-8;
        this.plane.receiveShadow = true;
        this.room.add(this.plane);
        
    }
    resize(){}
    update(){}
}
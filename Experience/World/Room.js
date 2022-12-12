import * as THREE from "three";
import GSAP from "gsap";
import Experience from "../Experience";
import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper'

export default class Room{
    constructor(){
        this.experience = new Experience();
        this.scene=this.experience.scene;
        this.time=this.experience.time;

        this.resources = this.experience.resources;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren  = {};
        this.lerp = {
            current:0,
            target:0,
            ease:0.1
        }
        
        this.setModel();
        this.setAnimation();
        this.onMouseMove();
    }

    onMouseMove(){
        document.addEventListener("mousemove",(e)=>{
            this.rotation = ((e.clientX-window.innerWidth/2)*2)/window.innerWidth;
            this.lerp.target=this.rotation*0.1;

        })
    }

    setModel(){
        this.actualRoom.children.forEach((child)=>{
            child.castShadow=true;
            child.receiveShadow=true;

            if(child instanceof THREE.Group){
                child.children.forEach((groupChild)=>{
                    groupChild.castShadow=true;
                    groupChild.receiveShadow=true;
                })
            }
            if(child.name == "Aquerium"){
                child.children.forEach((groupChild)=>{
                    if(groupChild.name=="Cube033_5"){
                        groupChild.material = new THREE.MeshPhysicalMaterial();
                        groupChild.material.roughness=0;
                        groupChild.material.color.set(0x549dd2);
                        groupChild.material.ior=3;
                        groupChild.material.transmission = 1;
                        groupChild.material.opacity=1;
                    }
                })
            }
                
            
            if(child.name == "Computer"){
                child.children.forEach((groupChild)=>{
                    if(groupChild.name=="Cube011_1"){
                        groupChild.material=new THREE.MeshBasicMaterial({
                            map:this.resources.items.screen,
                        });
                        groupChild.rotation.z=Math.PI;
                    }
                })
            }
            if(child.name==="Mini_floor"){
                child.position.x=0.897119;
                child.position.y=-9.65222;
                child.position.z=-5.42817;
                console.log("tt");
            }
            // if(child.name==="Mailbox" ||
            // child.name==="Lamp" ||
            // child.name==="Floorfirst" ||
            // child.name==="Floorsecond" ||
            // child.name==="Floorthird" ||
            // child.name==="Flower1" ||
            // child.name==="Flower2" ||
            // child.name==="Dirt"){
            //    child.scale.set(0,0,0);
            // }
            child.scale.set(0,0,0);
            if(child.name==="Cube"){
                // child.scale.set(1,1,1);
                child.position.set(0,-8,0);
                child.rotation.y = Math.PI/4;
            }
            this.roomChildren[child.name.toLowerCase()] = child;
        });
        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.11,0.11,0.11);
        // this.actualRoom.rotation.y=Math.PI;

        const width=0.5;
        const height=0.7;
        const intensity=1;
        const rectLight=new THREE.RectAreaLight(
            0xffffff,
            intensity,
            width,
            height
        );
        rectLight.position.set(9,0,0.9);
        rectLight.rotation.x=-Math.PI/2;
        // rectLight.rotation.y=-Math.PT/6;
        this.actualRoom.add(rectLight);
        this.roomChildren["rectlight"] = rectLight;

        // const rectLightHelper=new RectAreaLightHelper(rectLight);
        // rectLight.add(rectLightHelper);


        // const windowLight=new THREE.RectAreaLight(
        //     0x1a0637,
        //     3,
        //     width,
        //     height
        // );
        // windowLight.position.set(-10,10,-20);
        // // windowLight.rotation.x=-Math.PI/4;
        // windowLight.rotation.y=Math.PI+Math.PI/4;
        // this.actualRoom.add(windowLight);

        // const windowLightHelper=new RectAreaLightHelper(windowLight);
        // windowLight.add(windowLightHelper);
    }

    setAnimation(){
        this.mixer=new THREE.AnimationMixer(this.actualRoom);
        this.swim = this.mixer.clipAction(this.room.animations[0]);
        this.swim.play()
    }
    resize(){}
    update(){
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );
        this.actualRoom.rotation.y =this.lerp.current;
        this.mixer.update(this.time.delta*0.0009);
    }
}
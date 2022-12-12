import { EventEmitter } from "events";
import Experience from "./Experience";
import GSAP from "gsap";
import convert from './Utils/ConvertDivToSpan'
export default class Preloader extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.world = this.experience.world;
        this.device = this.sizes.device;
        this.world.on("worldready", () => {
            this.setAssets();
            this.playIntro();

        })
        this.sizes.on("switchdevice", (device) => {
            this.device = device;
            console.log(device)

        })

    }
    setAssets() {
        convert(document.querySelector(".intro-text"));
        convert(document.querySelector(".hero-main-title"));
        convert(document.querySelector(".hero-main-description"));
        convert(document.querySelector(".hero-second-subheading"));
        convert(document.querySelector(".second-sub"));
        this.room = this.experience.world.room.actualRoom;
        this.roomChildren = this.experience.world.room.roomChildren;
    }
    firstIntro() {
        new Promise((resolve) => {  
            this.timeline = new GSAP.timeline();
            this.timeline.to(".intro-text .animatedis",{
                y:0,
                yPercent:100
            })
            this.timeline.to(".preloader",{
                opacity:0,
                duration:1,
                onComplete:()=>{
                    document.querySelector(".preloader").classList.add("hidden")
                }
            })
            if (this.device == "mobile") {

                this.timeline.to(this.roomChildren.cube.scale, {
                    x: 1.4,
                    y: 1.4,
                    z: 1.4,
                    ease: "back.out(2.5)",
                    duration: 0.7
                }).to(this.room.position, {
                    z: -1,
                    ease: "power1.out",
                    duration: 0.7,
                })
            } else {
                this.timeline.to(this.roomChildren.cube.scale, {
                    x: 1.4,
                    y: 1.4,
                    z: 1.4,
                    ease: "back.out(2.5)",
                    duration: 0.7
                }).to(this.room.position, {
                    x: -1,
                    ease: "power1.out",
                    duration: 0.7,
                });
            }
            this.timeline.to(".intro-text .animatedis", {
                yPercent:0,
                stagger:0.05,
                ease: "back.out(1.2)",
                
            }).to(".arrow-svg-wrapper", {
                opacity:1
            },"same").to(".toggle-bar", {
                opacity:1,
                onComplete: resolve
            },"same");
        });
    }
    async onScroll(e) {
        if (e.deltaY > 0) {
            this.removeEventListenerss();
             this.playSecondIntro();
        }
    }
    onTouch(e) {
        this.initialY = e.touches[0].clientY;
    }
     onTouchMove(e) {
        let currentY = e.touches[0].clientY;
        let difference = this.initialY - currentY;
        if (difference > 0) {
             this.playSecondIntro();
            this.removeEventListenerss();
        }
        this.initialY = null;
    }
    removeEventListenerss(){
        window.removeEventListener("wheel", this.scrollOnceEvent)
        window.removeEventListener("touchstart", this.touchStart)
        window.removeEventListener("touchmove", this.touchMove)
    }
    async playIntro() {
        this.moveFlag=true;
        this.scrollOnceEvent = this.onScroll.bind(this);
        this.touchStart = this.onTouch.bind(this);
        this.touchMove = this.onTouchMove.bind(this);
        window.addEventListener("wheel", this.scrollOnceEvent)
        window.addEventListener("touchstart", this.touchStart)
        window.addEventListener("touchmove", this.touchMove)
        await this.firstIntro();
      
    }
    async playSecondIntro(){
        this.moveFlag=false;
        this.scaleFlag=true;
        await this.playSecondIntroFunc();
        this.scaleFlag=false;
        this.emit("enableControls");
    }
    playSecondIntroFunc() {
        new Promise((resolve) => {
            this.secondTimeline = new GSAP.timeline();

            this.secondTimeline.to(".intro-text .animatedis", {
                yPercent:100,
                stagger:0.05,
                ease: "back.in(1.7)"
            },"fadeout").to(".intro-text", {
                opacity:0
            }).to(".arrow-svg-wrapper", {
                opacity:0
            },"fadeout").to(this.room.position, {
                x: 0,
                y: 0,
                z: 0,
                ease: "power1.out",
            }).to(this.roomChildren.cube.rotation, {
                y: 2 * Math.PI - Math.PI / 4,
                duration:0.5
            }, "same")
                .to(this.roomChildren.cube.position, {
                    x: 0.068722,
                    y: 4.92689,
                    z: -0.252368,
                    duration:0.5
                }, "same")
                .to(this.roomChildren.cube.scale, {
                    x: 10,
                    y: 10,
                    z: 10,
                    duration:0.5
                }, "same")
                .to(this.camera.orthographicCamera.position, {
                    y: 3.5,
                    duration:0.5
                }, "same")

                .set(this.roomChildren
                    .body.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration:0.5
                }).to(this.roomChildren
                    .cube.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration:0.5
                }).to(this.roomChildren
                    .aquerium.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.2)",
                    duration: 0.5
                },'>-0.5').to(this.roomChildren
                    .clock.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.2)",
                    duration: 0.5
                },'>-0.4').to(this.roomChildren
                    .desks.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.2)",
                    duration: 0.5
                },'>-0.1').to(this.roomChildren
                    .shelve.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.2)",
                    duration: 0.5
                },'>-0.3').to(this.roomChildren
                    .mini_floor.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.2)",
                    duration: 0.5
                }).to(this.roomChildren
                    .floor_items.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.2)",
                    duration: 0.5
                },'>-0.2').to(this.roomChildren
                    .table_stuff.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.2)",
                    duration: 0.5
                },'>-0.1').to(this.roomChildren
                    .computer.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.2)",
                    duration: 0.5
                },'>-0.1').to(this.roomChildren
                    .chair.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.2)",
                    duration: 0.5
                }, "chair").to(this.roomChildren
                    .chair.rotation, {
                    y: 4 * Math.PI + Math.PI / 2,
                    ease: "power2.out",
                    duration: 1
                }, "chair").to(".arrow-svg-wrapper", {
                    opacity:1,
                }).to(".hero-main-title .animatedis", {
                    yPercent:-100,
                    stagger:0.05,
                    ease: "back.out(1.2)"
                },"introtext").to(".hero-main-description .animatedis", {
                    yPercent:-100,
                    stagger:0.05,
                    ease: "back.out(1.2)"
                },"introtext").to(".first-sub .animatedis", {
                    yPercent:-100,
                    stagger:0.05,
                    ease: "back.out(1.2)"
                },"introtext").to(".second-sub .animatedis", {
                    yPercent:-100,
                    stagger:0.05,
                    ease: "back.out(1.2)",
                    onComplete: resolve
                },"introtext")

        })

    }

    move(){
        if(this.device==="desktop"){
            this.room.position.set(-1,0,0);
        }else{
            this.room.position.set(0,0,-1);
        }
    
    }
    
    scale(){
        this.roomChildren.rectlight.width=0;

        this.roomChildren.rectlight.height=0;
                if(this.device==="desktop"){
            this.room.scale.set(0.11,0.11,0.11);
        }else{
            this.room.scale.set(0.7,0.7,0.7);
        }
    
    }
    update(){
        if(this.moveFlag){
        this.move();
        
        }
        if(this.scaleFlag){
            this.scale();
        }
    }
}


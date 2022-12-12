import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import ASScroll from "@ashthornton/asscroll";

export default class Controls{
    constructor(){
        this.experience = new Experience();
        this.scene=this.experience.scene;
        this.resources = this.experience.resources;
        this.time=this.experience.time;
        this.sizes=this.experience.sizes;
        this.camera=this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.room.children.forEach((child)=>{
            if(child.type==="RectAreaLight"){
                this.rectLight=child;
            }
        })
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;
        GSAP.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.overflow = "visible";

        this.setSmoothScroll();
        this.setScrollTrigger();
        // this.setPaths();
    
        // this.lerp = {
        //     current:0,
        //     target:0,
        //     ease:0.1
        // }
        
        // this.progress = 0;
        // this.dummyCurve = new THREE.Vector3(0,0,0);
        // this.position = new THREE.Vector3(0,0,0);
        // this.lookAtPosition = new THREE.Vector3(0,0,0);
        // this.directionalVector = new THREE.Vector3(0,0,0);
        // this.staticVector = new THREE.Vector3(0,1,0);
        // this.crossVector = new THREE.Vector3(0,0,0);

        // this.setPath();
        // this.onWheel();
    }

    setSmoothScroll(){
        this.asscroll = this.setupAsscroll();
    }

    setupAsscroll(){
        const asscroll = new ASScroll({
            ease:0.3,
            disableRaf: true
        });
    
        GSAP.ticker.add(asscroll.update);
    
        ScrollTrigger.defaults({
            scroller: asscroll.containerElement
        });
    
        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
            },
            fixedMarkers: true
        });
    
        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);
        
        requestAnimationFrame(() => {
           asscroll.enable({
                newScrollElements: document.querySelectorAll(".gsap-marker-start, .gsap-marker-end, [asscroll]")
            }); 
        });
        return asscroll;
    }
    setScrollTrigger(){
        ScrollTrigger.matchMedia({
            "(min-width:969px)":()=>{
                this.room.scale.set(0.11,0.11,0.11);
                this.room.position.set(0,0,0);
                this.rectLight.width=0.5;
                this.rectLight.height=0.7;
                
                this.firstMoveTimeline =new GSAP.timeline({
                    scrollTrigger:{
                        trigger:".first-move",
                        // markers:true,
                        start:"top top",
                        end:"bottom bottom",
                        scrub:0.6,
                        invalidateOnRefresh:true
                    }
                });
                this.firstMoveTimeline.to(this.room.position,{
                    x:()=>this.sizes.width*0.0016
                });



                this.secondMoveTimeline =new GSAP.timeline({
                    scrollTrigger:{
                        trigger:".second-move",
                        // markers:true,
                        start:"top top",
                        end:"bottom bottom",
                        scrub:0.6,
                        invalidateOnRefresh:true
                    }
                }).to(this.room.position,{
                    x:()=>{
                        return 0.5;
                    },
                    z:()=>this.sizes.height*0.0032
                },"same").to(this.room.scale,{
                    x:0.4,
                    y:0.4,
                    z:0.4
                },"same").to(this.rectLight,{
                    width:0.5*4,
                    height:0.7*4
                },"same");

                this.thirdMoveTimeline =new GSAP.timeline({
                    scrollTrigger:{
                        trigger:".third-move",
                        // markers:true,
                        start:"top top",
                        end:"bottom bottom",
                        scrub:0.6,
                        invalidateOnRefresh:true
                    }
                });
                this.thirdMoveTimeline.to(this.camera.orthographicCamera.position,{
                    x:-4.1,
                    y:-3
                });
                
            },
            "(max-width:968px)":()=>{
                this.room.scale.set(0.07,0.07,0.07);
                this.room.position.set(0,0,0);
                this.rectLight.width=0.3;
                this.rectLight.height=0.4;

                this.firstMoveTimeline =new GSAP.timeline({
                    scrollTrigger:{
                        trigger:".first-move",
                        start:"top top",
                        end:"bottom bottom",
                        scrub:0.6,
                        invalidateOnRefresh:true
                    }
                })
                // .to(this.room.scale,{
                //     x:0.1,
                //     y:0.1,
                //     z:0.1
                // })

                this.secondMoveTimeline =new GSAP.timeline({
                    scrollTrigger:{
                        trigger:".second-move",
                        // markers:true,
                        start:"top top",
                        end:"bottom bottom",
                        scrub:0.6,
                        invalidateOnRefresh:true
                    }
                }).to(this.room.position,{
                    x:()=>{
                        return 2;
                    },
                    z:()=>this.sizes.height*0.0032
                },"same").to(this.room.scale,{
                    x:0.25,
                    y:0.25,
                    z:0.25
                },"same").to(this.rectLight,{
                    width:0.3*3.4,
                    height:0.4*2.4
                },"same");

                this.thirdMoveTimeline =new GSAP.timeline({
                    scrollTrigger:{
                        trigger:".third-move",
                        // markers:true,
                        start:"top top",
                        end:"bottom bottom",
                        scrub:0.6,
                        invalidateOnRefresh:true
                    }
                }).to(this.camera.orthographicCamera.position,{
                    x:0.5,
                    y:-3
                });
            },
            all:()=>{
                this.sections = document.querySelectorAll(".section");
                this.sections.forEach((section)=>{
                    this.progressWrapper=section.querySelector(".progress-wrapper")
                    this.progressBar=section.querySelector(".progress-bar");

                    if(section.classList.contains("right")){
                        GSAP.to(section,{
                            borderTopLeftRadius:10,
                            scrollTrigger:{
                                trigger:section,
                                start:"top bottom",
                                end:"top top",
                                scrub:0.6
                            }
                        })
                        GSAP.to(section,{
                            borderBottomLeftRadius:700,
                            scrollTrigger:{
                                trigger:section,
                                start:"bottom bottom",
                                end:"bottom top",
                                scrub:0.6
                            }
                        })
                    }else{
                        GSAP.to(section,{
                            borderTopRightRadius:10,
                            scrollTrigger:{
                                trigger:section,
                                start:"top bottom",
                                end:"top top",
                                scrub:0.6
                            }
                        })
                        GSAP.to(section,{
                            borderBottomRightRadius:700,
                            scrollTrigger:{
                                trigger:section,
                                start:"bottom bottom",
                                end:"bottom top",
                                scrub:0.6
                            }
                        })
                        GSAP.from(this.progressBar,{
                            scaleY:0,
                            scrollTrigger:{
                                trigger:section,
                                start:"top top",
                                end:"bottom bottom",
                                scrub:0.4,
                                pin:this.progressBar,
                                pinSpacing:false
                            }
                        })
                    }
                })

                //circle
                this.firstMoveTimeline =new GSAP.timeline({
                    scrollTrigger:{
                        trigger:".first-move",
                        // markers:true,
                        start:"top top",
                        end:"bottom bottom",
                        scrub:0.6,
                        invalidateOnRefresh:true
                    }
                }).to(this.circleFirst.scale,{
                    x:6,
                    y:6,
                    z:6
                },"sametwo")
                // .to(this.circleFirst.position,{
                //     y:-4
                // },"sametwo");



                this.secondMoveTimeline =new GSAP.timeline({
                    scrollTrigger:{
                        trigger:".second-move",
                        // markers:true,
                        start:"top top",
                        end:"bottom bottom",
                        scrub:0.6,
                        invalidateOnRefresh:true
                    }
                }).to(this.circleSecond.scale,{
                    x:6,
                    y:6,
                    z:6
                });

                this.thirdMoveTimeline =new GSAP.timeline({
                    scrollTrigger:{
                        trigger:".third-move",
                        // markers:true,
                        start:"top top",
                        end:"bottom bottom",
                        scrub:0.6,
                        invalidateOnRefresh:true
                    }
                }).to(this.circleThird.scale,{
                    x:6,
                    y:6,
                    z:6
                });

                this.secondPartTimeline =new GSAP.timeline({
                    scrollTrigger:{
                        trigger:".third-move",
                        // markers:true,
                        start:"top top",
                        end:"bottom bottom",
                        scrub:0.6,
                        invalidateOnRefresh:true
                    }
                });

                this.room.children.forEach((child)=>{
                    if(child.name==="Mini_floor"){
                        this.zero=GSAP.to(child.position,{
                            x:-4.314004898071289,
                            z:15.044643402099611,
                            y:-5.428173542022705,
                            duration:0.3
                        })
                    }
                    if(child.name==="Mailbox"){
                        this.first=GSAP.to(child.scale,{
                            x:1,
                            z:1,
                            y:1,
                            ease:"back.out(2)",
                            duration:0.3
                        })
                    }
                    if(child.name==="Lamp"){
                        this.second=GSAP.to(child.scale,{
                            x:1,
                            z:1,
                            y:1,
                            ease:"back.out(2)",
                            duration:0.3
                        })
                    }
                    if(child.name==="Flower1"){
                        this.third=GSAP.to(child.scale,{
                            x:1,
                            z:1,
                            y:1,
                            ease:"back.out(2)",
                            duration:0.3
                        })
                    }
                    if(child.name==="Flower2"){
                        this.fourth=GSAP.to(child.scale,{
                            x:1,
                            z:1,
                            y:1,
                            ease:"back.out(2)",
                            duration:0.3
                        })
                    }
                    if(child.name==="Floorfirst"){
                        this.fifth=GSAP.to(child.scale,{
                            x:1,
                            z:1,
                            y:1,
                            ease:"back.out(2)",
                            duration:0.3
                        })
                    }
                    if(child.name==="Floorsecond"){
                        this.sixth=GSAP.to(child.scale,{
                            x:1,
                            z:1,
                            y:1,
                            ease:"back.out(2)",
                            duration:0.3
                        })
                    }
                    if(child.name==="Floorthird"){
                        this.seventh=GSAP.to(child.scale,{
                            x:1,
                            z:1,
                            y:1,
                            ease:"back.out(2)",
                            duration:0.3
                        })
                    }
                    if(child.name==="Dirt"){
                        this.eight=GSAP.to(child.scale,{
                            x:1,
                            z:1,
                            y:1,
                            ease:"back.out(2)",
                            duration:0.3
                        })
                    }
                })
                this.secondPartTimeline.add(this.zero);
                this.secondPartTimeline.add(this.first);
                this.secondPartTimeline.add(this.second);
                this.secondPartTimeline.add(this.third,"-=0.2");
                this.secondPartTimeline.add(this.fourth,"-=0.2");
                this.secondPartTimeline.add(this.fifth,"-=0.2");
                this.secondPartTimeline.add(this.sixth,"-=0.2");
                this.secondPartTimeline.add(this.seventh);
                this.secondPartTimeline.add(this.eight,"-=0.1");
            }
        })
    }

    setPaths(){
        this.timeline = new GSAP.timeline();
        // this.timeline.to(this.room.position,{
        //     x:5,
        //     duration:20
        // })
        this.timeline.to(this.room.position,{
            x:()=>this.sizes.width*0.0025,
            scrollTrigger:{
                trigger:".first-move",
                markers:true,
                start:"top top",
                end:"bottom bottom",
                scrub:0.6,
                invalidateOnRefresh:true
            }
        })
    }
    onWheel(){
        document.addEventListener("wheel",(e)=>{
            if(e.deltaY>0){
                this.lerp.target+=0.001;
                this.back=true;
            }else{
                this.lerp.target-=0.001;
                this.back=false;
            }
        })
    }
    setPath(){
        // this.curve = new THREE.CatmullRomCurve3( [
        //     new THREE.Vector3( -10, 0, 10 ),
        //     new THREE.Vector3( -5, 5, 5 ),
        //     new THREE.Vector3( 0, 0, 0 ),
        //     new THREE.Vector3( 5, -5, 5 ),
        //     new THREE.Vector3( 10, 0, 10 )
        // ] ,true);
       // ]);

       this.curve = new THREE.CatmullRomCurve3( [
        new THREE.Vector3( -5, 0, 0 ),
        new THREE.Vector3( 0,0,-5 ),
        new THREE.Vector3( 5, 0, 0 ),
        new THREE.Vector3( 0,0,5 )
    ] ,true);

        
        this.curve.getPointAt(this.progress,this.dummyCurve);
        this.camera.perspectiveCamera.position.copy(this.dummyCurve)
        
        const points = this.curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
        
        // Create the final object to add to the scene
        const curveObject = new THREE.Line( geometry, material );
        this.scene.add(curveObject)
    }

    resize(){}
    update(){
        // this.lerp.current = GSAP.utils.interpolate(
        //     this.lerp.current,
        //     this.lerp.target,
        //     this.lerp.ease
        // );
        // if(this.back) {
        //     this.lerp.target-=0.001;
        // }else{
        //     this.lerp.target+=0.001;
        // }
        // this.lerp.target = GSAP.utils.clamp(0,1,this.lerp.target);
        // this.lerp.current = GSAP.utils.clamp(0,1,this.lerp.current);
        // this.curve.getPointAt(this.lerp.current,this.position);
        // this.curve.getPointAt(this.lerp.current+0.00001,this.lookAtPosition);
        
        // this.camera.orthographicCamera.position.copy(this.position)
        // this.camera.orthographicCamera.lookAt(this.lookAtPosition)





        // this.curve.getPointAt(this.lerp.current%1,this.position);
        // this.camera.perspectiveCamera.position.copy(this.position);

        // this.directionalVector.subVectors(
        //     this.curve.getPointAt((this.lerp.current%1)+0.000001),
        //     this.position
        // );
        // this.directionalVector.normalize();
        // this.crossVector.crossVectors(
        //     this.directionalVector,
        //     this.staticVector
        // );
        // this.crossVector.multiplyScalar(100000);
        // this.camera.perspectiveCamera.lookAt(this.crossVector);
    }
}
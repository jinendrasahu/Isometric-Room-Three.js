import * as THREE from "three";
import Preloader from "./Preloader";
import Theme from "./Theme";
import assets from "./Utils/assets";
import Camera from "./Utils/Camera";
import Renderer from "./Utils/Renderer";
import Resources from "./Utils/Resources";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Controls from "./World/Controls";
import World from "./World/World";

export default class Experience{
    static instance;
    constructor(canvas){
        if(Experience.instance){
            return Experience.instance;
        }
        Experience.instance = this;
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.sizes = new Sizes();
        this.camera = new Camera();
        this.renderer= new Renderer();
        this.time = new Time();
       
        this.resources = new Resources(assets);
        this.theme = new Theme();
        this.world = new World();
        this.preloader = new Preloader();
        this.time.on("update",()=>{
            this.update();
        })
        this.sizes.on("resize",()=>{
            this.resize();
        })
        this.preloader.on("enableControls",()=>{
            // this.controls = new Controls(); 
        })

        // console.log(Experience.instance,this.sizes,canvas,this.camera)
    }

    update(){
        this.world.update();
        this.camera.update();
        this.renderer.update();
        this.preloader.update();
    }
    resize(){
        this.world.update();
        this.camera.resize();
        this.renderer.resize();
    }
}
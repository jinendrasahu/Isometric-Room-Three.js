import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Experience from "../Experience";

export default class Camera{
    constructor(){
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.canvas = this.experience.canvas;
        

        this.createPerspectiveCamera();
        this.createOrthographicCamera();
        this.setOrbitControl();

    }

    createPerspectiveCamera(){
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            35,
            this.sizes.aspect,
            0.1,
            1000
        );
        this.scene.add(this.perspectiveCamera);
        this.perspectiveCamera.position.x = 14;
        this.perspectiveCamera.position.y = 29;
        this.perspectiveCamera.position.z = 12;
    }

    createOrthographicCamera(){
        this.orthographicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect*this.sizes.frustrum)/2,
            (this.sizes.aspect*this.sizes.frustrum)/2,
            this.sizes.frustrum/2,
            -this.sizes.frustrum/2,
            -30,
            30
        );
        this.orthographicCamera.rotation.x=-Math.PI/6;
        this.orthographicCamera.position.y=2.5;
        this.orthographicCamera.position.z=5;
        // this.scene.add(this.orthographicCamera);

        // this.helper = new THREE.CameraHelper(this.orthographicCamera);
        // this.scene.add(this.helper);

        this.scene.add(this.perspectiveCamera);

        // this.helper = new THREE.CameraHelper(this.perspectiveCamera);
        // this.scene.add(this.helper);

        const size = 20;
        const division =20;

        // const gridHelper = new THREE.GridHelper(size,division);
        // this.scene.add(gridHelper);

        // const axesHelper = new THREE.AxesHelper(size);
        // this.scene.add(axesHelper);
    }

    setOrbitControl(){
        this.controls = new OrbitControls(this.perspectiveCamera,this.canvas);
        this.controls.enableDamping=true;
        this.controls.enableZoom=false;
    }

    resize(){
        this.perspectiveCamera.aspect =this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();

        this.orthographicCamera.left = (-this.sizes.aspect*this.sizes.frustrum)/2;
        this.orthographicCamera.right = (this.sizes.aspect*this.sizes.frustrum)/2;
        this.orthographicCamera.top = (this.sizes.frustrum)/2;
        this.orthographicCamera.bottom = (-this.sizes.frustrum)/2;
        this.orthographicCamera.updateProjectionMatrix();
    }

    update(){
        this.controls.update();
        // this.helper.matrixWorldNeedsUpdate=true;
        // this.helper.position.copy(this.orthographicCamera.position);
        // this.helper.position.copy(this.perspectiveCamera.position);
    }
}
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer( { antialias: false, canvas, alpha: true } );
renderer.setClearColor(0xFFFFFF, 0);
const loader = new GLTFLoader();
const viewports = [];


export function renderGLTF(elem, gltfPath, cameraDistance=0.8) {
    // Renders the gltf model located at gltfPath to a virtual viewport that spans elem.

    if (!elem) {
        console.warn("Cannot render gltf to null element");
        return;
    }

    loader.load(gltfPath, 
        (gltf) => {
            // create new scene to hold gltf
            const scene = new THREE.Scene();
            
            // camera setup
            const fov = 30;
            const aspect = 2;
            const near = 0.01;
            const far = 5;
            const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
            camera.position.set(cameraDistance, cameraDistance*2, cameraDistance);
            camera.lookAt(0, 2, 0);
            
            // light setup
            const color = 0xFFFFFF;
            const intensity = 3;
            const light = new THREE.DirectionalLight( color, intensity );
            light.position.set( - 1, 2, 4 );
            scene.add( light );

            // controls
            const controls = new TrackballControls( camera, elem );

            // add gltf to scene
            scene.add(gltf.scene);

            // autoplay gltf animation
            let mixer = new THREE.AnimationMixer(gltf.scene);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();

            // start rendering
            viewports.push({scene, camera, elem, controls, mixer});
        },
        undefined, (error) => {console.error(error)}
    );
}


let lastTime = 0.0;

function updateViewports(time) {
    let delta = (time - lastTime) * 0.001;
    lastTime = time;

    // resize renderer to display size
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if ( needResize ) {
        renderer.setSize( width, height, false );
    }

    renderer.setScissorTest(false);
    renderer.clear(true, true);
    renderer.setScissorTest(true);

    for (const {scene, camera, elem, controls, mixer} of viewports) {
        if (!elem) continue;

        const rect = elem.getBoundingClientRect();
        const { left, right, top, bottom, width, height } = rect;

        const isOffscreen = (
            bottom < 0 || top > renderer.domElement.clientHeight || 
            right < 0 || left > renderer.domElement.clientWidth
        );

        if (isOffscreen) continue;

        if (controls) {
            controls.handleResize();
            controls.update();
        }

        if (mixer) {
            mixer.update(delta);
        }

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);

        renderer.render(scene, camera);
    }

    requestAnimationFrame(updateViewports);
}

requestAnimationFrame(updateViewports);

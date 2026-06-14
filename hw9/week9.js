import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

window.addEventListener("load", () => {
  const initBtn = document.getElementById("action-trigger");
  const mainStage = document.getElementById("canvas-wrapper");
  const mask = document.getElementById("layer-blocker");
  const videoElement = document.getElementById("my-video");

  initBtn.addEventListener("click", async () => {
    mask.style.display = "none";

    const coreEngine = new MindARThree({
      container: mainStage,
      imageTargetSrc: "cat_dog.mind", 
      maxTrack: 2, 
      uiScanning: "yes",
      uiLoading: "yes"
    });

    const { scene, camera, renderer } = coreEngine;

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(1, 2, 3);
    scene.add(dLight);

   
    const videoAnchor = coreEngine.addAnchor(0);
    
    const videoTexture = new THREE.VideoTexture(videoElement);

    const planeGeometry = new THREE.PlaneGeometry(1, 0.5625); 
    const planeMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    const videoPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    
    videoAnchor.group.add(videoPlane);

    videoAnchor.onTargetFound = () => {
        videoElement.play();
    };
    videoAnchor.onTargetLost = () => {
        videoElement.pause();
    };

    const modelAnchor = coreEngine.addAnchor(1);

    let modelEntity = null;

    const loader = new GLTFLoader();
    loader.load(
      "../models/dog.glb",
      (gltf) => {
        modelEntity = gltf.scene;
        // Масштаб та позиція. Залежно від вашої моделі, ці значення треба буде змінити
        modelEntity.scale.set(1, 1, 1); 
        modelEntity.position.set(0, 0, 0);
        modelAnchor.group.add(modelEntity);
      },
      undefined,
      (error) => console.error("Помилка завантаження моделі:", error)
    );

    await coreEngine.start();
    renderer.setAnimationLoop(() => {
      if (modelEntity) {
        modelEntity.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    });
  });
});
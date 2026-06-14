import * as THREE from "three";
import { MindARThree } from "mindar-face-three";

window.addEventListener("load", () => {
  const initBtn = document.getElementById("action-trigger");
  const mainStage = document.getElementById("canvas-wrapper");
  const mask = document.getElementById("layer-blocker");

  initBtn.addEventListener("click", async () => {
    mask.style.display = "none";

    const coreEngine = new MindARThree({
      container: mainStage,
      uiScanning: "yes",
      uiLoading: "yes",
    });

    const { scene, camera, renderer } = coreEngine;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(1, 2, 3);
    scene.add(dLight);

    const textureLoader = new THREE.TextureLoader();
    
    const faceTexture = textureLoader.load('../images/face.png'); 

    const faceMesh = coreEngine.addFaceMesh();
    faceMesh.material.map = faceTexture;
    faceMesh.material.transparent = true;
    faceMesh.material.needsUpdate = true;
    
    scene.add(faceMesh);

    // Запуск рушія та циклу рендеру
    await coreEngine.start();
    
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  });
});
import { Component, NgZone, afterNextRender } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';


// LOADERS
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader';

@Component({
  selector: 'app-cube-test',
  templateUrl: './cube-test.component.html',
  styleUrl: './cube-test.component.scss'
})

export class CubeTestComponent {
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer;

  constructor(){
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    afterNextRender(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // RENDER
      this.renderer.setSize(width, height);
      this.renderer.shadowMap.enabled = true;
      document.body.appendChild(this.renderer.domElement);
  
      // CAMERA 
      const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 15);
      camera.position.set(0, 1, 5);
  
      const scene = new THREE.Scene();

      const axesHelper = new THREE.AxesHelper(5);
      //scene.add(axesHelper);

      const orbitControls = new OrbitControls(camera, this.renderer.domElement);
      orbitControls.update();
      orbitControls.minDistance = 3;
      orbitControls.maxDistance = 6.5;
      orbitControls.enablePan = false;

      window.addEventListener('mouseup', (event) => {
        const mouseWithinRenderer = this.renderer.domElement.contains(event.target as Node);

        if (mouseWithinRenderer) {
          const startPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
          const targetPosition = { x: 0, y: 1, z: 5 };
      
          // Cria uma nova animação Tween
          new TWEEN.Tween(startPosition)
            .to(targetPosition, 1000) // TEMPO 1000ms
            .easing(TWEEN.Easing.Quadratic.InOut) // TIPO DE TRANSICAO
            .onUpdate(() => {
              camera.position.set(startPosition.x, startPosition.y, startPosition.z);
              camera.lookAt(0, 1, 0);
              orbitControls.update(); 
            })
            .start(); // Inicia a animação
        }
      });


      // LUZ 
      const spotLightCenter = new THREE.SpotLight(0xffffff, 2);
      spotLightCenter.position.set(0, 5, 0); 
      spotLightCenter.castShadow = true;
      spotLightCenter.angle = Math.PI / 4; // Ângulo do cone de luz
      spotLightCenter.penumbra = 0.5; // Penumbra da luz (transição suave da luz para a sombra)
      spotLightCenter.decay = 1; // Atenuação da luz com a distância
      spotLightCenter.distance = 10; // Distância máxima que a luz alcança
      spotLightCenter.target.position.set(0, 1, 0); // Define o alvo da luz
      scene.add(spotLightCenter);

      const spotLightHelper = new THREE.SpotLightHelper(spotLightCenter);
      //scene.add(spotLightHelper);

      const spotLightFollowCamera = new THREE.SpotLight(0xff0000, 1);
      spotLightFollowCamera.position.copy(camera.position);
      spotLightFollowCamera.position.z += 2;
      spotLightFollowCamera.castShadow = true;
      spotLightFollowCamera.angle = THREE.MathUtils.degToRad(15); 
      spotLightFollowCamera.penumbra = 0.5; 
      spotLightFollowCamera.decay = 1; 
      spotLightFollowCamera.distance = 15;
      spotLightFollowCamera.target.position.set(0, 1, 0); 
      scene.add(spotLightFollowCamera);

      const spotLitHelper = new THREE.SpotLightHelper(spotLightFollowCamera);
      //scene.add(spotLitHelper);

  
      // CHAO
      const groundGeometry = new THREE.PlaneGeometry(15, 15);
      const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); 
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2; // ROTACIONA 90 graus
      ground.receiveShadow = true;
      scene.add(ground);


      // LOADER DO MODELO 3D
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('assets/3d-assets/porsche-911/scene.gltf', (gltfScene) => {

        gltfScene.scene.rotation.y = THREE.MathUtils.degToRad(-90);
        gltfScene.scene.position.set(0, 0.65, 0);
        gltfScene.scene.receiveShadow = true;

        scene.add(gltfScene.scene);
      });
  
      const animate = () => {
        const minY = 1;
        if (camera.position.y <= minY) camera.position.y = minY;

        // ANIMAR AQUI

        requestAnimationFrame(animate);
        TWEEN.update();
        this.renderer.render(scene, camera);
      };

       const resizeTela = () =>{
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight)
      };

      animate();

      window.addEventListener('resize', function() {
        resizeTela();
      });

    });
    
  }
} 

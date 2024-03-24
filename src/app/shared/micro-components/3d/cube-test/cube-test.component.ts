import { Component, NgZone, afterNextRender } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Tween } from '@tweenjs/tween.js';


// LOADERS
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader';

@Component({
  selector: 'app-cube-test',
  templateUrl: './cube-test.component.html',
  styleUrl: './cube-test.component.scss'
})
export class CubeTestComponent {

  constructor(private window: Window){
    afterNextRender(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // RENDER
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      document.body.appendChild(renderer.domElement);
  
      // CAMERA 
      const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
      camera.position.set(0, 1, 5);
  
      const scene = new THREE.Scene();

      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);


      const orbitControls = new OrbitControls(camera, renderer.domElement);
      orbitControls.update();

      window.addEventListener('mouseup', () => {
                // Posição inicial da câmera
                const startPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
                // Posição alvo da câmera (posição padrão)
                const targetPosition = { x: 0, y: 1, z: 5 };
        
                // Cria uma nova animação Tween com Tween.js
                new Tween(startPosition)
                  .to(targetPosition, 1000) 
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .onUpdate(() => {
                    camera.position.set(startPosition.x, startPosition.y, startPosition.z);
                    camera.lookAt(0, 1, 0); 
                    orbitControls.update(); 
                  })
                  .start();
      });


      // LUZ 
      const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight.position.set(0, 5, 0);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
      scene.add(lightHelper);

  
      // CHAO
      const groundGeometry = new THREE.PlaneGeometry(10, 10); // Ajuste o tamanho conforme necessário
      const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Cor cinza
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2; // ROTACIONA 90 graus
      ground.receiveShadow = true;
      scene.add(ground);


      // LOADER DO MODELO 3D
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('assets/3d-assets/porsche-911/scene.gltf', (gltfScene) => {

        gltfScene.scene.rotation.y = THREE.MathUtils.degToRad(-90);
        gltfScene.scene.position.set(0, 0.65, 0);
        gltfScene.scene.castShadow = true;

        scene.add(gltfScene.scene);
      });
  
      const animate = () => {

        // ANIMAR AQUI

        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
  
      animate();
    });
  }
} 

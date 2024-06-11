import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  Output,
  afterNextRender,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';

// LOADERS
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader';

@Component({
  selector: 'app-cube-test',
  templateUrl: './cube-test.component.html',
  styleUrl: './cube-test.component.scss',
})
export class CubeTestComponent {
  @Output() isLoading = new EventEmitter<boolean>();
  isScrolled: boolean = false;

  @Input()
  set scrolldown(value: boolean) {
    //console.log('Novo valor de scrolldown:', value);

    this.scrollDownAnimation(value);
  }
  private executeNow: boolean = false;
  public renderer!: THREE.WebGLRenderer;
  public camera!: THREE.PerspectiveCamera;
  public scene!: THREE.Scene;
  public orbitControls!: OrbitControls;

  constructor() {
    afterNextRender(() => {
      this.threeJs();
    });
  }

  private threeJs() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 15);
    this.scene = new THREE.Scene();
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    if (width <= 500) this.orbitControls.enableRotate = false;

    // RENDER
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;

    const parentEl = document.getElementById('showroomCar');
    if (parentEl) {
      var rendererDomElement = this.renderer.domElement;

      if (parentEl.firstChild) {
        parentEl.insertBefore(rendererDomElement, parentEl.firstChild);
      } else {
        parentEl.appendChild(rendererDomElement);
      }
    }

    // CAMERA
    this.camera.position.set(0, 5, 0);
    this.camera.lookAt(0, 1, 0);
    const axesHelper = new THREE.AxesHelper(5);
    //scene.add(axesHelper);

    this.orbitControls.update();
    this.orbitControls.minDistance = 3;
    this.orbitControls.maxDistance = 6.5;
    this.orbitControls.enablePan = false;
    this.orbitControls.enableZoom = false;

    window.addEventListener('mouseup', (event) => {
      const mouseWithinRenderer = this.renderer.domElement.contains(
        event.target as Node
      );

      if (mouseWithinRenderer) {
        const startPosition = {
          x: this.camera.position.x,
          y: this.camera.position.y,
          z: this.camera.position.z,
        };
        if (!this.isScrolled) {
          const targetPosition = { x: 0.0, y: 1.0, z: 4.0 };

          new TWEEN.Tween(startPosition)
            .to(targetPosition, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
              this.camera.position.set(
                startPosition.x,
                startPosition.y,
                startPosition.z
              );
              this.orbitControls.target.set(0, 1, 0);
              this.orbitControls.update();
            })
            .start();
        } else {
          const endPosition1 = { x: -4, y: 1.0, z: 1 };

          new TWEEN.Tween(startPosition)
            .to(endPosition1, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
              this.camera.position.set(
                startPosition.x,
                startPosition.y,
                startPosition.z
              );
              this.orbitControls.target.set(0, 1, 0);
              this.orbitControls.update();
            })
            .start();
        }
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Shift') {
        //console.log(event.key)
        if (this.orbitControls) {
          this.orbitControls.enableZoom = true;
          this.orbitControls.enableRotate = true;
          window.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    });

    window.addEventListener('keyup', (event) => {
      if (event.key === 'Shift') {
        if (this.orbitControls) {
          this.orbitControls.enableZoom = false;
        }
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
    this.scene.add(spotLightCenter);

    const spotLightHelper = new THREE.SpotLightHelper(spotLightCenter);
    //scene.add(spotLightHelper);

    const spotLightFollowCamera = new THREE.SpotLight(0xff0000, 1);
    spotLightFollowCamera.position.set(0, 1, 7);
    spotLightFollowCamera.castShadow = true;
    spotLightFollowCamera.angle = THREE.MathUtils.degToRad(15);
    spotLightFollowCamera.penumbra = 0.5;
    spotLightFollowCamera.decay = 1;
    spotLightFollowCamera.distance = 15;
    spotLightFollowCamera.target.position.set(0, 1, 0);
    this.scene.add(spotLightFollowCamera);

    const spotLitHelper = new THREE.SpotLightHelper(spotLightFollowCamera);
    //scene.add(spotLitHelper);

    // CHAO
    const groundGeometry = new THREE.PlaneGeometry(15, 15);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // ROTACIONA 90 graus
    ground.receiveShadow = true;
    this.scene.add(ground);

    // LOADER DO MODELO 3D
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('assets/3d-assets/porsche-911/scene.gltf', (gltfScene) => {
      gltfScene.scene.rotation.y = THREE.MathUtils.degToRad(-90);
      gltfScene.scene.position.set(0, 0.65, 0);
      gltfScene.scene.receiveShadow = true;

      this.scene.add(gltfScene.scene);

      // ANIMAO ENTRADA

      setTimeout(() => {
        this.isLoading.emit(false);

        const startPosition = { x: 0, y: 5, z: 0 };
        const endPosition = { x: 0.0, y: 1.0, z: 4 };
        new TWEEN.Tween(startPosition)
          .to(endPosition, 2000)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(() => {
            this.camera.position.set(
              startPosition.x,
              startPosition.y,
              startPosition.z
            );
            this.orbitControls.target.set(0, 1, 0);
            this.orbitControls.update();
          })
          .start();
      }, 1500);
    });

    // ANIMACOES GERAIS

    const animate = () => {
      const minY = 1;
      if (this.camera.position.y <= minY) this.camera.position.y = minY;

      //console.log(this.camera.getWorldDirection(new THREE.Vector3()));
      //console.log(this.camera.position.x, this.camera.position.y, this.camera.position.z);

      requestAnimationFrame(animate);
      TWEEN.update();
      this.renderer.render(this.scene, this.camera);
    };

    const resizeTela = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      const width = window.innerWidth;
      if (width <= 500) this.orbitControls.enableRotate = false;
      else this.orbitControls.enableRotate = true;
    };

    window.addEventListener('resize', function () {
      resizeTela();
    });

    window.onbeforeunload = () => {
      if (this.renderer) {
        this.renderer.dispose();
      }
      if (this.scene) {
        this.scene.remove();
      }
    };

    animate();
  }

  private scrollDownAnimation(startAnimation: boolean): void {
    if (this.executeNow) {
      if (startAnimation) {
        this.isScrolled = true;

        const startPosition1 = {
          x: this.camera.position.x,
          y: this.camera.position.y,
          z: this.camera.position.z,
        };
        const endPosition1 = { x: -4, y: 1.0, z: 1 };

        const tween1 = new TWEEN.Tween(startPosition1)
          .to(endPosition1, 1000)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(() => {
            this.camera.position.set(
              startPosition1.x,
              startPosition1.y,
              startPosition1.z
            );
            this.orbitControls.target.set(0, 1, 0);
            this.orbitControls.update();
          });
        tween1.start();
      } else {
        this.isScrolled = false;

        const startPosition = {
          x: this.camera.position.x,
          y: this.camera.position.y,
          z: this.camera.position.z,
        };
        const endPosition = { x: 0, y: 1, z: 4 };
        new TWEEN.Tween(startPosition)
          .to(endPosition, 2000)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(() => {
            this.camera.position.set(
              startPosition.x,
              startPosition.y,
              startPosition.z
            );
            this.orbitControls.target.set(0, 1, 0);
            this.orbitControls.update();
          })
          .start();
      }
    } else this.executeNow = true;
  }
}

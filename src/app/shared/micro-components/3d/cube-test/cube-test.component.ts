import { Component, NgZone, afterNextRender } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-cube-test',
  templateUrl: './cube-test.component.html',
  styleUrl: './cube-test.component.scss'
})
export class CubeTestComponent {

  constructor(private window: Window){
    afterNextRender(() => {
      const width = window.innerWidth, height = window.innerHeight;

      // init-

      const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
      camera.position.z = 1;

      const scene = new THREE.Scene();


      // GEOMETRY OF CUBE
      const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
      const material = new THREE.MeshNormalMaterial();
      const mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );


      // RENDER (JUNCAO DE TUDO)
      const renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setSize( width, height );
      renderer.setAnimationLoop( animation );
      document.body.appendChild( renderer.domElement );

      // animation

      function animation( time: number ) {

        mesh.rotation.x = time / 2000;
        mesh.rotation.y = time / 1000;

        renderer.render( scene, camera );

      }
    });
  }
} 

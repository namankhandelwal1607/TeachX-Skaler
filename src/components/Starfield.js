import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Starfield = () => {
  const mountRef = useRef(null);
  const starburstTimeouts = useRef([]);

  useEffect(() => {
    if (!mountRef.current) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 2 });

    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.x += 0.0005;
      stars.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };

    animate();

    const onMouseMove = (event) => {
      const mouseX = (event.clientX / width) * 2 - 1;
      const mouseY = -(event.clientY / height) * 2 + 1;
      stars.rotation.x = mouseY * 0.5;
      stars.rotation.y = mouseX * 0.5;
    };

    const createStarburst = (x, y, color, size) => {
      const starburstGeometry = new THREE.BufferGeometry();
      const starburstMaterial = new THREE.PointsMaterial({ color, size });

      const starburstCount = 400;
      const starburstPositions = new Float32Array(starburstCount * 3);

      for (let i = 0; i < starburstCount; i++) {
        starburstPositions[i * 3] = x + (Math.random() - 0.5) * 20;
        starburstPositions[i * 3 + 1] = y + (Math.random() - 0.5) * 20;
        starburstPositions[i * 3 + 2] = -Math.random() * 20;
      }

      starburstGeometry.setAttribute('position', new THREE.BufferAttribute(starburstPositions, 3));
      const starburst = new THREE.Points(starburstGeometry, starburstMaterial);
      scene.add(starburst);

      const timeout = setTimeout(() => {
        scene.remove(starburst);
      }, 500);

      starburstTimeouts.current.push(timeout);
    };

    const onClick = (event) => {
      const mouseX = (event.clientX / width) * 2 - 1;
      const mouseY = -(event.clientY / height) * 2 + 1;
      createStarburst(mouseX * 1000, mouseY * 1000, 0xffd700, 0.2);
    };

    const onDoubleClick = (event) => {
      const mouseX = (event.clientX / width) * 2 - 1;
      const mouseY = -(event.clientY / height) * 2 + 1;
      createStarburst(mouseX * 1000, mouseY * 1000, 0xff0000, 0.4);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('dblclick', onDoubleClick);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('dblclick', onDoubleClick);
      window.removeEventListener('resize', handleResize);

      starburstTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }} />;
};

export default Starfield;

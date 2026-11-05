import * as THREE from './vendor/three.module.js';

(() => {
  const canvas = document.querySelector('#player3d');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-480, 480, 260, -260, 1, 3000);
  camera.position.set(0, 0, 1400);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xdceeff, 0x4b5560, 2.1));
  const keyLight = new THREE.DirectionalLight(0xfff3db, 3.1);
  keyLight.position.set(-250, 340, 600);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x78b9ff, 1.4);
  fillLight.position.set(300, 150, 300);
  scene.add(fillLight);

  const material = (color, roughness = .65, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const sphere = new THREE.SphereGeometry(1, 20, 16);
  const cylinder = new THREE.CylinderGeometry(1, 1, 1, 16, 1);
  const models = new Map();

  function ellipsoid(parent, mat, x, y, z, sx, sy, sz, geo = sphere) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function spike(parent, mat, x, y, z, length, angle = 0) {
    const mesh = new THREE.Mesh(new THREE.ConeGeometry(4.5, length, 7), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.z = angle;
    mesh.castShadow = true;
    parent.add(mesh);
  }

  function makeLeg(parent, shirt, shorts, side) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 8, 37, 0);
    parent.add(pivot);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 5.5, 21, 12), material(shorts));
    thigh.position.y = -10.5;
    pivot.add(thigh);
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(5, 4.5, 20, 12), material('#e2e6e6'));
    shin.position.y = -30;
    pivot.add(shin);
    const sock = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 4.5, 12, 12), material(shirt));
    sock.position.y = -27;
    pivot.add(sock);
    const boot = ellipsoid(pivot, material('#18202a', .42), side * 2, -40, 4, 8, 4, 12);
    return pivot;
  }

  function makePlayer(look) {
    const root = new THREE.Group();
    const shirt = material(look.c1, .5);
    const trim = material(look.c2, .5);
    const skin = material(look.skin, .72);
    const hair = material(look.hair, .82);
    const shorts = material(look.c2, .68);
    const dark = material('#202126', .7);
    const white = material('#fff9e9', .42);
    const gold = material('#d9b65e', .4, .15);

    const torsoWidth = look.build === 'stocky' ? 25 : look.build === 'tall' ? 21 : 22;
    ellipsoid(root, shirt, 0, 51, 0, torsoWidth, 24, 13, new THREE.CapsuleGeometry(1, 1, 4, 8));
    ellipsoid(root, trim, 0, 29, 0, 18, 9, 12);
    ellipsoid(root, skin, 0, 77, 0, 6, 8, 6);

    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * 20, 65, 0);
      arm.rotation.z = -side * .12;
      root.add(arm);
      ellipsoid(arm, shirt, side * 3, -11, 0, 6, 15, 7, cylinder);
      ellipsoid(arm, skin, side * 5, -24, 1, 5, 5, 5);
    }
    const leftLeg = makeLeg(root, look.c1, look.c2, -1);
    const rightLeg = makeLeg(root, look.c1, look.c2, 1);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 96, 0);
    root.add(headGroup);
    ellipsoid(headGroup, skin, 0, 0, 0, 16, 19, 14);
    // Ears and facial planes make each head read clearly at match scale.
    for (const side of [-1, 1]) ellipsoid(headGroup, skin, side * 15.2, -1, 0, 3, 5, 3.5);
    ellipsoid(headGroup, skin, 0, -4, 13, 3.4, 4.5, 3.2);
    ellipsoid(headGroup, material('#211c1a', .4), -5.5, 3, 12.5, 2.3, 1.5, 1.2);
    ellipsoid(headGroup, material('#211c1a', .4), 5.5, 3, 12.5, 2.3, 1.5, 1.2);
    ellipsoid(headGroup, white, -5.5, 1, 13, 1.8, 1.2, 1);
    ellipsoid(headGroup, white, 5.5, 1, 13, 1.8, 1.2, 1);
    const browMat = material(look.hair, .85);
    ellipsoid(headGroup, browMat, -5.5, 6, 13, 3.1, .8, 1);
    ellipsoid(headGroup, browMat, 5.5, 6, 13, 3.1, .8, 1);
    ellipsoid(headGroup, dark, 0, -9, 12.2, 5.5, 1, 1.1);

    if (look.beard !== 'clean') {
      const beardMat = material(look.beard === 'blond' ? '#8a6c3e' : look.hair, .9);
      ellipsoid(headGroup, beardMat, 0, -11, 7, 11, 6, 8);
      ellipsoid(headGroup, skin, 0, -7, 12.2, 7.5, 4, 2.5);
      if (look.beard === 'full' || look.beard === 'trim') {
        ellipsoid(headGroup, beardMat, -12, -5, 4, 3, 7, 4);
        ellipsoid(headGroup, beardMat, 12, -5, 4, 3, 7, 4);
      }
    }

    if (look.style !== 'bald') {
      ellipsoid(headGroup, hair, 0, 12, -1, 16.5, 8, 14);
      if (look.style === 'curly' || look.style === 'longcurly') {
        for (let row = 0; row < 3; row++) for (let col = -3; col <= 3; col++) {
          const x = col * 4.4, y = 12 - row * 4.2;
          ellipsoid(headGroup, hair, x, y, 8 + (3 - Math.abs(col)) * .5, 3.7, 3.6, 3.5);
        }
      }
      if (look.style === 'mohawk') {
        ellipsoid(headGroup, material('#a87837'), 0, 19, 1, 6, 4, 10);
        for (let i = 0; i < 5; i++) spike(headGroup, hair, 0, 23 + i * .2, -7 + i * 4, 15, (i - 2) * .12);
      } else if (look.style === 'long' || look.style === 'longcurly') {
        for (const side of [-1, 1]) {
          ellipsoid(headGroup, hair, side * 13, -4, -1, 5, 19, 9);
          spike(headGroup, hair, side * 14, -22, -1, 20, side * .08);
        }
      } else if (look.style === 'slick') {
        ellipsoid(headGroup, hair, 0, 17, -4, 14, 4, 10);
        for (let i = 0; i < 3; i++) ellipsoid(headGroup, hair, -4 + i * 5, 18, 2, 5, 2, 5);
      } else if (look.style === 'fade') {
        ellipsoid(headGroup, hair, 0, 14, 1, 14, 5, 12);
        for (let i = -2; i <= 2; i++) spike(headGroup, hair, i * 4, 19, 1, 9, i * .12);
      } else if (look.style === 'short' || look.style === 'close') {
        for (let i = -2; i <= 2; i++) spike(headGroup, hair, i * 5, 18, 0, look.style === 'close' ? 4 : 8, i * .12);
      }
    }

    const number = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), material('#ffffff', .55));
    number.position.set(0, 53, 13.2);
    root.add(number);
    root.userData = { leftLeg, rightLeg, headGroup, hair, shirt, gold };
    return root;
  }

  function syncSize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    renderer.setSize(width, height, false);
  }
  new ResizeObserver(syncSize).observe(canvas.parentElement);
  syncSize();

  window.HeadSoccer3D = {
    ready: true,
    render(players) {
      const now = performance.now() / 1000;
      players.forEach((p, i) => {
        const id = p.appearance.id;
        let model = models.get(i);
        if (!model || model.userData.playerId !== id) {
          if (model) scene.remove(model);
          model = makePlayer(p.appearance);
          model.userData.playerId = id;
          models.set(i, model);
          scene.add(model);
        }
        model.position.set(p.x - 480, 260 - (p.y - 2), i * 4);
        model.rotation.y = p.facing < 0 ? -.12 : .12;
        const run = Math.min(1, Math.abs(p.vx) / 360);
        model.userData.leftLeg.rotation.x = Math.sin(now * 12 + i) * run * .62;
        model.userData.rightLeg.rotation.x = -Math.sin(now * 12 + i) * run * .62;
        model.userData.headGroup.rotation.z = p.stunned > 0 ? Math.sin(now * 18) * .025 : 0;
        model.traverse(part => {
          if (part.isMesh && part.material && part.material.emissive) {
            part.material.emissive.set(p.stunned > 0 ? '#83dfff' : '#000000');
            part.material.emissiveIntensity = p.stunned > 0 ? .5 : 0;
          }
        });
      });
      renderer.render(scene, camera);
    }
  };
})();

// Three.js 설정
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // 하늘색 배경

const camera = new THREE.PerspectiveCamera(
    90,  // FOV(시야각)를 90도로 넓게 설정
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 게임 상태
let score = 0;
let stage = 1;
let gameOver = false;
let isGameActive = true;
let health = 3;  // 초기 체력 3

// 사운드 설정
const sounds = {
    bgm: new Audio('https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3'),
    collect: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.wav'),
    stageClear: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.wav'),
    gameOver: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-failure-arcade-alert-notification-240.wav')
};

// 사운드 볼륨 설정
Object.values(sounds).forEach(sound => {
    sound.volume = 0.3;
});

// BGM 반복 재생
sounds.bgm.loop = true;

// 하트 UI 생성 함수
function createHealthUI() {
    const healthContainer = document.getElementById('health');
    healthContainer.innerHTML = '';  // 기존 하트 제거
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        if (i >= health) {
            heart.classList.add('lost');
        }
        healthContainer.appendChild(heart);
    }
}

// 게임 재시작 함수
function restartGame() {
    score = 0;
    stage = 1;
    health = 3;  // 체력 초기화
    gameOver = false;
    isGameActive = true;
    
    // UI 업데이트
    createHealthUI();
    document.getElementById('score').textContent = `점수: ${score}/10`;
    document.getElementById('stage').textContent = `스테이지: ${stage}`;
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    
    // 달걀 제거
    eggs.forEach(egg => scene.remove(egg.mesh));
    eggs = [];
    
    // 사운드 재시작
    sounds.bgm.currentTime = 0;
    sounds.bgm.play();
}

// 스테이지 클리어 함수
function clearStage() {
    stage++;
    score = 0;
    health = 3;  // 체력 초기화
    sounds.stageClear.play();
    
    // UI 업데이트
    createHealthUI();
    document.getElementById('score').textContent = `점수: ${score}/10`;
    document.getElementById('stage').textContent = `스테이지: ${stage}`;
    
    // 난이도 증가
    balloon.speed *= 1.2;
    eggSpeed *= 1.2;
    eggSpawnRate *= 1.2;
}

// 게임 오버 함수
function endGame() {
    gameOver = true;
    isGameActive = false;
    sounds.bgm.pause();
    sounds.gameOver.play();
    
    document.getElementById('gameOver').textContent = '게임 오버!';
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('restartButton').style.display = 'block';
}

// 재시작 버튼 이벤트 리스너
document.getElementById('restartButton').addEventListener('click', restartGame);

// 조명 설정
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 지면 생성
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x90EE90,
    side: THREE.DoubleSide
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -10;
ground.receiveShadow = true;
scene.add(ground);

// 구름 생성
const clouds = [];
for (let i = 0; i < 5; i++) {
    const cloudGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const cloudMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloud.position.set(
        Math.random() * 40 - 20,
        Math.random() * 10 + 5,
        Math.random() * 40 - 20
    );
    cloud.castShadow = true;
    scene.add(cloud);
    clouds.push(cloud);
}

// 열기구 생성
const balloonGeometry = new THREE.SphereGeometry(2, 32, 32);
const balloonMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff6b6b,
    shininess: 100
});
const balloonMesh = new THREE.Mesh(balloonGeometry, balloonMaterial);
balloonMesh.position.set(0, 15, 0);
balloonMesh.castShadow = true;
scene.add(balloonMesh);

// 열기구 바구니 생성
const basketGeometry = new THREE.BoxGeometry(1, 0.5, 1);
const basketMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
const basketMesh = new THREE.Mesh(basketGeometry, basketMaterial);
basketMesh.position.set(0, 13, 0);
basketMesh.castShadow = true;
scene.add(basketMesh);

// 양 생성 (더 상세한 모델)
const sheepGroup = new THREE.Group();

// 양의 몸체 (타원형)
const bodyGeometry = new THREE.SphereGeometry(1.2, 32, 24);
bodyGeometry.scale(1.2, 1, 1);  // 가로로 늘린 형태
const bodyMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xFFFFFF,
    roughness: 0.7,
    metalness: 0.1
});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.castShadow = true;
sheepGroup.add(body);

// 양의 털 표현 (여러 개의 작은 구체)
for (let i = 0; i < 50; i++) {
    const woolGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const woolMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xF8F8F8,
        roughness: 1,
        metalness: 0
    });
    const wool = new THREE.Mesh(woolGeometry, woolMaterial);
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.8 + Math.random() * 0.4;
    wool.position.set(
        Math.cos(angle) * radius,
        Math.random() * 0.5,
        Math.sin(angle) * radius
    );
    wool.scale.set(0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4);
    wool.castShadow = true;
    body.add(wool);
}

// 양의 머리
const headGeometry = new THREE.SphereGeometry(0.6, 32, 32);
const headMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xE0E0E0,
    roughness: 0.5,
    metalness: 0.1
});
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(0.8, 0.7, 0);
head.castShadow = true;
head.visible = false;  // 1인칭에서는 머리를 숨김
sheepGroup.add(head);

// 양의 얼굴
// 눈
const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.position.set(1.1, 0.8, 0.25);
const rightEye = leftEye.clone();
rightEye.position.set(1.1, 0.8, -0.25);
sheepGroup.add(leftEye);
sheepGroup.add(rightEye);

// 코
const noseGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const noseMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
const nose = new THREE.Mesh(noseGeometry, noseMaterial);
nose.position.set(1.3, 0.6, 0);
sheepGroup.add(nose);

// 양의 귀
const earGeometry = new THREE.ConeGeometry(0.2, 0.4, 16);
const earMaterial = new THREE.MeshPhongMaterial({ color: 0xD3D3D3 });
const leftEar = new THREE.Mesh(earGeometry, earMaterial);
leftEar.position.set(0.7, 1.2, 0.3);
leftEar.rotation.x = -Math.PI / 4;
const rightEar = leftEar.clone();
rightEar.position.set(0.7, 1.2, -0.3);
rightEar.rotation.x = Math.PI / 4;
sheepGroup.add(leftEar);
sheepGroup.add(rightEar);

// 양의 다리
const legGeometry = new THREE.CylinderGeometry(0.15, 0.1, 1, 16);
const legMaterial = new THREE.MeshPhongMaterial({ color: 0xD3D3D3 });
const legs = [];
const legPositions = [
    [-0.5, -0.8, 0.4],  // 왼쪽 앞다리
    [-0.5, -0.8, -0.4], // 오른쪽 앞다리
    [0.5, -0.8, 0.4],   // 왼쪽 뒷다리
    [0.5, -0.8, -0.4]   // 오른쪽 뒷다리
];

legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(...pos);
    leg.castShadow = true;
    legs.push(leg);
    sheepGroup.add(leg);
});

sheepGroup.position.set(0, -8, 0);
sheepGroup.castShadow = true;
scene.add(sheepGroup);

// 달걀 배열
let eggs = [];

// 파티클 시스템
const particleCount = 50;
const particles = new THREE.Group();
for (let i = 0; i < particleCount; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffff00,
        transparent: true,
        opacity: 0
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particles.add(particle);
}
scene.add(particles);

// 키 입력 상태
const keys = {
    left: false,
    right: false,
    space: false
};

// 키 이벤트 리스너
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === ' ' && !keys.space) {  // 스페이스바를 처음 눌렀을 때만 점프
        keys.space = true;
        sheepGroup.userData.velocity.y = 0.3;  // 점프 속도
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === ' ') keys.space = false;
});

// 양의 물리 속성 초기화
sheepGroup.userData.velocity = new THREE.Vector3(0, 0, 0);
sheepGroup.userData.gravity = 0.015;
sheepGroup.userData.isGrounded = true;
sheepGroup.userData.groundY = -8;  // 초기 Y 위치

// 달걀 생성 함수
function createEgg() {
    const eggGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const eggMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffd700,
        shininess: 100
    });
    const egg = new THREE.Mesh(eggGeometry, eggMaterial);
    egg.position.set(balloonMesh.position.x, balloonMesh.position.y - 2, balloonMesh.position.z);
    egg.castShadow = true;
    scene.add(egg);
    eggs.push({
        mesh: egg,
        speed: 0.1,
        rotation: Math.random() * Math.PI * 2
    });
}

// 파티클 효과 함수
function createParticleEffect(x, y, z) {
    particles.children.forEach(particle => {
        particle.position.set(x, y, z);
        particle.material.opacity = 1;
        particle.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            Math.random() * 0.2,
            (Math.random() - 0.5) * 0.2
        );
        particle.userData.life = 1;
    });
}

// 충돌 감지 함수
function checkCollision(egg, sheep) {
    const eggPos = egg.mesh.position;
    const sheepPos = sheep.position;
    const distance = Math.sqrt(
        Math.pow(eggPos.x - sheepPos.x, 2) +
        Math.pow(eggPos.y - sheepPos.y, 2) +
        Math.pow(eggPos.z - sheepPos.z, 2)
    );
    return distance < 2;
}

// 게임 변수
let balloon = {
    speed: 0.1,
    position: new THREE.Vector3(0, 15, 0),
    direction: 1  // 1: 오른쪽, -1: 왼쪽
};
let eggSpeed = 0.1;
let eggSpawnRate = 0.02;

// 1인칭 시점 업데이트를 위한 오프셋
const cameraOffset = {
    x: 0,
    y: 1.5,  // 양의 머리 위치에서 약간 위로
    z: 0
};

// 게임 업데이트 함수
function update() {
    if (!isGameActive) return;

    // 구름 이동
    clouds.forEach(cloud => {
        cloud.position.x += 0.01;
        if (cloud.position.x > 20) {
            cloud.position.x = -20;
        }
    });

    // 열기구 이동
    balloon.position.x += balloon.speed * balloon.direction;
    if (Math.abs(balloon.position.x) > 10) {
        balloon.direction *= -1;  // 방향 전환
        balloon.position.x = Math.sign(balloon.position.x) * 10;
    }
    balloonMesh.position.copy(balloon.position);
    basketMesh.position.x = balloon.position.x;

    // 양의 물리 업데이트
    sheepGroup.userData.velocity.y -= sheepGroup.userData.gravity;
    sheepGroup.position.y += sheepGroup.userData.velocity.y;

    // 지면 충돌 체크
    if (sheepGroup.position.y <= sheepGroup.userData.groundY) {
        sheepGroup.position.y = sheepGroup.userData.groundY;
        sheepGroup.userData.velocity.y = 0;
        sheepGroup.userData.isGrounded = true;
    } else {
        sheepGroup.userData.isGrounded = false;
    }

    // 양 이동
    if (keys.left && sheepGroup.position.x > -10) {
        sheepGroup.position.x -= 0.2;
        // 왼쪽으로 이동할 때 부드럽게 회전
        sheepGroup.rotation.y = THREE.MathUtils.lerp(
            sheepGroup.rotation.y,
            Math.PI / 4,  // 왼쪽으로 45도
            0.1  // 회전 속도
        );
    } else if (keys.right && sheepGroup.position.x < 10) {
        sheepGroup.position.x += 0.2;
        // 오른쪽으로 이동할 때 부드럽게 회전
        sheepGroup.rotation.y = THREE.MathUtils.lerp(
            sheepGroup.rotation.y,
            -Math.PI / 4,  // 오른쪽으로 45도
            0.1  // 회전 속도
        );
    } else {
        // 정지 상태일 때 정면으로 부드럽게 회전
        sheepGroup.rotation.y = THREE.MathUtils.lerp(
            sheepGroup.rotation.y,
            0,
            0.1
        );
    }

    // 달걀 생성 (랜덤하게)
    if (Math.random() < eggSpawnRate) {
        createEgg();
    }

    // 달걀 이동 및 충돌 체크
    for (let i = eggs.length - 1; i >= 0; i--) {
        eggs[i].mesh.position.y -= eggSpeed;
        eggs[i].mesh.rotation.y += 0.1;
        
        if (checkCollision(eggs[i], sheepGroup)) {
            createParticleEffect(
                eggs[i].mesh.position.x,
                eggs[i].mesh.position.y,
                eggs[i].mesh.position.z
            );
            scene.remove(eggs[i].mesh);
            eggs.splice(i, 1);
            score++;
            sounds.collect.play();
            
            document.getElementById('score').textContent = `점수: ${score}/10`;
            if (score >= 10) {
                if (stage >= 3) {
                    endGame();
                } else {
                    clearStage();
                }
            }
        } else if (eggs[i].mesh.position.y < -15) {
            scene.remove(eggs[i].mesh);
            eggs.splice(i, 1);
            health--;
            createHealthUI();
            
            if (health <= 0) {
                endGame();
            }
        }
    }

    // 파티클 업데이트
    particles.children.forEach(particle => {
        if (particle.material.opacity > 0) {
            particle.position.add(particle.userData.velocity);
            particle.userData.life -= 0.02;
            particle.material.opacity = particle.userData.life;
        }
    });

    // 카메라 위치 업데이트
    camera.position.x = sheepGroup.position.x + cameraOffset.x;
    camera.position.y = sheepGroup.position.y + cameraOffset.y;
    camera.position.z = sheepGroup.position.z + cameraOffset.z;

    // 카메라가 약간 위쪽을 바라보도록 설정
    camera.lookAt(
        camera.position.x,  // x는 현재 위치 유지
        camera.position.y + 10,  // 위쪽을 바라보도록
        camera.position.z - 5    // 약간 앞쪽도 보이도록
    );
}

// 카메라 설정
camera.position.set(0, -6.5, 0);  // 양의 머리 위치
camera.rotation.y = Math.PI;  // 앞쪽을 바라보도록 설정

// 게임 루프
function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// 창 크기 조절 대응
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 게임 시작
restartGame();
animate(); 
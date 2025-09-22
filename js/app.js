let camera, scene, renderer, controls;
const container = document.getElementById("scene-container");

// Определение слабого устройства
const isLowPerfDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Инициализация
function init() {
  // Сцена
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Камера
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  // Рендерер
  renderer = new THREE.WebGLRenderer({
    antialias: !isLowPerfDevice(),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio * (isLowPerfDevice() ? 0.75 : 1));
  container.appendChild(renderer.domElement);

  // Контролы
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 3;
  controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI / 2;

  // Загрузка модели из DataURI
  console.log("Начинаем загрузку модели...");
  const loader = new THREE.GLTFLoader();

  loader.load(
    MODEL_URI, // Используем DataURI из model-uri.js
    function (gltf) {
      console.log("Модель успешно загружена");
      scene.add(gltf.scene);
      document.getElementById("loader").style.display = "none";
    },
    function (xhr) {
      const percent = ((xhr.loaded / xhr.total) * 100).toFixed(0);
      document.querySelector(".loader-text").textContent = `Загрузка: ${percent}%`;
    },
    function (error) {
      console.error("Ошибка загрузки модели:", error);
      document.querySelector(".loader-text").textContent = "Ошибка загрузки";
    }
  );

  // Свет
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Обработчик изменения размера окна
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

init();
animate();

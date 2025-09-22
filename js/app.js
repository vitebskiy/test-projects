// Глобальные переменные
let scene, camera, renderer, controls;
let model = null;
let isModelLoaded = false;

// Инициализация Three.js сцены
function init() {
  // Создание сцены
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Небесно-голубой фон

  // Создание камеры
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  // Создание рендерера
  renderer = new THREE.WebGLRenderer({
    antialias: true, // Включаем сглаживание для качества
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio); // Используем полное разрешение
  renderer.shadowMap.enabled = true; // Включаем тени
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Мягкие тени
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Добавление рендерера в контейнер
  const container = document.getElementById("scene-container");
  container.appendChild(renderer.domElement);

  // Настройка OrbitControls для тач-устройств
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.enableRotate = true;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.5;

  // Настройки для тач-устройств
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };

  // Добавление освещения
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  scene.add(directionalLight);

  // Загрузка модели из DataURI
  console.log("Начинаем загрузку модели...");

  // Настройка DRACOLoader для сжатых моделей
  const dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

  const loader = new THREE.GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    MODEL_URI,
    function (gltf) {
      console.log("Модель успешно загружена!");
      model = gltf.scene;

      // Настройка модели
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(model);
      isModelLoaded = true;

      // Скрываем экран загрузки
      const loader = document.getElementById("loader");
      if (loader) {
        loader.style.display = "none";
      }

      console.log("Сцена готова к отображению!");
    },
    function (progress) {
      console.log("Прогресс загрузки:", (progress.loaded / progress.total) * 100 + "%");
    },
    function (error) {
      console.error("Ошибка загрузки модели:", error);
    }
  );

  // Обработка изменения размера окна
  window.addEventListener("resize", onWindowResize, false);

  // Запуск анимационного цикла
  animate();
}

// Функция анимации
function animate() {
  requestAnimationFrame(animate);

  if (controls) {
    controls.update();
  }

  renderer.render(scene, camera);
}

// Обработка изменения размера окна
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Запуск приложения
init();

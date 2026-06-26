const CACHE_NAME = 'tech-dashboard-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'icon.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// ติดตั้ง Service Worker และทำการ Cache ไฟล์นิ่ง
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// เปิดใช้และเคลียร์ Cache เวอร์ชั่นเก่า
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// จัดการดาวน์โหลดข้อมูล (เน้น Network ก่อน ถ้าไม่มีให้ดึงจาก Cache)
self.addEventListener('fetch', event => {
  if (event.request.url.includes('script.google.com')) {
    // ปล่อยให้ API ข้อมูลสดวิ่งผ่าน Network ตลอดเวลา ไม่ทำการ Cache
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

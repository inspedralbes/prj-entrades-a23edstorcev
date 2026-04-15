Para cumplir con la especificación y los principios, la arquitectura será distribuida, basada en microservicios orquestados mediante Docker (con docker-compose.dev.yml y docker-compose.prod.yml). El stack tecnológico es:

Capa Perimetral (Nginx): Actuará como Proxy Inverso y Balanceador de Carga. Implementará la directiva ip_hash para asegurar "Sticky Sessions" en las conexiones WebSocket.

Capa Frontend (Vue.js + Nuxt): SPA/SSR reactiva que consume HTTP para la carga estática y WebSockets para la actualización del mapa en tiempo real.

Clúster de Tiempo Real (Node.js + Socket.IO): Múltiples contenedores independientes de Node.js para no saturar el Event Loop monohilo. Gestionarán las conexiones persistentes, la autenticación por token y la protección contra bots mediante Rate Limiting (Token Bucket).

Motor de Estado en Memoria (Redis): Árbitro central de la concurrencia. Gestionará los bloqueos atómicos (SET NX EX 600), sincronizará las instancias de Node.js mediante Pub/Sub y disparará eventos automáticos (Keyspace Notifications) al expirar las reservas.

Capa de Persistencia y API (Laravel + MySQL): La base de datos relacional (con tablas en inglés). Laravel gestionará el panel de administración, la validación segura de los Webhooks de pago y ejecutará un Worker en segundo plano para el patrón Transactional Outbox.

Testing Stack: k6 o Artillery para simular estrés masivo en WebSockets, Cypress para flujos E2E, y PHPUnit para pruebas unitarias.
Divide la implementación de este plan en las siguientes 15 tareas atómicas y secuenciales. Debes crear la rama indicada antes de empezar cada tarea y verificar su correcto funcionamiento antes de darla por terminada:

Infraestructura y Base

Task 1 (Branch: chore/docker-setup): Configurar los archivos Docker Compose. Incluir Nginx (con ip_hash), MySQL (con volúmenes persistentes), Redis (activando notify-keyspace-events Ex), Laravel, y preparar el contenedor Node.js para soportar múltiples réplicas.

Task 2 (Branch: chore/init-docs): Inicializar los repositorios base (Laravel y Vue/Node). Crear el directorio /docs y el archivo /docs/prompts_log.md.

Capa de Persistencia (Laravel - En Inglés)

Task 3 (Branch: feature/db-schema): Crear las migraciones y modelos en INGLÉS: users, events, seat_categories, seats (solo estados: available/sold), transactions, tickets, y outbox_events.

Task 4 (Branch: feature/laravel-core-api): Implementar autenticación JWT. Crear endpoints HTTP para que el frontend obtenga la lista de eventos y el mapa inicial de asientos.

Capa de Tiempo Real (Node.js + Redis)

Task 5 (Branch: feature/node-socket-cluster): Configurar el servidor Node.js con Socket.IO utilizando @socket.io/redis-adapter para sincronizar los diferentes contenedores.

Task 6 (Branch: feature/node-middlewares): Implementar validación del JWT en el handshake de Socket.IO. Implementar el algoritmo Rate Limiting (Token Bucket) apoyado en Redis.

Task 7 (Branch: feature/node-atomic-locks): Implementar la lógica de reserva de asientos ejecutando comandos atómicos en Redis (SET seat:{id} NX EX 600) y emitiendo el resultado al cliente.

Task 8 (Branch: feature/node-keyspace-listeners): Configurar Node.js para escuchar los eventos de expiración de Redis por Pub/Sub. Al caducar los 10 min, emitir un broadcast liberando el asiento.

Consolidación de Datos (El Outbox)

Task 9 (Branch: feature/laravel-payment-webhook): Crear el endpoint en Laravel para procesar el pago. Abrir una transacción SQL, marcar el asiento como sold y crear el registro en outbox_events.

Task 10 (Branch: feature/laravel-outbox-worker): Crear un comando de consola/Worker en Laravel que lea la tabla outbox_events y publique la venta en el Pub/Sub de Redis para avisar a Node.js.

Capa Visual (Vue.js - Textos en Catalán)

Task 11 (Branch: feature/vue-layout-map): Crear el frontend base. Renderizar el mapa de asientos estático consumiendo la API de Laravel.

Task 12 (Branch: feature/vue-reactivity): Integrar el cliente de Socket.IO. Actualizar colores del mapa en tiempo real, programar el reloj de 10 minutos y solicitar el TTL a Node.js al recargar la página (Anti-F5).

Task 13 (Branch: feature/vue-graceful-degradation): Escuchar el evento disconnect del socket y bloquear la interfaz de usuario con un mensaje de "Reconnectant...".

Finalización

Task 14 (Branch: feature/admin-live-panel): Desarrollar la vista de administración en tiempo real consumiendo los contadores atómicos de Redis y los clientes conectados a Node.js.

Task 15 (Branch: test/qa-validation): Escribir los scripts de k6 para bombardear el servidor de WebSockets, y configurar Cypress para simular el ciclo completo de compra de un usuario.
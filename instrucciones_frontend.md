# CONTEXTO DEL PROYECTO: TICKETPRO (FASE UI/UX)

## 1. ESTADO ACTUAL (¡MUY IMPORTANTE!)
El proyecto es una plataforma de venta de entradas de alta demanda. 
**El Backend YA ESTÁ TERMINADO.** La API en Laravel, el servidor de WebSockets en Node.js, y la lógica de bloqueos en memoria con Redis funcionan perfectamente. 

## 2. LA REGLA DE ORO (PROHIBICIÓN ESTRICTA)
Tienes **ESTRICTAMENTE PROHIBIDO** modificar la lógica de negocio del backend. NO puedes tocar archivos PHP, controladores, bases de datos, migraciones ni la lógica central de Node.js o Socket.IO. 
**Tu único rol a partir de ahora es el de Diseñador UI/UX Frontend.** Tu trabajo es refactorizar los componentes de Vue/Nuxt.js utilizando Tailwind CSS.

## 3. SISTEMA DE DISEÑO (DESIGN SYSTEM)
Debes aplicar rigurosamente este estilo a todos los componentes de Vue:
- **Tema Premium (Dark Mode):** Fondo de la aplicación `bg-slate-900`, fondo de tarjetas o modales `bg-slate-800`, texto principal `text-white`, texto secundario `text-slate-400`.
- **Colores de Interacción (Brand):** Usa índigo para botones principales (`bg-indigo-600 hover:bg-indigo-500`).
- **Colores de los Asientos (Seats):**
  - Libre (Lliure): Verde (`bg-emerald-500`)
  - Reservado (Reservat): Amarillo (`bg-amber-500`)
  - Vendido (Venut): Gris (`bg-slate-700 opacity-50 cursor-not-allowed`)
- **Estética General:** Bordes redondeados (`rounded-xl` o `rounded-2xl`), sombras (`shadow-lg`), y transiciones suaves (`transition-all duration-300 ease-in-out`).
- **Idioma:** Todos los textos de la interfaz visibles para el usuario DEBEN estar en Catalán.

## 4. MAPA DE TAREAS SECUENCIALES
*(Debes realizar estas tareas UNA POR UNA. No pases a la siguiente hasta recibir mi confirmación. Marca con una [x] cuando completes una).*

[ ] **Paso 1: Navbar y Layout.** Modifica el Layout principal. Crea un Navbar fijo (`fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur`). Título del evento a la izquierda, usuario/menú a la derecha.
[ ] **Paso 2: Landing Page (Home).** Crea un Hero Section a pantalla completa (`min-h-screen`) con gradiente (`bg-gradient-to-b from-slate-800 to-slate-900`). Título gigante, fecha y un botón interactivo y grande de "Comprar Entrades".
[ ] **Paso 3: Sala de Espera (/cua).** Crea/Refactoriza la vista de cola virtual. Todo centrado, fondo oscuro. Añade un spinner animado grande (`animate-spin border-indigo-500`). Muestra una tarjeta estilizada con variables (pueden ser mockeadas): "Persones davant teu" y "Temps estimat".
[ ] **Paso 4: Mapa de Asientos.** Refactoriza la vista principal SIN romper la lógica de Socket.IO actual.
    - Añade un Sticky Header con un indicador de conexión (punto verde) y la **cuenta atrás en texto rojo gigante** (`text-red-500 font-mono text-3xl animate-pulse`) cuando haya un asiento seleccionado.
    - Renderiza los asientos en CSS Grid. Aplica los colores del Design System según el estado del asiento.
    - Al seleccionar un asiento libre, muestra un Modal superpuesto (`backdrop-blur-sm bg-black/50`) con el resumen de la compra y el botón de pago.
[ ] **Paso 5: Mis Entradas.** Refactoriza la vista de tickets. Muéstralos en un Grid. Dales aspecto de ticket físico: degradado de fondo, borde lateral punteado (`border-dashed border-slate-600`) y un cuadrado blanco que simule un código QR.


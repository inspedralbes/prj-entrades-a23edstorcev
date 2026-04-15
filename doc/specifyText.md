¿Qué vamos a construir?
Vamos a desarrollar una plataforma web para la venta de entradas de eventos sometidos a una demanda masiva y concurrente. El sistema presentará un mapa interactivo de asientos. Cuando un usuario hace clic en un asiento, este se bloquea de forma exclusiva para él durante un máximo de 10 minutos.
Si el usuario completa el proceso de pago en ese tiempo, la entrada se marca como vendida permanentemente. Si el tiempo expira, el asiento se libera de forma automática para el resto de los usuarios. Todo esto debe ocurrir sincronizado en tiempo real en las pantallas de todos los espectadores conectados. Incluirá también un panel de administración en vivo.

¿Por qué lo construimos así?
Para erradicar el problema del "overbooking" y la frustración del cliente en eventos de alta demanda. El sistema debe ser capaz de procesar una "estampida" donde miles de usuarios intentan adquirir el mismo asiento en el mismo milisegundo. Debe garantizar matemáticamente la exclusión mutua: solo el primero obtiene la reserva, rechazando al resto en fracciones de segundo y actualizando el mapa global al instante para asegurar un proceso justo y transparente.

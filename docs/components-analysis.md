# Análisis de nuevos componentes de notas

## FloatingNotesPanel (`src/components/luwak/FloatingNotesPanel.tsx`)
- Renderiza un botón flotante con ícono de nota que abre un panel modal anclado al borde inferior-derecho.
- El panel muestra un encabezado con botón de cierre y texto informativo placeholder para las notas del personal.
- Pendiente: conectar con datos reales y reemplazar el texto estático por contenido proveniente de la base de datos.

## NotesFab (`src/components/luwak/NotesFab.tsx`)
- Botón flotante que abre/cierra una tarjeta de notas compacta.
- Obtiene notas desde `useOrders` y filtra solo las creadas por roles `chef`, `ayudante` o `admin`, ordenándolas por fecha descendente.
- Muestra autor, rol y hora local; cuando no hay notas muestra un mensaje vacío.
- Pendiente: el botón se muestra aun sin usuario autenticado; podría ocultarse o ajustar el mensaje según sea necesario.

## NotesProvider (`src/components/notes/NotesProvider.tsx`)
- Proveedor de contexto cliente para gestionar notas en memoria.
- Expone operaciones `addNote`, `updateNote`, `deleteNote` y `clearNotes`, generando IDs con `crypto.randomUUID` y estampando `createdAt` ISO.
- Pendiente: persistir notas (API o almacenamiento local) y sincronizar con roles/usuarios reales.

## Recomendaciones generales
- Unificar `NotesProvider` con la fuente de datos usada en `useOrders` para evitar duplicidad de estados.
- Añadir validaciones de rol y autenticación antes de mostrar o permitir la creación de notas.
- Conectar ambos componentes flotantes a una API o al backend para mostrar notas reales y evitar placeholders.

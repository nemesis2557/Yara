
-- ============================================
-- LUWAK MANAGER - SISTEMA POS PARA CAFETERÍA
-- ============================================

-- Tabla de usuarios extendida (perfil de empleados)
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE, -- Relación lógica con users.id
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(8) NOT NULL UNIQUE,
    celular VARCHAR(9),
    sexo VARCHAR(10) CHECK (sexo IN ('masculino', 'femenino', 'otro')),
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'mesero', 'cajero', 'chef', 'ayudante')),
    activo BOOLEAN DEFAULT true NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_usuarios_user_id ON usuarios(user_id);
CREATE INDEX idx_usuarios_dni ON usuarios(dni);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

COMMENT ON TABLE usuarios IS 'Perfil extendido de empleados del sistema POS';
COMMENT ON COLUMN usuarios.user_id IS 'Relación lógica con tabla users (autenticación)';
COMMENT ON COLUMN usuarios.dni IS 'DNI de 8 dígitos, único por empleado';
COMMENT ON COLUMN usuarios.celular IS 'Celular de 9 dígitos';
COMMENT ON COLUMN usuarios.rol IS 'Rol en el negocio: admin, mesero, cajero, chef, ayudante';

-- Tabla de turnos laborales
CREATE TABLE turnos (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fin TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_turnos_usuario_id ON turnos(usuario_id);
CREATE INDEX idx_turnos_inicio ON turnos(inicio);
CREATE INDEX idx_turnos_activo ON turnos(fin) WHERE fin IS NULL;

COMMENT ON TABLE turnos IS 'Control de jornadas laborales de empleados';
COMMENT ON COLUMN turnos.fin IS 'NULL indica turno activo, con valor indica turno finalizado';

-- Tabla de productos
CREATE TABLE productos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
        'PREMIUM', 'CALIENTES', 'HELADAS_TIEMPO', 'ANDINOS', 
        'TRADICIONAL', 'FAST_FOOD', 'PARA_ALMORZAR', 'SANDWICH',
        'PARA_ACOMPANAR', 'CERVEZAS', 'COCTELES', 'VINOS', 'GASEOSAS'
    )),
    descripcion TEXT,
    precio_base DECIMAL(10, 2) NOT NULL,
    imagen_url TEXT,
    activo BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_activo ON productos(activo);

COMMENT ON TABLE productos IS 'Catálogo de productos de la cafetería';
COMMENT ON COLUMN productos.precio_base IS 'Precio con IGV incluido (18%)';
COMMENT ON COLUMN productos.imagen_url IS 'Ruta de imagen: /img-carta/{categoria}/{producto}.webp';

-- Tabla de variantes de productos
CREATE TABLE variantes_producto (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    modificador_precio DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_variantes_producto_id ON variantes_producto(producto_id);
CREATE INDEX idx_variantes_activo ON variantes_producto(activo);

COMMENT ON TABLE variantes_producto IS 'Variantes de productos (sabores, tamaños, etc.)';
COMMENT ON COLUMN variantes_producto.modificador_precio IS 'Monto a sumar/restar al precio base';

-- Tabla de pedidos
CREATE TABLE pedidos (
    id BIGSERIAL PRIMARY KEY,
    numero_secuencial INT NOT NULL,
    usuario_id BIGINT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'cocinando', 'listo', 'pagado')),
    descripcion_resumen TEXT,
    subtotal DECIMAL(10, 2) NOT NULL,
    igv DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_pedidos_usuario_id ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at);
CREATE INDEX idx_pedidos_numero_secuencial ON pedidos(numero_secuencial, created_at);

COMMENT ON TABLE pedidos IS 'Órdenes de clientes';
COMMENT ON COLUMN pedidos.numero_secuencial IS 'Número de pedido del día (reinicia diariamente)';
COMMENT ON COLUMN pedidos.usuario_id IS 'Mesero que creó el pedido';
COMMENT ON COLUMN pedidos.total IS 'Monto total con IGV incluido';

-- Tabla de líneas de pedido
CREATE TABLE lineas_pedido (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    variante_id BIGINT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL,
    total_linea DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_lineas_pedido_pedido_id ON lineas_pedido(pedido_id);
CREATE INDEX idx_lineas_pedido_producto_id ON lineas_pedido(producto_id);

COMMENT ON TABLE lineas_pedido IS 'Detalle de productos en cada pedido';
COMMENT ON COLUMN lineas_pedido.precio_unitario IS 'Precio con IGV al momento de la venta';
COMMENT ON COLUMN lineas_pedido.total_linea IS 'precio_unitario * cantidad';

-- Tabla de pagos
CREATE TABLE pagos (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    metodo VARCHAR(20) NOT NULL CHECK (metodo IN ('efectivo', 'yape')),
    numero_operacion VARCHAR(100),
    nombre_cliente VARCHAR(200),
    foto_yape_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_pagos_pedido_id ON pagos(pedido_id);
CREATE INDEX idx_pagos_usuario_id ON pagos(usuario_id);
CREATE INDEX idx_pagos_metodo ON pagos(metodo);
CREATE INDEX idx_pagos_created_at ON pagos(created_at);

COMMENT ON TABLE pagos IS 'Registro de pagos de pedidos';
COMMENT ON COLUMN pagos.usuario_id IS 'Cajero o admin que procesó el pago';
COMMENT ON COLUMN pagos.numero_operacion IS 'Número de operación Yape (opcional)';
COMMENT ON COLUMN pagos.nombre_cliente IS 'Nombre del cliente para Yape (opcional)';

-- Tabla de notas de compra
CREATE TABLE notas_compra (
    id BIGSERIAL PRIMARY KEY,
    texto TEXT NOT NULL,
    creado_por_id BIGINT NOT NULL,
    rol_creador VARCHAR(20) NOT NULL CHECK (rol_creador IN ('admin', 'mesero', 'cajero', 'chef', 'ayudante')),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_notas_compra_creado_por_id ON notas_compra(creado_por_id);
CREATE INDEX idx_notas_compra_creado_en ON notas_compra(creado_en);

COMMENT ON TABLE notas_compra IS 'Notas compartidas para compras del día siguiente';
COMMENT ON COLUMN notas_compra.creado_por_id IS 'Usuario que creó la nota';

-- Tabla de ajustes de administrador
CREATE TABLE ajustes_admin (
    id BIGSERIAL PRIMARY KEY,
    codigo_admin_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE ajustes_admin IS 'Configuración del código de administrador (1 sola fila)';
COMMENT ON COLUMN ajustes_admin.codigo_admin_hash IS 'Hash bcrypt del código de administrador';

-- Tabla de log de auditoría
CREATE TABLE log_auditoria (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    accion VARCHAR(100) NOT NULL,
    tipo_objetivo VARCHAR(50) NOT NULL,
    id_objetivo VARCHAR(100) NOT NULL,
    detalles JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_log_auditoria_usuario_id ON log_auditoria(usuario_id);
CREATE INDEX idx_log_auditoria_accion ON log_auditoria(accion);
CREATE INDEX idx_log_auditoria_created_at ON log_auditoria(created_at);
CREATE INDEX idx_log_auditoria_tipo_objetivo ON log_auditoria(tipo_objetivo, id_objetivo);

COMMENT ON TABLE log_auditoria IS 'Registro de acciones críticas del sistema';
COMMENT ON COLUMN log_auditoria.accion IS 'Tipo de acción: CANCELAR_PEDIDO, EDITAR_PEDIDO, PAGAR_PEDIDO, etc.';
COMMENT ON COLUMN log_auditoria.detalles IS 'Datos adicionales en formato JSON';

-- ============================================
-- DATOS INICIALES (SEED)
-- ============================================

-- Insertar código de administrador por defecto (hash de 'admin2024')
-- Hash generado con bcrypt, 10 salt rounds
INSERT INTO ajustes_admin (codigo_admin_hash) 
VALUES ('$2a$10$rZ5qJ5YvH8kF9X2nW3pLOeK8vH9mN2pL4xR6tY8uI1oP3qS5vW7zA');

-- Insertar productos de ejemplo por categoría

-- PREMIUM
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Menú de 5 Tiempos', 'PREMIUM', 'Experiencia gastronómica completa con 5 tiempos', 70.00, '/img-carta/premium/menu-5-tiempos.webp'),
('Buffet Ejecutivo', 'PREMIUM', 'Buffet completo con variedad de platos', 70.00, '/img-carta/premium/buffet.webp');

-- CALIENTES
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Espresso', 'CALIENTES', 'Café espresso tradicional', 8.00, '/img-carta/calientes/espresso.webp'),
('Latte', 'CALIENTES', 'Café con leche cremoso', 10.00, '/img-carta/calientes/latte.webp'),
('Capuccino', 'CALIENTES', 'Café capuccino con espuma', 10.00, '/img-carta/calientes/capuccino.webp'),
('Americano', 'CALIENTES', 'Café americano suave', 9.00, '/img-carta/calientes/americano.webp'),
('Chocolate Caliente', 'CALIENTES', 'Chocolate caliente cremoso', 12.00, '/img-carta/calientes/chocolate.webp'),
('Mocaccino', 'CALIENTES', 'Mezcla de café y chocolate', 12.00, '/img-carta/calientes/mocaccino.webp'),
('Lágrima', 'CALIENTES', 'Leche con un toque de café', 8.00, '/img-carta/calientes/lagrima.webp'),
('Ponche Andino', 'CALIENTES', 'Bebida caliente andina tradicional', 15.00, '/img-carta/calientes/ponche-andino.webp'),
('Infusión Andina', 'CALIENTES', 'Infusión de hierbas andinas', 7.00, '/img-carta/calientes/infusion-andina.webp'),
('Té Jamaica', 'CALIENTES', 'Té de Jamaica aromático', 8.00, '/img-carta/calientes/te-jamaica.webp'),
('Té Luwak', 'CALIENTES', 'Té especial de la casa', 10.00, '/img-carta/calientes/te-luwak.webp'),
('Emoliente', 'CALIENTES', 'Bebida tradicional peruana', 6.00, '/img-carta/calientes/emoliente.webp'),
('Emoliente con Licor', 'CALIENTES', 'Emoliente con pisco, ron, anís o pulkay', 12.00, '/img-carta/calientes/emoliente-licor.webp'),
('Té con Licor', 'CALIENTES', 'Té caliente con licor', 12.00, '/img-carta/calientes/te-licor.webp'),
('Matagripe', 'CALIENTES', 'Bebida caliente medicinal', 8.00, '/img-carta/calientes/matagripe.webp');

-- HELADAS Y AL TIEMPO
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Milkshake', 'HELADAS_TIEMPO', 'Batido cremoso con variantes', 14.00, '/img-carta/heladas-tiempo/milkshake.webp'),
('Frapuccino', 'HELADAS_TIEMPO', 'Café frappé con variantes', 15.00, '/img-carta/heladas-tiempo/frapuccino.webp'),
('Jugo de Fresa', 'HELADAS_TIEMPO', 'Jugo natural de fresa', 10.00, '/img-carta/heladas-tiempo/jugo-fresa.webp'),
('Jugo de Piña', 'HELADAS_TIEMPO', 'Jugo natural de piña', 10.00, '/img-carta/heladas-tiempo/jugo-pina.webp'),
('Jugo de Plátano', 'HELADAS_TIEMPO', 'Jugo natural de plátano', 10.00, '/img-carta/heladas-tiempo/jugo-platano.webp'),
('Jugo de Papaya', 'HELADAS_TIEMPO', 'Jugo natural de papaya', 10.00, '/img-carta/heladas-tiempo/jugo-papaya.webp'),
('Limonada', 'HELADAS_TIEMPO', 'Limonada refrescante', 8.00, '/img-carta/heladas-tiempo/limonada.webp'),
('Naranjada', 'HELADAS_TIEMPO', 'Jugo de naranja natural', 8.00, '/img-carta/heladas-tiempo/naranjada.webp'),
('Refresco de Maracuyá', 'HELADAS_TIEMPO', 'Refresco de maracuyá', 9.00, '/img-carta/heladas-tiempo/maracuya.webp');

-- ANDINOS
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Chicha Morada', 'ANDINOS', 'Bebida tradicional de maíz morado', 8.00, '/img-carta/andinos/chicha-morada.webp'),
('Mate de Coca', 'ANDINOS', 'Infusión de hojas de coca', 6.00, '/img-carta/andinos/mate-coca.webp');

-- TRADICIONAL
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Ceviche', 'TRADICIONAL', 'Ceviche de pescado fresco', 35.00, '/img-carta/tradicional/ceviche.webp'),
('Lomo Saltado', 'TRADICIONAL', 'Plato tradicional peruano', 32.00, '/img-carta/tradicional/lomo-saltado.webp'),
('Ají de Gallina', 'TRADICIONAL', 'Ají de gallina cremoso', 28.00, '/img-carta/tradicional/aji-gallina.webp');

-- FAST FOOD
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Hamburguesa Clásica', 'FAST_FOOD', 'Hamburguesa con queso y vegetales', 18.00, '/img-carta/fast-food/hamburguesa.webp'),
('Hot Dog', 'FAST_FOOD', 'Hot dog con salsas', 12.00, '/img-carta/fast-food/hotdog.webp'),
('Papas Fritas', 'FAST_FOOD', 'Papas fritas crujientes', 10.00, '/img-carta/fast-food/papas-fritas.webp');

-- PARA ALMORZAR
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Menú del Día', 'PARA_ALMORZAR', 'Menú ejecutivo con entrada, plato y postre', 25.00, '/img-carta/para-almorzar/menu-dia.webp'),
('Arroz con Pollo', 'PARA_ALMORZAR', 'Arroz con pollo tradicional', 22.00, '/img-carta/para-almorzar/arroz-pollo.webp'),
('Tallarines Verdes', 'PARA_ALMORZAR', 'Tallarines con salsa de albahaca', 20.00, '/img-carta/para-almorzar/tallarines-verdes.webp');

-- SANDWICH
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Sándwich de Pollo', 'SANDWICH', 'Sándwich de pollo a la plancha', 15.00, '/img-carta/sandwich/sandwich-pollo.webp'),
('Sándwich Vegetariano', 'SANDWICH', 'Sándwich con vegetales frescos', 14.00, '/img-carta/sandwich/sandwich-vegetariano.webp'),
('Club Sándwich', 'SANDWICH', 'Sándwich triple con jamón y queso', 18.00, '/img-carta/sandwich/club-sandwich.webp');

-- PARA ACOMPAÑAR
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Ensalada César', 'PARA_ACOMPANAR', 'Ensalada césar clásica', 16.00, '/img-carta/para-acompanar/ensalada-cesar.webp'),
('Pan con Mantequilla', 'PARA_ACOMPANAR', 'Pan artesanal con mantequilla', 5.00, '/img-carta/para-acompanar/pan-mantequilla.webp'),
('Yuca Frita', 'PARA_ACOMPANAR', 'Yuca frita crujiente', 8.00, '/img-carta/para-acompanar/yuca-frita.webp');

-- CERVEZAS
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Cerveza Cusqueña', 'CERVEZAS', 'Cerveza peruana premium', 12.00, '/img-carta/cervezas/cusquena.webp'),
('Cerveza Pilsen', 'CERVEZAS', 'Cerveza clásica peruana', 10.00, '/img-carta/cervezas/pilsen.webp'),
('Cerveza Artesanal', 'CERVEZAS', 'Cerveza artesanal de la casa', 15.00, '/img-carta/cervezas/artesanal.webp');

-- COCTELES
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Pisco Sour', 'COCTELES', 'Coctel peruano tradicional', 20.00, '/img-carta/cocteles/pisco-sour.webp'),
('Chilcano', 'COCTELES', 'Pisco con ginger ale', 18.00, '/img-carta/cocteles/chilcano.webp'),
('Mojito', 'COCTELES', 'Mojito refrescante', 18.00, '/img-carta/cocteles/mojito.webp');

-- VINOS
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Vino Tinto Reserva', 'VINOS', 'Vino tinto de reserva', 45.00, '/img-carta/vinos/tinto-reserva.webp'),
('Vino Blanco', 'VINOS', 'Vino blanco seco', 40.00, '/img-carta/vinos/blanco.webp'),
('Vino Rosado', 'VINOS', 'Vino rosado afrutado', 42.00, '/img-carta/vinos/rosado.webp');

-- GASEOSAS
INSERT INTO productos (nombre, categoria, descripcion, precio_base, imagen_url) VALUES
('Coca Cola', 'GASEOSAS', 'Coca Cola 500ml', 5.00, '/img-carta/gaseosas/coca-cola.webp'),
('Inca Kola', 'GASEOSAS', 'Inca Kola 500ml', 5.00, '/img-carta/gaseosas/inca-kola.webp'),
('Sprite', 'GASEOSAS', 'Sprite 500ml', 5.00, '/img-carta/gaseosas/sprite.webp'),
('Fanta', 'GASEOSAS', 'Fanta 500ml', 5.00, '/img-carta/gaseosas/fanta.webp');

-- Insertar variantes para productos que las necesitan

-- Variantes para Milkshake
INSERT INTO variantes_producto (producto_id, nombre, modificador_precio) VALUES
((SELECT id FROM productos WHERE nombre = 'Milkshake'), 'Vainilla', 0.00),
((SELECT id FROM productos WHERE nombre = 'Milkshake'), 'Chocolate', 0.00),
((SELECT id FROM productos WHERE nombre = 'Milkshake'), 'Café', 1.00),
((SELECT id FROM productos WHERE nombre = 'Milkshake'), 'Lúcuma', 1.00),
((SELECT id FROM productos WHERE nombre = 'Milkshake'), 'Fresa', 1.00);

-- Variantes para Frapuccino
INSERT INTO variantes_producto (producto_id, nombre, modificador_precio) VALUES
((SELECT id FROM productos WHERE nombre = 'Frapuccino'), 'Vainilla', 0.00),
((SELECT id FROM productos WHERE nombre = 'Frapuccino'), 'Chocolate', 0.00),
((SELECT id FROM productos WHERE nombre = 'Frapuccino'), 'Café', 1.00),
((SELECT id FROM productos WHERE nombre = 'Frapuccino'), 'Lúcuma', 1.00),
((SELECT id FROM productos WHERE nombre = 'Frapuccino'), 'Fresa', 1.00);

-- Variantes para Emoliente con Licor
INSERT INTO variantes_producto (producto_id, nombre, modificador_precio) VALUES
((SELECT id FROM productos WHERE nombre = 'Emoliente con Licor'), 'Con Pisco', 0.00),
((SELECT id FROM productos WHERE nombre = 'Emoliente con Licor'), 'Con Ron', 0.00),
((SELECT id FROM productos WHERE nombre = 'Emoliente con Licor'), 'Con Anís', 0.00),
((SELECT id FROM productos WHERE nombre = 'Emoliente con Licor'), 'Con Pulkay', 1.00);

-- Variantes para tamaños de bebidas calientes
INSERT INTO variantes_producto (producto_id, nombre, modificador_precio) VALUES
((SELECT id FROM productos WHERE nombre = 'Latte'), 'Pequeño', 0.00),
((SELECT id FROM productos WHERE nombre = 'Latte'), 'Mediano', 2.00),
((SELECT id FROM productos WHERE nombre = 'Latte'), 'Grande', 4.00);

INSERT INTO variantes_producto (producto_id, nombre, modificador_precio) VALUES
((SELECT id FROM productos WHERE nombre = 'Capuccino'), 'Pequeño', 0.00),
((SELECT id FROM productos WHERE nombre = 'Capuccino'), 'Mediano', 2.00),
((SELECT id FROM productos WHERE nombre = 'Capuccino'), 'Grande', 4.00);

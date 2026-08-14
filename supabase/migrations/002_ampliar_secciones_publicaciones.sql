-- Permite que el panel alimente todos los filtros de la Red de ayuda del
-- diseño aprobado, sin clasificar necesidades o servicios de salud como si
-- fueran ofrecimientos.

alter table sismo_publicaciones
  drop constraint if exists sismo_publicaciones_seccion_check;

alter table sismo_publicaciones
  add constraint sismo_publicaciones_seccion_check
  check (seccion in (
    'ofrecimientos',
    'puntos-acopio',
    'necesidades',
    'salud',
    'registro-visual',
    'noticias'
  ));

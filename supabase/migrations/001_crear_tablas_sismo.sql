-- Buenaventura SE LEVANTA — creación de tablas iniciales
-- Todas con prefijo sismo_ para convivir con otras bases en el mismo proyecto.
-- Pega esto completo en el Editor SQL de Supabase y ejecútalo una sola vez.

-- ---------- Contenido de configuración (una fila cada una) ----------

create table if not exists sismo_cifras_oficiales (
  id int primary key default 1,
  buenaventura jsonb not null,
  contexto_nacional jsonb not null,
  sismo_principal jsonb not null,
  replicas_relevantes jsonb not null default '[]',
  toque_de_queda jsonb not null,
  ultima_revision_por_equipo date,
  actualizado_en timestamptz not null default now(),
  constraint una_sola_fila check (id = 1)
);

create table if not exists sismo_contactos_emergencia (
  id int primary key default 1,
  nacionales jsonb not null,
  buenaventura jsonb not null,
  salud_mental jsonb not null,
  restablecimiento_contacto_familiar jsonb not null,
  atencion_ciudadano_alcaldia jsonb not null,
  ultima_revision_por_equipo date,
  actualizado_en timestamptz not null default now(),
  constraint una_sola_fila check (id = 1)
);

create table if not exists sismo_como_solicitar_ayuda (
  id int primary key default 1,
  estado_contenido text not null default 'incompleto',
  nota_transparencia text,
  lo_que_se_sabe jsonb not null default '[]',
  pendiente_de_confirmar jsonb not null default '[]',
  ultima_revision_por_equipo date,
  actualizado_en timestamptz not null default now(),
  constraint una_sola_fila check (id = 1)
);

-- ---------- Contenido en lista (varias filas) ----------

create table if not exists sismo_directorio_ayuda (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nivel_confianza text not null check (nivel_confianza in ('oficial','institucional','colectivo','individual')),
  descripcion text,
  ubicacion text,
  horario text,
  recibe jsonb,
  no_recibe jsonb,
  cuenta text,
  llave_bre_b text,
  llave_daviplata text,
  cuenta_bancolombia_ahorros text,
  contacto_whatsapp text,
  puntos_entrega jsonb,
  fuente text,
  nota_verificacion text,
  orden int not null default 0,
  creado_en timestamptz not null default now()
);

create table if not exists sismo_plataformas (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('ciudadana','oficial')),
  nombre text not null,
  url text not null,
  descripcion text,
  orden int not null default 0
);

create table if not exists sismo_verificado_falso (
  id uuid primary key default gen_random_uuid(),
  afirmacion text not null,
  estado text not null default 'falso',
  explicacion text not null,
  fuente text,
  creado_en timestamptz not null default now()
);

create table if not exists sismo_cuentas_y_voces (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('oficiales','medios_locales','ong_con_trayectoria','profesionales_tecnicos','influencers_y_personalidades')),
  nombre text not null,
  canal text,
  descripcion text,
  estado_verificacion text,
  orden int not null default 0
);

-- ---------- Publicaciones y boletines (lo que ya tenía su propio archivo JSON) ----------

create table if not exists sismo_publicaciones (
  id uuid primary key default gen_random_uuid(),
  seccion text not null check (seccion in ('ofrecimientos','puntos-acopio','necesidades','salud','registro-visual','noticias')),
  tipo_presentacion text not null check (tipo_presentacion in ('alojado','tarjeta_enlace')),
  titulo text not null,
  descripcion text,
  nivel_confianza text not null check (nivel_confianza in ('oficial','institucional','colectivo','individual')),
  archivo text,
  tipo_archivo text check (tipo_archivo in ('imagen','video',null)),
  url_externa text,
  vigente_hasta date,
  fecha_publicado date not null,
  publicado_por text not null default 'Equipo Buenaventura SE LEVANTA',
  creado_en timestamptz not null default now()
);

create index if not exists sismo_publicaciones_seccion_idx on sismo_publicaciones (seccion);

create table if not exists sismo_boletines_oficiales (
  id uuid primary key default gen_random_uuid(),
  nivel_gobierno text not null check (nivel_gobierno in ('alcaldia','departamento','nacion')),
  entidad text not null,
  titulo text not null,
  descripcion text,
  archivo text not null,
  tipo_archivo text not null check (tipo_archivo in ('imagen','documento')),
  fecha_del_boletin date,
  fecha_publicado date not null,
  publicado_por text not null default 'Equipo Buenaventura SE LEVANTA',
  creado_en timestamptz not null default now()
);

create index if not exists sismo_boletines_nivel_idx on sismo_boletines_oficiales (nivel_gobierno);

-- ---------- Seguridad ----------
-- RLS activado pero sin políticas: solo la service_role key (usada por el backend)
-- puede leer/escribir. El control de "público puede leer, admin puede escribir" ya
-- lo hace la app Express, no Supabase — evita duplicar esa lógica en dos lugares.

alter table sismo_cifras_oficiales enable row level security;
alter table sismo_contactos_emergencia enable row level security;
alter table sismo_como_solicitar_ayuda enable row level security;
alter table sismo_directorio_ayuda enable row level security;
alter table sismo_plataformas enable row level security;
alter table sismo_verificado_falso enable row level security;
alter table sismo_cuentas_y_voces enable row level security;
alter table sismo_publicaciones enable row level security;
alter table sismo_boletines_oficiales enable row level security;

-- Archivos públicos de publicaciones y boletines. Las escrituras se hacen
-- únicamente con service_role desde el backend.
insert into storage.buckets (id, name, public)
values ('sismo-archivos', 'sismo-archivos', true)
on conflict (id) do update set public = excluded.public;

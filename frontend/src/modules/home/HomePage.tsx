import { PublicFooter } from '../../shared/components/layout/PublicFooter'
import { PublicHeader } from '../../shared/components/layout/PublicHeader'
import { getAccessToken } from '../auth/services/authSession'
import { EventCategoryCard } from './components/EventCategoryCard'
import { InvitationPreviewCard } from './components/InvitationPreviewCard'

const categories = [
  [
    'Cumpleaños',
    'Celebra cada vuelta al sol con un diseño tan único como su protagonista.',
    '🎂',
    '#d71920',
  ],
  [
    'Bautismos',
    'Comparte este momento especial con una invitación delicada y cercana.',
    '🕊',
    '#60a5fa',
  ],
  [
    'Matrimonios',
    'Anuncia el gran día con elegancia y todos los detalles importantes.',
    '♡',
    '#0b3568',
  ],
  [
    'Baby showers',
    'Da la bienvenida a una nueva historia con ternura y personalidad.',
    '☁',
    '#e63946',
  ],
  [
    'Fiestas infantiles',
    'Color, alegría y diversión para una celebración inolvidable.',
    '🎈',
    '#d97706',
  ],
  [
    'Aniversarios',
    'Vuelve a celebrar los recuerdos y todo lo que aún está por venir.',
    '✦',
    '#a90f18',
  ],
  [
    'Otros eventos',
    'Crea desde una idea flexible para cualquier motivo que quieras compartir.',
    '✨',
    '#64748b',
  ],
] as const
const steps = [
  [
    '01',
    'Elige el tipo de evento',
    'Selecciona una celebración o comienza desde un diseño en blanco.',
  ],
  [
    '02',
    'Personaliza los detalles',
    'Agrega nombres, fotos, fecha, hora, lugar y tu mensaje especial.',
  ],
  [
    '03',
    'Revisa el resultado',
    'Visualiza cómo se verá la invitación antes de compartirla.',
  ],
  [
    '04',
    'Comparte con tus invitados',
    'En una próxima etapa podrás enviar tu enlace por tus canales favoritos.',
  ],
] as const
const features = [
  'Diseños personalizables',
  'Fotos y galería',
  'Fecha y horario',
  'Ubicación clara',
  'Mensaje especial',
  'Confirmación de asistencia',
  'Diseño adaptable a móvil',
  'Enlace fácil de compartir',
]

export function HomePage() {
  const authenticated = Boolean(getAccessToken())
  return (
    <>
      <PublicHeader activePage="home" />
      <main>
        <section id="inicio" className="hero section-shell">
          <div className="hero-copy">
            <span className="pill">Celebra a tu manera</span>
            <h1>Crea invitaciones únicas para momentos inolvidables</h1>
            <p>
              Diseña una invitación digital personalizada con tus fotos, fecha,
              lugar y todos los detalles de tu celebración.
            </p>
            <div className="hero-actions">
              <a
                className="primary-cta"
                href={authenticated ? '/templates' : '/login'}
              >
                {authenticated ? 'Crear mi invitación' : 'Iniciar sesión'}
              </a>
              <a className="secondary-cta" href="#ejemplo">
                Ver ejemplo
              </a>
            </div>
            <div className="trust-line">
              <span>✓ Sin conocimientos de diseño</span>
              <span>✓ Pensada para móvil</span>
            </div>
          </div>
          <InvitationPreviewCard />
        </section>
        <section id="tipos" className="home-section section-shell">
          <div className="section-intro">
            <span className="eyebrow">Para cada historia</span>
            <h2>Una invitación para cada momento</h2>
            <p>
              Desde una celebración íntima hasta una gran fiesta, encuentra un
              punto de partida que se sienta tuyo.
            </p>
          </div>
          <div className="category-grid">
            {categories.map(([title, description, icon, accent]) => (
              <EventCategoryCard
                key={title}
                title={title}
                description={description}
                icon={icon}
                accent={accent}
              />
            ))}
          </div>
        </section>
        <section id="como-funciona" className="home-section soft-section">
          <div className="section-shell">
            <div className="section-intro">
              <span className="eyebrow">Simple desde el inicio</span>
              <h2>Crea tu invitación en pocos pasos</h2>
              <p>
                Una experiencia guiada para concentrarte en lo importante: tu
                celebración.
              </p>
            </div>
            <div className="steps-grid">
              {steps.map(([number, title, description]) => (
                <article className="step-card" key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="caracteristicas" className="home-section section-shell">
          <div className="section-intro">
            <span className="eyebrow">Todo en un lugar</span>
            <h2>Todo lo que necesitas para tu evento</h2>
            <p>
              Estamos preparando herramientas para que cada detalle se vea y se
              sienta especial.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature}>
                <span aria-hidden="true">✓</span>
                <div>
                  <h3>{feature}</h3>
                  <small>Próximamente</small>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="ejemplo" className="story-section section-shell">
          <div className="story-visual" aria-hidden="true">
            <div className="photo-card photo-one">Tus fotos</div>
            <div className="photo-card photo-two">Tus colores</div>
            <div className="swatches">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div>
            <span className="eyebrow">Hecha por ti</span>
            <h2>Haz que refleje la personalidad de tu celebración</h2>
            <p>
              Combina colores, tipografías, imágenes, estilos y textos para
              contar tu historia desde el primer vistazo.
            </p>
            <ul>
              <li>Una imagen principal que emocione</li>
              <li>Galería para tus mejores recuerdos</li>
              <li>Lugar y referencias fáciles de encontrar</li>
            </ul>
          </div>
        </section>
        <section className="concept-grid section-shell">
          <article>
            <span aria-hidden="true">⌖</span>
            <h2>Todos llegan sin complicaciones</h2>
            <p>
              Comparte el lugar, la dirección y las referencias de forma clara.
              La integración con mapas estará disponible próximamente.
            </p>
          </article>
          <article>
            <span aria-hidden="true">♡</span>
            <h2>Organiza mejor tu celebración</h2>
            <p>
              En una próxima etapa podrás recibir confirmaciones de asistencia y
              saber quiénes participarán.
            </p>
          </article>
        </section>
        <section className="final-cta section-shell">
          <span aria-hidden="true">✦</span>
          <h2>Tu próxima celebración comienza aquí</h2>
          <p>
            Crea una invitación especial y comparte cada detalle con las
            personas que más quieres.
          </p>
          <a
            className="primary-cta light"
            href={authenticated ? '/templates' : '/login'}
          >
            {authenticated ? 'Comenzar ahora' : 'Iniciar sesión'}
          </a>
        </section>
      </main>
      <PublicFooter />
    </>
  )
}

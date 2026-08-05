import { PublicFooter } from '../../shared/components/layout/PublicFooter'
import { PublicHeader } from '../../shared/components/layout/PublicHeader'
import { categoryLabels, invitationTemplates } from '../templates/data/invitationTemplates'
import { TemplateArtwork } from '../templates/components/TemplateArtwork'
import { AnimatedSection } from './components/AnimatedSection'
import { InvitationPreviewCard } from './components/InvitationPreviewCard'

const categoryIcons = { birthday: '🎂', baptism: '◇', wedding: '♡', 'baby-shower': '☁', 'kids-party': '✦', anniversary: '∞', graduation: '⌁', other: '✨' } as const
const categories = Object.entries(categoryLabels)
const steps = [
  ['01', 'Elige una plantilla', 'Explora diseños reales y encuentra el estilo ideal para tu celebración.'],
  ['02', 'Personaliza los detalles', 'Agrega nombres, fecha, hora, lugar, mensaje, fotografías y apariencia.'],
  ['03', 'Revisa tu invitación', 'Mira en tiempo real la misma experiencia que recibirán tus invitados.'],
  ['04', 'Publica y comparte', 'Obtén una página web con su propio enlace para enviarla a quien quieras.'],
] as const
const details = ['Nombre y evento', 'Fecha y hora', 'Lugar y mapa', 'Mensaje especial', 'Fotografías y galería', 'Colores y fondos']
const guestInfo = [
  ['Fecha, hora y cuenta regresiva', 'Disponible'], ['Dirección y acceso a Google Maps', 'Disponible'],
  ['Galería de recuerdos', 'Disponible'], ['Confirmación de asistencia', 'Disponible'],
  ['Música personalizada', 'Próximamente'],
] as const
const featured = invitationTemplates.filter((template) => template.isFeatured && template.isAvailable)

export function HomePage() {
  return <><PublicHeader activePage="home"/><main className="redesigned-home">
    <section id="inicio" className="home-hero home-section section-shell">
      <div className="hero-orb orb-one" aria-hidden="true"/><div className="hero-orb orb-two" aria-hidden="true"/>
      <AnimatedSection className="hero-copy" direction="left">
        <span className="pill">Una página especial para tu evento</span>
        <h1>Crea invitaciones digitales que se sienten únicas</h1>
        <p>Diseña una invitación web personalizada, agrega todos los detalles de tu evento y compártela fácilmente mediante un enlace.</p>
        <div className="hero-actions"><a className="primary-cta" href="/templates">Crear mi invitación</a><a className="secondary-cta" href="/templates">Ver plantillas</a></div>
        <div className="trust-line"><span>✓ Vista previa en tiempo real</span><span>✓ Lista para cualquier dispositivo</span></div>
      </AnimatedSection>
      <AnimatedSection className="hero-demo" direction="scale" delay={260}><InvitationPreviewCard/></AnimatedSection>
    </section>

    <AnimatedSection as="section" className="home-section section-shell" direction="up">
      <div className="section-intro"><span className="eyebrow">Qué puedes crear</span><h2>Una invitación para cada historia</h2><p>Elige una categoría del catálogo y empieza con una plantilla preparada para tu evento.</p></div>
      <div className="category-grid">{categories.map(([id, label], index) => <AnimatedSection as="article" className="category-card" direction="scale" delay={index * 90} key={id}><a href={`/templates?category=${id}`}><span className="category-icon" aria-hidden="true">{categoryIcons[id as keyof typeof categoryIcons]}</span><h3>{label}</h3><p>Explorar plantillas <span aria-hidden="true">→</span></p></a></AnimatedSection>)}</div>
    </AnimatedSection>

    <section id="como-funciona" className="home-section soft-section"><AnimatedSection className="section-shell"><div className="section-intro"><span className="eyebrow">Así de simple</span><h2>De una idea a un enlace en cuatro pasos</h2><p>El flujo real te acompaña desde la elección del diseño hasta la publicación.</p></div><div className="steps-grid">{steps.map(([number,title,description], index)=><AnimatedSection as="article" className="step-card" direction={index % 2 ? 'right':'left'} delay={index*110} key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></AnimatedSection>)}</div></AnimatedSection></section>

    <AnimatedSection as="section" className="home-section personalization-section section-shell" direction="left">
      <div><span className="eyebrow">Tu invitación, a tu manera</span><h2>Personaliza cada detalle mientras ves el resultado</h2><p>El editor guiado mantiene la información y la vista previa lado a lado, para que cada decisión se vea al instante.</p><div className="detail-pills">{details.map((detail)=><span key={detail}>{detail}</span>)}</div></div>
      <div className="wizard-mock" aria-label="Resumen de opciones del editor"><div><span>Paso 3 de 7</span><strong>Fecha y hora</strong><label>Fecha<input value="23 / 01 / 2027" readOnly/></label><label>Hora<input value="17:00" readOnly/></label></div><div className="mini-live-preview"><span>Vista previa</span><strong>Emilia</strong><small>Sábado 23 · 17:00</small></div></div>
    </AnimatedSection>

    <section className="home-section responsive-section"><AnimatedSection className="section-shell responsive-copy"><span className="eyebrow">Una URL, todas las pantallas</span><h2>La misma invitación en teléfono, tablet y computador</h2><p>Tus invitados consultan la página completa desde cualquier dispositivo, sin descargar archivos ni instalar aplicaciones.</p><div className="device-stage" aria-label="Invitación adaptable a distintos dispositivos"><div className="device desktop"><span>miinvitacion.cl/i/emilia</span><b>Emilia</b></div><div className="device tablet"><b>Emilia</b><small>23 ENE</small></div><div className="device phone"><b>Emilia</b><small>17:00</small></div></div></AnimatedSection></section>

    <AnimatedSection as="section" className="home-section guest-section section-shell" direction="right"><div><span className="eyebrow">Todo claro para tus invitados</span><h2>La información importante, reunida en una experiencia</h2><p>La invitación publicada no es una imagen: es una página interactiva que informa, orienta y recibe respuestas.</p></div><div className="guest-feature-list">{guestInfo.map(([label,status],index)=><AnimatedSection as="article" direction="up" delay={index*90} key={label}><span aria-hidden="true">{status === 'Disponible' ? '✓':'＋'}</span><strong>{label}</strong><small className={status === 'Próximamente' ? 'is-soon':''}>{status}</small></AnimatedSection>)}</div></AnimatedSection>

    <AnimatedSection as="section" className="home-section section-shell featured-section"><div className="section-intro"><span className="eyebrow">Plantillas destacadas</span><h2>Diseños reales para empezar hoy</h2><p>Estas plantillas pertenecen al catálogo actual y abren directamente el flujo de creación.</p></div><div className="home-template-grid">{featured.map((template,index)=><AnimatedSection as="article" className="home-template-card" direction="scale" delay={index*130} key={template.id}><TemplateArtwork template={template}/><div><span>{categoryLabels[template.category]}</span><h3>{template.name}</h3><p>{template.description}</p><a href={`/invitations/create?template=${template.id}`}>Usar esta plantilla <span aria-hidden="true">→</span></a></div></AnimatedSection>)}</div></AnimatedSection>

    <AnimatedSection as="section" className="home-section final-cta section-shell" direction="scale"><span aria-hidden="true">✦</span><h2>Tu próxima invitación puede empezar aquí</h2><p>Elige una plantilla, personaliza los detalles y comparte un enlace creado especialmente para tu evento.</p><a className="primary-cta light" href="/templates">Crear mi invitación</a></AnimatedSection>
  </main><PublicFooter/></>
}

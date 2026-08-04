import { APP_NAME } from './PublicHeader'

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div>
        <a className="public-brand" href="#inicio">
          <span aria-hidden="true">✦</span>
          {APP_NAME}
        </a>
        <p>Invitaciones digitales para celebrar momentos especiales.</p>
      </div>
      <p>
        © {new Date().getFullYear()} {APP_NAME}
      </p>
    </footer>
  )
}

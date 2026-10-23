import type { JSX } from 'react'
import { getDashboardData } from './dashboardData'

function navigateToArcanists(): void {
  window.location.hash = 'arcanists'
}

function navigateToStatusEffects(): void {
  window.location.hash = 'status-effects'
}

function DashboardPage(): JSX.Element {
  const { arcanists, statusEffects } = getDashboardData()

  const recentArcanists = arcanists.slice(-5).reverse()
  const recentStatusEffects = statusEffects.slice(-5).reverse()

  const skillsCount = arcanists.reduce(
    (total, arcanist) => total + (Array.isArray(arcanist.skills) ? arcanist.skills.length : 0),
    0
  )

  const portrayCount = arcanists.reduce(
    (total, arcanist) => total + (Array.isArray(arcanist.portray) ? arcanist.portray.length : 0),
    0
  )

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <div className="dashboard-eyebrow">REVERSE: 1999 NOTES</div>

          <h1>Your Knowledge Base</h1>

          <p>Keep track of Arcanists and Status Effects in one organized place.</p>
        </div>
      </section>

      <section className="dashboard-stats">
        <button type="button" className="dashboard-stat-card" onClick={navigateToArcanists}>
          <div className="dashboard-stat-icon">♙</div>

          <div className="dashboard-stat-content">
            <span className="dashboard-stat-label">Arcanists</span>
            <strong>{arcanists.length}</strong>
          </div>

          <span className="dashboard-stat-arrow">→</span>
        </button>

        <button type="button" className="dashboard-stat-card" onClick={navigateToStatusEffects}>
          <div className="dashboard-stat-icon">◇</div>

          <div className="dashboard-stat-content">
            <span className="dashboard-stat-label">Status Effects</span>
            <strong>{statusEffects.length}</strong>
          </div>

          <span className="dashboard-stat-arrow">→</span>
        </button>

        <div className="dashboard-stat-card dashboard-stat-card-static">
          <div className="dashboard-stat-icon">✦</div>

          <div className="dashboard-stat-content">
            <span className="dashboard-stat-label">Skills Recorded</span>
            <strong>{skillsCount}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card-static">
          <div className="dashboard-stat-icon">P</div>

          <div className="dashboard-stat-content">
            <span className="dashboard-stat-label">Portray Entries</span>
            <strong>{portrayCount}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Recent Arcanists</h2>
              <p>Recently added Arcanist notes.</p>
            </div>

            <button
              type="button"
              className="secondary-button dashboard-view-button"
              onClick={navigateToArcanists}
            >
              View All
            </button>
          </div>

          <div className="dashboard-recent-list">
            {recentArcanists.length === 0 ? (
              <div className="dashboard-empty">
                <span>♙</span>
                <p>No Arcanists recorded yet.</p>
              </div>
            ) : (
              recentArcanists.map((arcanist) => (
                <div key={arcanist.id} className="dashboard-recent-item">
                  <div className="dashboard-recent-main">
                    <strong>{arcanist.name}</strong>
                    <span>
                      {arcanist.afflatus || 'No Afflatus'}
                      {' • '}
                      {arcanist.damageType || 'No Damage Type'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Recent Status Effects</h2>
              <p>Recently added Status Effects.</p>
            </div>

            <button
              type="button"
              className="secondary-button dashboard-view-button"
              onClick={navigateToStatusEffects}
            >
              View All
            </button>
          </div>

          <div className="dashboard-recent-list">
            {recentStatusEffects.length === 0 ? (
              <div className="dashboard-empty">
                <span>◇</span>
                <p>No Status Effects recorded yet.</p>
              </div>
            ) : (
              recentStatusEffects.map((statusEffect) => (
                <div key={statusEffect.id} className="dashboard-recent-item">
                  <div className="dashboard-recent-main">
                    <strong>{statusEffect.name}</strong>
                    <span>{statusEffect.duration || 'No duration specified'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage

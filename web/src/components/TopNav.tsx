import { Link, NavLink } from 'react-router-dom'
import { LayoutGrid, Upload, Film, Settings } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/review', label: 'Game Review', icon: Film },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="font-semibold text-neutral-100">
          <span className="text-accent">Hockey</span> IQ Analyzer
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                    isActive ? 'bg-neutral-900 text-neutral-100' : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
                  }`
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

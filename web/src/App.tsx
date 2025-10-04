import { TopNav } from './components/TopNav'

export default function App({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}

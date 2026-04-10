type SidebarProps = {
  activeSection: string;
  onChangeSection: (section: string) => void;
  onClose?: () => void;
  className?: string;
};

const sections = ['Overview', 'Customers', 'Revenue', 'Insights', 'Settings'];

export default function Sidebar({ activeSection, onChangeSection, onClose, className = '' }: SidebarProps) {
  return (
    <aside className={`flex min-h-screen flex-col justify-between border-r border-panel bg-panel/95 px-6 py-8 text-base shadow-soft backdrop-blur-lg lg:px-6 xl:px-8 ${className}`}>
      <div className="space-y-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted">InsightBoard</p>
            <h2 className="mt-4 text-3xl font-semibold">Analytics</h2>
            <p className="mt-3 max-w-sm text-sm leading-7 text-muted">
              All of your business metrics in one elegant workspace.
            </p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-panel bg-surface px-3 py-2 text-sm font-semibold text-muted transition hover:bg-panel"
            >
              Close
            </button>
          ) : null}
        </div>

        <nav className="space-y-2">
          {sections.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onChangeSection(label)}
              aria-current={activeSection === label ? 'page' : undefined}
              className={`w-full text-left rounded-[28px] px-4 py-3 text-sm font-semibold transition ${
                activeSection === label
                  ? 'bg-brand-soft text-brand shadow-soft'
                  : 'text-muted hover:bg-surface/90 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-[28px] border border-panel bg-surface/90 p-6 text-sm text-muted shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted">Heads up</p>
        <p className="mt-3 text-sm leading-7 text-muted">
          Monthly recurring revenue is up 16% while churn remains steady. Keep an eye on product adoption next.
        </p>
      </div>
    </aside>
  );
}

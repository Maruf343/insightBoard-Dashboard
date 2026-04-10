type ToggleSwitchProps = {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

export default function ToggleSwitch({ enabled, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between rounded-[28px] border border-panel bg-surface/95 px-4 py-3 text-sm font-medium transition hover:border-brand/40 hover:bg-panel"
    >
      <span>{label}</span>
      <span
        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-200 ${
          enabled ? 'bg-brand/80' : 'bg-slate-600/40'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  );
}

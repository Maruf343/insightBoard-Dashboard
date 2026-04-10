import ToggleSwitch from './ToggleSwitch';

type ProfileSettings = {
  name: string;
  avatarUrl: string;
  email: string;
};

type AccountSettings = {
  plan: string;
  storageUsed: string;
  memberSince: string;
};

type AppearanceSettings = {
  theme: 'dark' | 'light';
  compactMode: boolean;
};

type NotificationSettings = {
  emailAlerts: boolean;
  productUpdates: boolean;
  activityDigest: boolean;
};

type PrivacySettings = {
  analyticsSharing: boolean;
  personalizedContent: boolean;
  secureSession: boolean;
};

type DashboardSettings = {
  profile: ProfileSettings;
  account: AccountSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
};

type SettingsPanelProps = {
  settings: DashboardSettings;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onUpdate: (update: Partial<DashboardSettings>) => void;
  onNotify: (message: string) => void;
};

const tabs = ['Profile Settings', 'Account Settings', 'Appearance', 'Notifications', 'Privacy'];

export default function SettingsPanel({ settings, activeTab, onChangeTab, onUpdate, onNotify }: SettingsPanelProps) {
  const handleProfileChange = (field: keyof ProfileSettings, value: string) => {
    onUpdate({ profile: { ...settings.profile, [field]: value } });
  };

  const handleAppearanceToggle = (field: keyof AppearanceSettings, value: boolean | 'dark' | 'light') => {
    onUpdate({ appearance: { ...settings.appearance, [field]: value } });
  };

  const handleNotificationToggle = (field: keyof NotificationSettings, value: boolean) => {
    onUpdate({ notifications: { ...settings.notifications, [field]: value } });
  };

  const handlePrivacyToggle = (field: keyof PrivacySettings, value: boolean) => {
    onUpdate({ privacy: { ...settings.privacy, [field]: value } });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 rounded-[28px] border border-panel bg-surface/95 p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-muted">Settings</p>
          <h2 className="mt-2 text-2xl font-semibold">Workspace preferences</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Manage your profile, account information, display mode, notifications, and privacy preferences.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onChangeTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab ? 'bg-brand text-white shadow-soft' : 'bg-surface text-base hover:bg-surface/90'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-panel bg-panel/95 p-6 shadow-soft">
        {activeTab === 'Profile Settings' && (
          <div className="space-y-8">
            <div className="flex flex-col gap-6 rounded-[28px] border border-panel bg-surface/95 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img src={settings.profile.avatarUrl} alt="User avatar" className="h-20 w-20 rounded-3xl object-cover" />
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-muted">Active profile</p>
                  <p className="mt-3 text-xl font-semibold">{settings.profile.name}</p>
                  <p className="mt-1 text-sm text-muted">{settings.profile.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNotify('Profile settings saved.')}
                className="rounded-full border border-brand bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
              >
                Save profile
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-muted">
                Name
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(event) => handleProfileChange('name', event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
                />
              </label>
              <label className="block text-sm text-muted">
                Avatar URL
                <input
                  type="url"
                  value={settings.profile.avatarUrl}
                  onChange={(event) => handleProfileChange('avatarUrl', event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
                />
              </label>
              <label className="block text-sm text-muted sm:col-span-2">
                Email address
                <input
                  type="email"
                  value={settings.profile.email}
                  readOnly
                  disabled
                  className="mt-2 w-full cursor-not-allowed rounded-3xl border border-panel bg-surface/90 px-4 py-3 text-sm text-muted outline-none"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'Account Settings' && (
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-[28px] border border-panel bg-surface/95 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-muted">Current plan</p>
              <p className="mt-3 text-2xl font-semibold">{settings.account.plan}</p>
              <p className="mt-2 text-sm text-muted">Includes advanced metrics and export controls.</p>
            </div>
            <div className="rounded-[28px] border border-panel bg-surface/95 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-muted">Storage used</p>
              <p className="mt-3 text-2xl font-semibold">{settings.account.storageUsed}</p>
              <p className="mt-2 text-sm text-muted">Your current analytics data usage.</p>
            </div>
            <div className="rounded-[28px] border border-panel bg-surface/95 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-muted">Member since</p>
              <p className="mt-3 text-2xl font-semibold">{settings.account.memberSince}</p>
              <p className="mt-2 text-sm text-muted">Your workspace joined date.</p>
            </div>
          </div>
        )}

        {activeTab === 'Appearance' && (
          <div className="space-y-6">
            <p className="text-sm text-muted">Customize the dashboard display and layout preferences.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToggleSwitch
                enabled={settings.appearance.theme === 'dark'}
                onChange={(value) => handleAppearanceToggle('theme', value ? 'dark' : 'light')}
                label="Dark mode"
              />
              <ToggleSwitch
                enabled={settings.appearance.compactMode}
                onChange={(value) => handleAppearanceToggle('compactMode', value)}
                label="Compact layout"
              />
            </div>
            <div className="rounded-[28px] border border-panel bg-surface/95 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-muted">Preview</p>
              <p className="mt-3 text-sm text-muted">
                Dark mode is {settings.appearance.theme === 'dark' ? 'enabled' : 'disabled'} and compact mode is {settings.appearance.compactMode ? 'active' : 'inactive'}.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'Notifications' && (
          <div className="space-y-6">
            <p className="text-sm text-muted">Control which notifications come through for your workspace.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToggleSwitch
                enabled={settings.notifications.emailAlerts}
                onChange={(value) => handleNotificationToggle('emailAlerts', value)}
                label="Email alerts"
              />
              <ToggleSwitch
                enabled={settings.notifications.productUpdates}
                onChange={(value) => handleNotificationToggle('productUpdates', value)}
                label="Product updates"
              />
              <ToggleSwitch
                enabled={settings.notifications.activityDigest}
                onChange={(value) => handleNotificationToggle('activityDigest', value)}
                label="Activity digest"
              />
            </div>
          </div>
        )}

        {activeTab === 'Privacy' && (
          <div className="space-y-6">
            <p className="text-sm text-muted">Your privacy settings are stored locally and control data sharing preferences.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToggleSwitch
                enabled={settings.privacy.analyticsSharing}
                onChange={(value) => handlePrivacyToggle('analyticsSharing', value)}
                label="Analytics sharing"
              />
              <ToggleSwitch
                enabled={settings.privacy.personalizedContent}
                onChange={(value) => handlePrivacyToggle('personalizedContent', value)}
                label="Personalized content"
              />
              <ToggleSwitch
                enabled={settings.privacy.secureSession}
                onChange={(value) => handlePrivacyToggle('secureSession', value)}
                label="Secure session"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

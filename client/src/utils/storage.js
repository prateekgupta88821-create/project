const STORAGE_KEY = "safeaid_settings_v1";

export const DEFAULT_SETTINGS = {
  userName: "",
  emergencyContactName: "Parent / Guardian",
  emergencyContactPhone: "+91 98765 43210",
  campusSecurityPhone: "+91 99887 76655",
  campusMedicalPhone: "+91 91234 56789",
  emergencyServicesNumber: "112",
  preferredLanguage: "English"
};

export function getSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error("Failed to save settings to localStorage:", err);
  }
}

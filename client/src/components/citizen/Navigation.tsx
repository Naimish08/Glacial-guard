import { cn } from "@/lib/utils";
import { LoginDialog } from "../LoginDialog";
import { useTranslations } from "../../lib/TranslationContext";
import { LanguageSwitcher } from "../ui/language-switcher";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "map", labelKey: "map_view", icon: "🗺️" },
  { id: "alerts", labelKey: "alerts", icon: "⚠️" },
  { id: "reports", labelKey: "reports", icon: "📊" },
  { id: "community", labelKey: "community_feedback", icon: "💬" },
];

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { t } = useTranslations();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🏔️</div>
          <div>
            <h1 className="text-xl font-bold text-primary flex items-center space-x-2">
              <span>{t("glacial_guard")}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{t("citizen")}</span>
            </h1>
            <p className="text-xs text-muted-foreground">{t("himalayan_glacier_monitoring")}</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-muted/50 rounded-xl p-1.5 border border-border/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-w-[120px] justify-center",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/80 hover:shadow-sm"
              )}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{t(tab.labelKey as keyof typeof import("../../translation/en.json"))}</span>
            </button>
          ))}
        </div>
        
        {/* Language Switcher and Status */}
        <div className="flex items-center space-x-3">
          <LanguageSwitcher />
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow"></div>
            <span className="text-sm font-medium text-green-700">{t("system_active")}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
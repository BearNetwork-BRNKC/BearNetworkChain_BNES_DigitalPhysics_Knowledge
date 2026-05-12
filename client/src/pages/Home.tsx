import { useState, useMemo } from "react";
import { Search, Menu, X, ChevronRight, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchContentInArray, Section, Subsection } from "@/lib/content";
import ContentDisplay from "@/components/ContentDisplay";
import Sidebar from "@/components/Sidebar";
import { useI18n } from "@/contexts/I18nContext";
import { content as contentStore } from "@/i18n";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("overview");
  const { t, locale, setLocale } = useI18n();

  const localizedContent = useMemo(() => {
    return contentStore[locale];
  }, [locale]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return localizedContent;
    }
    return searchContentInArray(searchQuery, localizedContent);
  }, [searchQuery, localizedContent]);

  const currentSection = useMemo(() => {
    const findById = (sections: Section[], id: string): Section | Subsection | undefined => {
      for (const section of sections) {
        if (section.id === id) return section;
        if (section.subsections) {
          const sub = section.subsections.find((s) => s.id === id);
          if (sub) return sub;
        }
      }
      return undefined;
    };
    return findById(searchResults, selectedSection) || searchResults[0];
  }, [selectedSection, searchResults]);

  const toggleLanguage = () => {
    setLocale(locale === "zh-TW" ? "en" : "zh-TW");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Header */}
      <header className="glass-nav">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                {t('app.title')}
              </h1>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                {t('app.subtitle')}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedSection(searchResults[0]?.id || "overview");
                }}
                className="pl-10 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">{t('lang.switch')}</span>
            </Button>

            {/* GitHub Link */}
            <a
              href="https://github.com/BearNetwork-BRNKC/BearNetworkChain-Physics-Engine-Canonical-Definition"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {t('nav.github')}
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedSection(searchResults[0]?.id || "overview");
              }}
              className="pl-10 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <Sidebar
          sections={searchResults}
          selectedSection={selectedSection}
          onSelectSection={(id: string) => {
            setSelectedSection(id);
            setSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {currentSection ? (
            <ContentDisplay section={currentSection} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {t('content.noResult')}
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSection("overview");
                  }}
                  variant="outline"
                >
                  {t('content.clearSearch')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { Search, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { knowledgeContent, searchContent, Section } from "@/lib/content";
import ContentDisplay from "@/components/ContentDisplay";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("overview");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return knowledgeContent;
    }
    return searchContent(searchQuery);
  }, [searchQuery]);

  const currentSection = useMemo(() => {
    return searchResults.find((s) => s.id === selectedSection) || searchResults[0];
  }, [selectedSection, searchResults]);

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
                BearNetworkChain
              </h1>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                Γ 物理引擎知識庫
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="搜尋內容..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedSection(searchResults[0]?.id || "overview");
                }}
                className="pl-10 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/BearNetwork-BRNKC/BearNetworkChain-Physics-Engine-Canonical-Definition"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            GitHub
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="搜尋內容..."
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
                  沒有找到相符的內容
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSection("overview");
                  }}
                  variant="outline"
                >
                  清除搜尋
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

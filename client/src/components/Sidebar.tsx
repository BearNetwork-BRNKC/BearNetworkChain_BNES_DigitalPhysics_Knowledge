import { Section } from "@/lib/content";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  sections: Section[];
  selectedSection: string;
  onSelectSection: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  sections,
  selectedSection,
  onSelectSection,
  isOpen,
  onClose,
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["gamma-engine", "bnes-specs", "bnql-structure", "blockchain-comparison", "stress-test", "digital-physics"])
  );

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 glass-nav border-r border-slate-200 dark:border-slate-800 overflow-y-auto z-40 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: "64px", height: "calc(100vh - 64px)" }}
      >
        <nav className="p-4 space-y-2">
          {sections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => {
                  onSelectSection(section.id);
                  if (section.subsections && section.subsections.length > 0) {
                    toggleExpanded(section.id);
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between group ${
                  selectedSection === section.id
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="text-sm">{section.title}</span>
                {section.subsections && section.subsections.length > 0 && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      expandedSections.has(section.id) ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Subsections */}
              {section.subsections &&
                expandedSections.has(section.id) && (
                  <div className="ml-4 space-y-1 mt-1">
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => onSelectSection(subsection.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                          selectedSection === subsection.id
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {subsection.title}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

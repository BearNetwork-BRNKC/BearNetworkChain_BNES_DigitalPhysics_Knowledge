import { Section, Subsection, Table } from "@/lib/content";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/contexts/I18nContext";

interface ContentDisplayProps {
  section: Section | Subsection;
}

function TableDisplay({ table }: { table: Table }) {
  return (
    <div className="overflow-x-auto my-6 rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            {table.headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-3 text-slate-700 dark:text-slate-300"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function parseMarkdownLinks(text: string) {
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Append text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Append the link component
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
      >
        {match[1]}
      </a>
    );

    lastIndex = regex.lastIndex;
  }

  // Append remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function ContentText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-4">
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={idx} />;
        }

        // Handle bullet points
        if (line.startsWith("•")) {
          return (
            <div key={idx} className="flex gap-3 ml-4">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <p className="text-slate-700 dark:text-slate-300">{line.slice(1).trim()}</p>
            </div>
          );
        }

        // Handle numbered lists
        if (/^\d+\./.test(line)) {
          return (
            <div key={idx} className="flex gap-3 ml-4">
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {line.match(/^\d+\./)?.[0]}
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                {line.replace(/^\d+\.\s*/, "")}
              </p>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {parseMarkdownLinks(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function ContentDisplay({ section }: ContentDisplayProps) {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {section.title}
        </h1>
        <Separator className="bg-gradient-to-r from-blue-600 to-transparent h-1" />
      </div>

      {/* Main Content */}
      <div className="prose dark:prose-invert max-w-none mb-8">
        <ContentText text={section.content} />
      </div>

      {/* Tables */}
      {"tables" in section &&
        section.tables &&
        section.tables.map((table, idx) => <TableDisplay key={idx} table={table} />)}

      {/* Subsections */}
      {"subsections" in section &&
        section.subsections &&
        section.subsections.map((subsection) => (
          <div key={subsection.id} className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">
              {subsection.title}
            </h2>
            <Separator className="mb-6 bg-slate-200 dark:bg-slate-700" />
            <div className="prose dark:prose-invert max-w-none">
              <ContentText text={subsection.content} />
            </div>
            {subsection.tables &&
              subsection.tables.map((table, idx) => (
                <TableDisplay key={idx} table={table} />
              ))}
          </div>
        ))}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('footer.source')}
          <br />
          {t('footer.more')}{" "}
          <a
            href="https://github.com/BearNetwork-BRNKC/BearNetworkChain-Physics-Engine-Canonical-Definition"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('footer.github')}
          </a>
        </p>
      </div>
    </div>
  );
}

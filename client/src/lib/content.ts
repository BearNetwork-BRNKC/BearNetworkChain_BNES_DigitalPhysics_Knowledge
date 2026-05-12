export interface Section {
  id: string;
  title: string;
  content: string;
  subsections?: Subsection[];
  tables?: Table[];
}

export interface Subsection {
  id: string;
  title: string;
  content: string;
  tables?: Table[];
}

export interface Table {
  headers: string[];
  rows: string[][];
}

export function searchContentInArray(query: string, contentArray: Section[]): Section[] {
  const lowerQuery = query.toLowerCase();
  const results: Section[] = [];

  contentArray.forEach((section) => {
    if (
      section.title.toLowerCase().includes(lowerQuery) ||
      section.content.toLowerCase().includes(lowerQuery)
    ) {
      results.push(section);
    } else if (section.subsections) {
      const matchingSubsections = section.subsections.filter(
        (sub) =>
          sub.title.toLowerCase().includes(lowerQuery) ||
          sub.content.toLowerCase().includes(lowerQuery)
      );

      if (matchingSubsections.length > 0) {
        results.push({
          ...section,
          subsections: matchingSubsections,
        });
      }
    }
  });

  return results;
}

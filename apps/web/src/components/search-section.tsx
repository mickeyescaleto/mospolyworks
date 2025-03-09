import { ThemeService } from '@/services/theme';
import { SearchInput } from '@/components/search-input';
import { Filtering } from '@/components/filtering';
import { Sorting } from '@/components/sorting';

async function getExhibitionThemes() {
  try {
    return await ThemeService.getExhibitionThemes();
  } catch {
    return [];
  }
}

export async function SearchSection() {
  const exhibitionThemes = await getExhibitionThemes();

  return (
    <section>
      <div className="wrapper flex flex-col gap-2">
        <SearchInput placeholder="Поиск" />
        <div className="flex gap-4">
          <Filtering themes={exhibitionThemes} />
          <Sorting />
        </div>
      </div>
    </section>
  );
}

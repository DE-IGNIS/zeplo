import { supabase } from "./supabase";

export type Book = {
  id: string;
  created_at: string;
  title: string;
  author: string;
  genre: string | null;
  rating: number | null;
  review: string | null;
};

export type NewBook = Omit<Book, "id" | "created_at">;

export async function addBook(
  book: NewBook,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("books").insert(book);
  return { error: error?.message ?? null };
}

export async function getBooks(): Promise<{
  data: Book[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  return { data: data ?? [], error: error?.message ?? null };
}

export async function deleteBook(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("books").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function updateBook(
  id: string,
  updates: Partial<NewBook>,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("books").update(updates).eq("id", id);
  return { error: error?.message ?? null };
}

export type MonthlyCount = {
  month: number; // 1–12
  count: number;
};

export type YearlyStats = {
  year: number;
  monthly: MonthlyCount[];
};

export type Stats = {
  totalBooks: number;
  favouriteGenre: string | null;
  byYear: YearlyStats[];
};

export async function getStats(): Promise<{
  data: Stats | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("books")
    .select("created_at, genre");

  if (error) return { data: null, error: error.message };
  if (!data || data.length === 0) {
    return {
      data: { totalBooks: 0, favouriteGenre: null, byYear: [] },
      error: null,
    };
  }

  const totalBooks = data.length;

  const genreCounts: Record<string, number> = {};
  for (const book of data) {
    if (book.genre?.trim()) {
      const g = book.genre.trim().toLowerCase();
      genreCounts[g] = (genreCounts[g] ?? 0) + 1;
    }
  }
  const favouriteGenre =
    Object.keys(genreCounts).length > 0
      ? Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0][0]
      : null;

  const yearMap: Record<number, Record<number, number>> = {};
  for (const book of data) {
    const date = new Date(book.created_at);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1–12
    if (!yearMap[year]) yearMap[year] = {};
    yearMap[year][month] = (yearMap[year][month] ?? 0) + 1;
  }

  const byYear: YearlyStats[] = Object.entries(yearMap)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, months]) => ({
      year: Number(year),
      monthly: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        count: months[i + 1] ?? 0,
      })),
    }));

  return {
    data: { totalBooks, favouriteGenre, byYear },
    error: null,
  };
}

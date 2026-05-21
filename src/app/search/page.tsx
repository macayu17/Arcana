import { Suspense } from "react";
import { SearchPage } from "@/components/search/search-page";

export const metadata = {
  title: "Search",
  description: "Search Arcana projects, concepts, questions, and flashcards.",
};

export default function SearchRoute() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}

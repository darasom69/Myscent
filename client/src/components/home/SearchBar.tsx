function SearchBar() {
  return (
    <section className="bg-primary flex flex-col items-center justify-start">
      <input
        type="text"
        placeholder="Recherche"
        className="w-3/4 max-w-md block mx-auto mt-6 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring"
      />
    </section>
  );
}
export default SearchBar;

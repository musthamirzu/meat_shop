import { HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <section className="px-4 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex h-12 max-w-4xl items-center gap-3 rounded-2xl bg-gray-100/90 px-4 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-red-600 focus-within:shadow-md border border-gray-200">
        <HiOutlineMagnifyingGlass
          size={20}
          className="shrink-0 text-gray-500"
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for Country Chicken, Mutton Sukka, Vanjaram, Keema..."
          className="w-full bg-transparent text-xs sm:text-sm text-gray-900 outline-none placeholder:text-gray-400 font-medium"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <HiXMark size={18} />
          </button>
        )}
      </div>
    </section>
  );
};

export default SearchBar;
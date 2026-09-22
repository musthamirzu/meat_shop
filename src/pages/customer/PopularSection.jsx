import ProductCard from "./ProductCard";
import { PRODUCTS } from "../../data/mockData";

const PopularSection = ({ activeCategory = "all", searchQuery = "" }) => {
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;

    const matchesSearch =
      searchQuery.trim() === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tamilName?.includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.allowedPreparations?.some((prep) =>
        prep.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="mt-6 pb-28 px-4 sm:px-6 lg:px-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
            {activeCategory === "all"
              ? "Today's Fresh Cuts & Special Cuts"
              : `${activeCategory.toUpperCase()} Cuts`}
          </h2>
          <p className="text-xs text-gray-500">
            Select weight in kg, boneless, and preparation style (Sukka, Kulambu, Fry, etc.)
          </p>
        </div>

        <span className="text-xs font-bold text-gray-400">
          {filteredProducts.length} items available
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-gray-50 rounded-3xl border border-gray-200">
          <p className="text-2xl">🥩</p>
          <h3 className="text-sm font-bold text-gray-800 mt-2">
            No meat cuts matching "{searchQuery}"
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Try searching for "chicken", "mutton", "sukka", or "boneless"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularSection;
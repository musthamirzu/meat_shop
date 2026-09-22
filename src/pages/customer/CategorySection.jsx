import { CATEGORIES } from "../../data/mockData";

const CategorySection = ({ activeCategory, onSelectCategory }) => {
  return (
    <section className="mt-4 sm:mt-6">
      <div className="mb-3 flex items-center justify-between px-4 sm:px-6 lg:px-10">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
            Shop by Meat Category
          </h2>
          <p className="text-xs text-gray-500">Fresh cuts butchered daily on order</p>
        </div>

        {activeCategory !== "all" && (
          <button
            onClick={() => onSelectCategory("all")}
            className="text-xs font-bold text-red-600 hover:underline"
          >
            Show All Cuts
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-3 sm:px-6 lg:px-10 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex shrink-0 flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${
                isSelected
                  ? "bg-red-50 ring-2 ring-red-600 shadow-sm"
                  : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl text-2xl sm:text-3xl shadow-xs transition duration-200 group-hover:-translate-y-0.5 ${
                  isSelected
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                    : "bg-white border border-gray-200"
                }`}
              >
                {cat.icon}
              </div>

              <span
                className={`text-[11px] sm:text-xs font-bold ${
                  isSelected ? "text-red-700" : "text-gray-700"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
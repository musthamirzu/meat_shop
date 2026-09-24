const CategoryCard = ({ name, emoji }) => {
  return (
    <button className="group flex w-[72px] shrink-0 flex-col items-center gap-2">
      <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-gray-100 bg-red-50 text-3xl shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
        {emoji}
      </div>

      <span className="text-xs font-semibold text-gray-700">
        {name}
      </span>
    </button>
  );
};

export default CategoryCard;
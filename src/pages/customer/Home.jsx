import { useState } from "react";
import BottomNavigation from "./BottomNavigation";
import CategorySection from "./CategorySection";
import HomeHeader from "./HomeHeader";
import OfferBanner from "./Offerbanner";
import PopularSection from "./PopularSection";
import SearchBar from "./SearchBar";
import CartDrawer from "../../components/customer/CartDrawer";
import LoginModal from "../../components/common/LoginModal";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="mx-auto min-h-screen w-full max-w-7xl bg-white shadow-xs">
        <HomeHeader />

        <main>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <CategorySection
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          <OfferBanner />

          <PopularSection
            activeCategory={activeCategory}
            searchQuery={searchQuery}
          />
        </main>

        <BottomNavigation />
        <CartDrawer />
        <LoginModal />
      </div>
    </div>
  );
};

export default Home;
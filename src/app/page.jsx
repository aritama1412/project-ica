import ProductSection from "../components/products/productSection.jsx";
import FilterSection from "../components/filter/filterSection.jsx";
import Navbar from "../components/navbar/navbar.jsx";

export default function Home() {
  return (
    <main className="flex flex-col w-screen max-w-[1280px] mx-auto h-[1800px] min-h-screen ">
      <Navbar />
      <div className="flex flex-row gap-5">
        <FilterSection />
        <ProductSection />
      </div>
    </main>
  );
}

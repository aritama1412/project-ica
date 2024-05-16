import Filter from "./filter/page.jsx";
import Navbar from "./navbar/page.jsx";
import Products from "./products/page.jsx";

export default function Home() {
  return (
    <main className="flex flex-col w-screen max-w-[1280px] mx-auto h-[1800px] min-h-screen bg-green-700">
      <Navbar />
      <div className="flex flex-row ">
        <Filter />
        <Products />
      </div>
    </main>
  );
}

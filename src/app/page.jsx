import Filter from "./filter/page.jsx";
import Navbar from "./navbar/page.jsx";
import Products from "./products/page.jsx";

export default function Home() {
  return (
    <main className="flex flex-col w-screen max-w-[1280px] mx-auto h-[1800px] min-h-screen ">
      <Navbar />
      <div className="flex flex-row gap-5">
        <Filter />
        <Products />
      </div>
    </main>
  );
}

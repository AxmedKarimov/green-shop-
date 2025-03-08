import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./_homePages/Navbar";
import Sliders from "./_homePages/Sec-1";
import Footer from "./_homePages/Footer";
import ProductsPage from "./(productsHome)/page";

export default function Home() {
  return (
    <div className="w-full">
      <div className="w-[80%] mx-auto">
        <Navbar />
        <Sliders />
        <ProductsPage />
        <Footer />
      </div>
    </div>
  );
}

import Header from "@/components/layout/Header";
import QuickCategories from "@/components/home/QuickCategories";
import BrandSections from "@/components/home/BrandSections";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <QuickCategories />
      <BrandSections />
      <Footer />
    </main>
  );
}


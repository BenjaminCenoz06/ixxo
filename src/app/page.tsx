import Hero from "@/components/home/Hero";
import NewCollection from "@/components/home/NewCollection";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Collections from "@/components/home/Collections";
import Editorial from "@/components/home/Editorial";
import Lookbook from "@/components/home/Lookbook";
import InstagramFeed from "@/components/home/InstagramFeed";
import Reviews from "@/components/home/Reviews";
import Newsletter from "@/components/home/Newsletter";

// Render dinámico para reflejar al instante los cambios del admin en la base.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <NewCollection />
      <Categories />
      <FeaturedProducts />
      <Collections />
      <Editorial />
      <Lookbook />
      <InstagramFeed />
      <Reviews />
      <Newsletter />
    </>
  );
}

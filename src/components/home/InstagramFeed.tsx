import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { Reveal } from "@/components/ui/Reveal";
import { editorial } from "@/data/images";

const posts = Array.from({ length: 6 }).map((_, i) => ({
  id: `ig-${i}`,
  src: editorial(`instagram-${i}`, 600, 600),
}));

export default function InstagramFeed() {
  return (
    <section className="container-ixxo py-20 md:py-28">
      <div className="mb-12 flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow mb-3">Comunidad</p>
          <h2 className="font-display text-3xl font-light tracking-tight md:text-[2.75rem]">
            @tiendasixxo_oficial
          </h2>
          <Link
            href="https://www.instagram.com/tiendasixxo_oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.16em]"
          >
            <InstagramIcon size={16} />
            Seguinos
          </Link>
        </Reveal>
      </div>

      <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href="https://www.instagram.com/tiendasixxo_oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden bg-smoke"
          >
            <Image
              src={post.src}
              alt="Instagram IXXO"
              fill
              sizes="(max-width:768px) 33vw, 16vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30">
              <InstagramIcon
                size={22}
                className="text-paper opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

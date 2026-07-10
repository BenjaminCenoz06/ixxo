"use client";

import Image from "next/image";
import { PageHeader, Btn } from "@/components/admin/ui";
import { collections } from "@/data/collections";
import { Plus } from "lucide-react";

export default function AdminColecciones() {
  return (
    <>
      <PageHeader
        title="Colecciones"
        subtitle={`${collections.length} colecciones`}
        action={
          <Btn variant="outline">
            <Plus size={15} /> Nueva colección
          </Btn>
        }
      />
      <div className="space-y-4">
        {collections.map((c) => (
          <div key={c.slug} className="flex gap-5 border border-line bg-paper p-4">
            <div className="relative aspect-[16/10] w-48 shrink-0 overflow-hidden bg-smoke">
              <Image src={c.image} alt={c.title} fill sizes="192px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="font-display text-lg">{c.title}</p>
              <p className="text-[11px] uppercase tracking-wide text-ash">/{c.slug}</p>
              <p className="mt-2 max-w-md text-[13px] text-ash">{c.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

"use client";

import Image from "next/image";
import { PageHeader, Btn } from "@/components/admin/ui";
import { categories } from "@/data/categories";
import { Plus } from "lucide-react";

export default function AdminCategorias() {
  return (
    <>
      <PageHeader
        title="Categorías"
        subtitle={`${categories.length} categorías`}
        action={
          <Btn variant="outline">
            <Plus size={15} /> Nueva categoría
          </Btn>
        }
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <div key={c.slug} className="border border-line bg-paper">
            <div className="relative aspect-[4/3] overflow-hidden bg-smoke">
              <Image src={c.image} alt={c.name} fill sizes="240px" className="object-cover" />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-[14px] font-medium">{c.name}</p>
                <p className="text-[11px] text-ash">/{c.slug}</p>
              </div>
              <span className="text-[12px] text-ash">{c.count}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

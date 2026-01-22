"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/constants/categories";

export function CategoriesGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Link key={category.id} href={category.href}>
            <Card
              className={cn(
                "transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer group",
                category.bgColor
              )}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
                <div className="p-3 rounded-full bg-white/50 group-hover:bg-white transition-colors">
                  <Icon className={cn("h-6 w-6", category.color)} />
                </div>
                <span className="text-sm font-medium text-center">{category.name}</span>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

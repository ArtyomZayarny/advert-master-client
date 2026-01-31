"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/constants/categories";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CategoriesGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/carousel">
      {/* Left Arrow */}
      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Categories Carousel */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex flex-nowrap gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-1 py-1"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.id} href={category.href} className="flex-shrink-0">
              <Card
                className={cn(
                  "transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer group w-[110px] h-[100px]",
                  category.bgColor
                )}
              >
                <CardContent className="flex flex-col items-center justify-center p-3 h-full">
                  <div className="p-2 rounded-full bg-white/50 group-hover:bg-white transition-colors">
                    <Icon className={cn("h-5 w-5", category.color)} />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight mt-1.5 line-clamp-2">{category.name}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

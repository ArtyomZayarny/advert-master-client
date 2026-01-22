"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setFilters } from "@/lib/store/slices/advertSlice";

interface AdvertFiltersProps {
  onApplyFilters: (filters: any) => void;
}

export function AdvertFilters({ onApplyFilters }: AdvertFiltersProps) {
  const dispatch = useAppDispatch();
  const currentFilters = useAppSelector((state) => state.advert.filters);
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    city: currentFilters.city || "",
    priceMin: currentFilters.priceMin || 0,
    priceMax: currentFilters.priceMax || 100000,
    sortBy: currentFilters.sortBy || "date",
  });

  const handleApply = () => {
    dispatch(setFilters(localFilters));
    onApplyFilters(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      city: "",
      priceMin: 0,
      priceMax: 100000,
      sortBy: "date",
    };
    setLocalFilters(resetFilters);
    dispatch(setFilters({}));
    onApplyFilters({});
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
        {Object.keys(currentFilters).length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Filter & Sort</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={localFilters.city}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, city: e.target.value })
                }
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <Label>Price Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priceMin" className="text-xs">
                    Min Price
                  </Label>
                  <Input
                    id="priceMin"
                    type="number"
                    value={localFilters.priceMin}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        priceMin: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="priceMax" className="text-xs">
                    Max Price
                  </Label>
                  <Input
                    id="priceMax"
                    type="number"
                    value={localFilters.priceMax}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        priceMax: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                value={localFilters.sortBy}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, sortBy: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Newest First</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleApply} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

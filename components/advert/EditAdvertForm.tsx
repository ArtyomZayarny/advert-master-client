"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Advert } from "@/lib/api/adverts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import Image from "next/image";

const editAdvertSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  currency: z.enum(["EUR", "GBP", "RUB"]),
  address: z.string().optional(),
  city: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.any().optional(),
  mileage: z.any().optional(),
  square: z.any().optional(),
  rooms: z.string().optional(),
});

type FormData = z.infer<typeof editAdvertSchema>;

interface EditAdvertFormProps {
  advert: Advert;
  category: string;
}

export function EditAdvertForm({ advert, category }: EditAdvertFormProps) {
  const router = useRouter();
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(editAdvertSchema),
    defaultValues: {
      title: advert.title || "",
      description: advert.description || "",
      price: advert.price || 0,
      currency: (advert.currency as "EUR" | "GBP" | "RUB") || "EUR",
      address: advert.address || "",
      city: advert.city || "",
      brand: advert.brand || "",
      model: advert.model || "",
      year: advert.year || undefined,
      mileage: advert.mileage || undefined,
      square: advert.square || undefined,
      rooms: advert.rooms || "",
    },
  });

  useEffect(() => {
    const photos = [advert.upload, ...(advert.full_upload?.map((img) => img.uploads) || [])].filter(Boolean);
    setExistingPhotos(photos as string[]);
  }, [advert]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiClient.put(`/${category}/${advert.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ad updated successfully!");
      router.push(`/listings/${category}/${advert.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update ad");
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + newPhotos.length > 10) {
      toast.error("Maximum 10 photos allowed");
      return;
    }
    setNewPhotos([...newPhotos, ...files]);
    setNewPhotoPreviews([...newPhotoPreviews, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos(newPhotos.filter((_, i) => i !== index));
    setNewPhotoPreviews(newPhotoPreviews.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Ad Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter ad title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your item in detail"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Price and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                {...register("price")}
                placeholder="0"
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Currency *</Label>
              <Select
                value={watch("currency")}
                onValueChange={(value) => setValue("currency", value as "EUR" | "GBP" | "RUB")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="RUB">RUB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Enter address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="Enter city"
              />
            </div>
          </div>

          {/* Category-specific fields for Avto */}
          {category === "avto" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" {...register("brand")} placeholder="e.g. Tesla" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" {...register("model")} placeholder="e.g. Model 3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" {...register("year")} placeholder="e.g. 2020" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input id="mileage" type="number" {...register("mileage")} placeholder="e.g. 50000" />
              </div>
            </div>
          )}

          {/* Category-specific fields for Realty */}
          {category === "realty" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="square">Square (m²)</Label>
                <Input id="square" type="number" {...register("square")} placeholder="e.g. 80" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rooms">Rooms</Label>
                <Input id="rooms" {...register("rooms")} placeholder="e.g. 3" />
              </div>
            </div>
          )}

          {/* Photos */}
          <div className="space-y-4">
            <Label>Photos</Label>

            {existingPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingPhotos.map((photo, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="new-photos"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-accent transition-colors"
              >
                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload additional photos</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                <input
                  id="new-photos"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            {newPhotoPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newPhotoPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={preview}
                      alt={`New ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Errors Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm font-medium text-destructive mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside text-sm text-destructive">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{field}: {(error as { message?: string })?.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Ad"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
import { Upload, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { AddressAutocomplete } from "@/components/map/AddressAutocomplete";

const editAdvertSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().min(0, "Price must be positive"),
  currency: z.enum(["EUR", "GBP", "RUB"]),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  // Category-specific fields
  square: z.number().optional(),
  rooms: z.string().optional(),
  floor: z.number().optional(),
  type_sell: z.string().optional(),
  condition: z.string().optional(),
  isMonth: z.boolean().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  mileage: z.number().optional(),
  gas: z.string().optional(),
  transmission: z.boolean().optional(),
  isUsed: z.boolean().optional(),
  employment: z.string().optional(),
  workType: z.boolean().optional(),
});

interface EditAdvertFormProps {
  advert: Advert;
  category: string;
}

export function EditAdvertForm({ advert, category }: EditAdvertFormProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [geocode, setGeocode] = useState<string>(advert.geocode || "");

  const form = useForm<z.infer<typeof editAdvertSchema>>({
    resolver: zodResolver(editAdvertSchema),
    defaultValues: {
      title: advert.title || "",
      description: advert.description || "",
      price: advert.price || 0,
      currency: (advert.currency as "EUR" | "GBP" | "RUB") || "EUR",
      address: advert.address || "",
      city: advert.city || "",
      square: advert.square || undefined,
      rooms: advert.rooms || undefined,
      floor: advert.floor || undefined,
      type_sell: advert.type_sell || undefined,
      condition: advert.condition || undefined,
      isMonth: advert.isMonth || undefined,
      brand: advert.brand || undefined,
      model: advert.model || undefined,
      year: advert.year || undefined,
      mileage: advert.mileage || undefined,
      gas: advert.gas || undefined,
      transmission: advert.transmission || undefined,
      isUsed: advert.isUsed || undefined,
      employment: advert.employment || undefined,
      workType: advert.workType || undefined,
    },
  });

  useEffect(() => {
    // Load existing photos
    const photos = [advert.upload, ...(advert.full_upload?.map((img) => img.uploads) || [])].filter(Boolean);
    setExistingPhotos(photos as string[]);
  }, [advert]);

  const updateAdMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "photos" && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      // Add geocode if available
      if (geocode) {
        formData.append("geocode", geocode);
      }

      photos.forEach((photo) => {
        formData.append("upload", photo);
      });

      const response = await apiClient.put(`/${category}/${advert.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ad updated successfully!");
      router.push(`/listings/${category}/${advert.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update ad");
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 10) {
      toast.error("Maximum 10 photos allowed");
      return;
    }

    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    const newPreviews = newPhotos.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(newPreviews);
  };

  const removeNewPhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
  };

  const onSubmit = (data: z.infer<typeof editAdvertSchema>) => {
    updateAdMutation.mutate({
      ...data,
      photos,
    });
  };

  const allPhotos = [...existingPhotos, ...photoPreviews];

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Ad Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Enter ad title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe your item in detail"
                rows={6}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  {...form.register("price", { valueAsNumber: true })}
                  placeholder="0"
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select
                  value={form.watch("currency")}
                  onValueChange={(value) => {
                    form.setValue("currency", value as "EUR" | "GBP" | "RUB", { shouldValidate: true });
                  }}
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

            <AddressAutocomplete
              value={form.watch("address")}
              onChange={(address, city, geocodeValue) => {
                form.setValue("address", address);
                form.setValue("city", city);
                setGeocode(geocodeValue);
              }}
              onError={(error) => toast.error(error)}
              label="Address"
              placeholder="Enter address..."
              required
            />
            {form.formState.errors.address && (
              <p className="text-sm text-destructive">
                {form.formState.errors.address.message}
              </p>
            )}

            {/* Category-specific fields */}
            {category === "realty" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advert.square && (
                  <div className="space-y-2">
                    <Label htmlFor="square">Square (m²)</Label>
                    <Input
                      id="square"
                      type="number"
                      defaultValue={advert.square}
                      {...form.register("square", { valueAsNumber: true })}
                    />
                  </div>
                )}
                {advert.rooms && (
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Rooms</Label>
                    <Input
                      id="rooms"
                      defaultValue={advert.rooms}
                      {...form.register("rooms")}
                    />
                  </div>
                )}
              </div>
            )}

            {category === "avto" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advert.brand && (
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" defaultValue={advert.brand} {...form.register("brand")} />
                  </div>
                )}
                {advert.model && (
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" defaultValue={advert.model} {...form.register("model")} />
                  </div>
                )}
                {advert.year && (
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      defaultValue={advert.year}
                      {...form.register("year", { valueAsNumber: true })}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Photos Section */}
            <div className="space-y-4">
              <Label>Photos</Label>
              
              {/* Existing Photos */}
              {existingPhotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingPhotos.map((photo, index) => (
                    <div key={index} className="relative aspect-square group">
                      <Image
                        src={photo}
                        alt={`Existing ${index + 1}`}
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

              {/* New Photos Upload */}
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="new-photos"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-accent transition-colors"
                >
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload additional photos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB (Max 10 total)
                  </p>
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

              {/* New Photo Previews */}
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photoPreviews.map((preview, index) => (
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

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateAdMutation.isPending}>
                {updateAdMutation.isPending ? "Updating..." : "Update Ad"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}

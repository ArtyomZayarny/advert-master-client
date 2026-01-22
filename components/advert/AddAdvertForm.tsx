"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { categories, getCategoryById } from "@/lib/constants/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AddressAutocomplete } from "@/components/map/AddressAutocomplete";

const baseAdvertSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().min(0, "Price must be positive"),
  currency: z.enum(["EUR", "GBP", "RUB"]),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  category: z.string(),
  subCategory: z.string().optional(),
});

export function AddAdvertForm() {
  const router = useRouter();
  const [step, setStep] = useState<"category" | "details" | "photos">("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [geocode, setGeocode] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(baseAdvertSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      currency: "EUR" as const,
      address: "",
      city: "",
      category: "",
      subCategory: "",
    },
  });

  const createAdMutation = useMutation({
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

      photos.forEach((photo, index) => {
        formData.append("upload", photo);
      });

      const response = await apiClient.post(`/${selectedCategory}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ad created successfully!");
      router.push("/profile");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to create ad");
    },
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    form.setValue("category", categoryId);
    setStep("details");
  };

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

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const onSubmit = (data: z.infer<typeof baseAdvertSchema>) => {
    if (photos.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    createAdMutation.mutate({
      ...data,
      photos,
    });
  };

  if (step === "category") {
    return (
      <FormProvider {...form}>
        <Card>
          <CardHeader>
            <CardTitle>Select Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="p-6 border rounded-lg hover:border-primary hover:bg-accent transition-all text-left"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 rounded-full bg-muted">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </FormProvider>
    );
  }

  if (step === "details") {
    const category = getCategoryById(selectedCategory || "");

    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(() => setStep("photos"))} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ad Details</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("category")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
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
                    onValueChange={(value) => form.setValue("currency", value as "EUR" | "GBP" | "RUB")}
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
              {category?.id === "realty" && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold">Real Estate Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="square">Square (m²)</Label>
                      <Input
                        id="square"
                        type="number"
                        {...form.register("square", { valueAsNumber: true })}
                        placeholder="Enter square footage"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rooms">Rooms</Label>
                      <Select onValueChange={(value) => form.setValue("rooms", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rooms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Studio">Studio</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4+">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="floor">Floor</Label>
                      <Input
                        id="floor"
                        type="number"
                        {...form.register("floor", { valueAsNumber: true })}
                        placeholder="Enter floor number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type_sell">Type</Label>
                      <Select onValueChange={(value) => form.setValue("type_sell", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rent">Rent</SelectItem>
                          <SelectItem value="Sell">Sell</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {category?.id === "avto" && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold">Auto Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input id="brand" {...form.register("brand")} placeholder="e.g., Toyota" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input id="model" {...form.register("model")} placeholder="e.g., Camry" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        {...form.register("year", { valueAsNumber: true })}
                        placeholder="e.g., 2020"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage (km)</Label>
                      <Input
                        id="mileage"
                        type="number"
                        {...form.register("mileage", { valueAsNumber: true })}
                        placeholder="Enter mileage"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gas">Fuel Type</Label>
                      <Select onValueChange={(value) => form.setValue("gas", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Petrol">Petrol</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Electric">Electric</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmission</Label>
                      <Select onValueChange={(value) => form.setValue("transmission", value === "true")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Automatic</SelectItem>
                          <SelectItem value="false">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {category?.id === "work" && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold">Job Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employment">Employment Type</Label>
                      <Select onValueChange={(value) => form.setValue("employment", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full time">Full time</SelectItem>
                          <SelectItem value="Part time">Part time</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workType">Work Type</Label>
                      <Select onValueChange={(value) => form.setValue("workType", value === "true")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">For work (Post resume)</SelectItem>
                          <SelectItem value="false">For employee (Place vacancy)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setStep("category")}>
                  Back
                </Button>
                <Button type="submit">Next: Add Photos</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add Photos</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep("details")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="photos">Photos * (At least 1, max 10)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="photos"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-accent transition-colors"
                >
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB
                  </p>
                  <input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>

            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button type="submit" disabled={createAdMutation.isPending || photos.length === 0}>
                {createAdMutation.isPending ? "Creating..." : "Create Ad"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}

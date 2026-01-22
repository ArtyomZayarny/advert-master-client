import {
  Home,
  Car,
  Briefcase,
  Wrench,
  Baby,
  Smartphone,
  Shirt,
  Sprout,
  Gift,
  LucideIcon,
} from "lucide-react";

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  nameRu: string;
  nameTr: string;
  icon: LucideIcon;
  href: string;
  color: string;
  bgColor: string;
}

export const categories: Category[] = [
  {
    id: "realty",
    name: "Real Estate",
    nameEn: "Real Estate",
    nameRu: "Недвижимость",
    nameTr: "Emlak",
    icon: Home,
    href: "/adverts/realty",
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    id: "avto",
    name: "Auto",
    nameEn: "Auto",
    nameRu: "Авто",
    nameTr: "Otomobil",
    icon: Car,
    href: "/adverts/avto",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 hover:bg-cyan-100",
  },
  {
    id: "work",
    name: "Job",
    nameEn: "Job",
    nameRu: "Работа",
    nameTr: "İş",
    icon: Briefcase,
    href: "/adverts/work",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 hover:bg-yellow-100",
  },
  {
    id: "services",
    name: "Services",
    nameEn: "Services",
    nameRu: "Услуги",
    nameTr: "Hizmetler",
    icon: Wrench,
    href: "/adverts/services",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  {
    id: "children",
    name: "For Kids",
    nameEn: "For Kids",
    nameRu: "Для детей",
    nameTr: "Çocuklar için",
    icon: Baby,
    href: "/adverts/children",
    color: "text-pink-600",
    bgColor: "bg-pink-50 hover:bg-pink-100",
  },
  {
    id: "electronics",
    name: "Electronics",
    nameEn: "Electronics",
    nameRu: "Электроника",
    nameTr: "Elektronik",
    icon: Smartphone,
    href: "/adverts/electronics",
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
  },
  {
    id: "fashion",
    name: "Fashion & Style",
    nameEn: "Fashion & Style",
    nameRu: "Мода и стиль",
    nameTr: "Moda ve Stil",
    icon: Shirt,
    href: "/adverts/fashion",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 hover:bg-indigo-100",
  },
  {
    id: "house_garden",
    name: "House & Garden",
    nameEn: "House & Garden",
    nameRu: "Дом и сад",
    nameTr: "Ev ve Bahçe",
    icon: Sprout,
    href: "/adverts/house_garden",
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
  },
  {
    id: "free",
    name: "Free",
    nameEn: "Free",
    nameRu: "Бесплатно",
    nameTr: "Ücretsiz",
    icon: Gift,
    href: "/adverts/free",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 hover:bg-emerald-100",
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((cat) => cat.id === id);
}

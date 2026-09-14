export type HomepageSection = {
  key: string;
  label: string;
  description: string;
  imageSlots?: string[];
  fallbackImage: string;
  visible: boolean;
};

export const homepageSections: HomepageSection[] = [
  { key: "hero", label: "Hero", description: "Main introduction, calls to action and trust highlights.", imageSlots: ["hero.image"], fallbackImage: "/assets/photos/shiba-smile.webp", visible: true },
  { key: "services", label: "Services", description: "Pet hotel, puppies, grooming and pet shop cards.", imageSlots: ["services.hotel_image", "services.puppies_image", "services.grooming_image", "services.shop_image"], fallbackImage: "/assets/photos/hotel-rooms.webp", visible: true },
  { key: "tour", label: "How It Works", description: "The three steps guests follow before check-in.", fallbackImage: "/assets/photos/store-wide.webp", visible: true },
  { key: "hotel", label: "Hotel Rates", description: "Dog rooms, cat rooms and premium wash pricing.", imageSlots: ["hotel.dogs_image", "hotel.cats_image", "hotel.wash_image"], fallbackImage: "/assets/photos/hotel-rooms-3.webp", visible: true },
  { key: "grooming", label: "Grooming", description: "Grooming services, packages and prices.", imageSlots: ["services.grooming_image"], fallbackImage: "/assets/photos/grooming-area.webp", visible: true },
  { key: "prepare", label: "Before You Stay", description: "Packing guidance and the care promise.", fallbackImage: "/assets/photos/shiba-black.webp", visible: true },
  { key: "gallery", label: "Gallery", description: "A visual tour of the shop, hotel and facilities.", imageSlots: ["gallery.featured", "gallery.image_2", "gallery.image_3", "gallery.image_4", "gallery.image_5", "gallery.image_6", "gallery.image_7", "gallery.image_8"], fallbackImage: "/assets/photos/storefront.webp", visible: true },
  { key: "story", label: "Our Story", description: "The story of Kumi and how the business began.", imageSlots: ["story.kumi_image"], fallbackImage: "/assets/photos/shiba-kumi.webp", visible: true },
  { key: "team", label: "Team", description: "The people caring for pets each day and night.", imageSlots: ["team.banner_image"], fallbackImage: "/assets/photos/team-group.webp", visible: true },
  { key: "reviews", label: "Reviews", description: "Testimonials from pet owners.", fallbackImage: "/assets/photos/shiba-puppy.webp", visible: true },
  { key: "contact", label: "Contact", description: "Phone details and the public enquiry form.", fallbackImage: "/assets/photos/reception-cctv.webp", visible: true },
];

export type HomepageLayoutItem = Pick<HomepageSection, "key" | "visible">;

export function mergeHomepageLayout(value?: string | null): HomepageLayoutItem[] {
  let saved: HomepageLayoutItem[] = [];
  try {
    const parsed = JSON.parse(value || "[]");
    if (Array.isArray(parsed)) saved = parsed;
  } catch {
    // Invalid or legacy values safely fall back to the registered layout.
  }

  const registered = new Map(homepageSections.map((section) => [section.key, section]));
  const used = new Set<string>();
  const result: HomepageLayoutItem[] = [];
  saved.forEach((item) => {
    if (!item || typeof item.key !== "string" || used.has(item.key) || !registered.has(item.key)) return;
    used.add(item.key);
    result.push({ key: item.key, visible: item.visible !== false });
  });
  homepageSections.forEach((section) => {
    if (!used.has(section.key)) result.push({ key: section.key, visible: section.visible });
  });
  return result;
}

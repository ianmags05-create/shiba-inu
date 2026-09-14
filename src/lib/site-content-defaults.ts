export type SiteContentDefault = {
  content_key: string;
  label: string;
  section: string;
  value: string;
  content_type: "text" | "textarea" | "url" | "phone" | "email";
  sort_order: number;
};

export const siteContentDefaults: SiteContentDefault[] = [
  { content_key: "hero.eyebrow", label: "Eyebrow", section: "Hero", value: "24/7 pet hotel · grooming · puppies · supplies · Davao City", content_type: "text", sort_order: 10 },
  { content_key: "hero.title", label: "Main heading", section: "Hero", value: "A home away from home for your furbabies", content_type: "text", sort_order: 20 },
  { content_key: "hero.description", label: "Introduction", section: "Hero", value: "Air-conditioned rooms, CCTV access and someone on site every hour of every day. Drop off at dawn or midnight, we are open. Dogs from ₱900 a night, cats from ₱850.", content_type: "textarea", sort_order: 30 },
  { content_key: "hero.primary_button", label: "Primary button", section: "Hero", value: "Contact us", content_type: "text", sort_order: 40 },
  { content_key: "hero.secondary_button", label: "Secondary button", section: "Hero", value: "See our rates", content_type: "text", sort_order: 50 },
  { content_key: "services.eyebrow", label: "Eyebrow", section: "Services", value: "What we do", content_type: "text", sort_order: 100 },
  { content_key: "services.title", label: "Heading", section: "Services", value: "Four ways we look after your pet", content_type: "text", sort_order: 110 },
  { content_key: "services.description", label: "Introduction", section: "Services", value: "Puppies, boarding, grooming and supplies, all on one site at KM5 Buhangin.", content_type: "textarea", sort_order: 120 },
  { content_key: "services.hotel_title", label: "Pet hotel title", section: "Services", value: "Pet Hotel 24/7", content_type: "text", sort_order: 130 },
  { content_key: "services.hotel_description", label: "Pet hotel description", section: "Services", value: "Air-conditioned rooms for dogs and cats, staffed around the clock. Check in and collect whenever your day allows.", content_type: "textarea", sort_order: 140 },
  { content_key: "services.puppies_title", label: "Puppies title", section: "Services", value: "Shiba Inu Puppies", content_type: "text", sort_order: 150 },
  { content_key: "services.puppies_description", label: "Puppies description", section: "Services", value: "We breed one breed and know it well. Small planned litters, raised in the house, health checked before they go home.", content_type: "textarea", sort_order: 160 },
  { content_key: "services.grooming_title", label: "Grooming title", section: "Services", value: "Grooming Salon", content_type: "text", sort_order: 170 },
  { content_key: "services.grooming_description", label: "Grooming description", section: "Services", value: "Bath, brush, blow dry, ear cleaning, nail cut, teeth cleaning and anal sac cleaning, done calmly and one pet at a time.", content_type: "textarea", sort_order: 180 },
  { content_key: "services.shop_title", label: "Shop title", section: "Services", value: "Pet Shop", content_type: "text", sort_order: 190 },
  { content_key: "services.shop_description", label: "Shop description", section: "Services", value: "Food, toys and kit chosen after years of looking at how pet shops run in Japan and Korea. If it is on our shelves, our own dogs use it.", content_type: "textarea", sort_order: 200 },
  { content_key: "hotel.title", label: "Heading", section: "Hotel", value: "Premium care, happy pets", content_type: "text", sort_order: 300 },
  { content_key: "hotel.description", label: "Introduction", section: "Hotel", value: "Every room is air-conditioned, cleaned daily and checked through the night. Prices are per pet, per night.", content_type: "textarea", sort_order: 310 },
  { content_key: "hotel.dog_small_price", label: "Dogs 10kg and below", section: "Hotel", value: "₱900", content_type: "text", sort_order: 320 },
  { content_key: "hotel.dog_large_price", label: "Dogs above 10kg", section: "Hotel", value: "₱1000", content_type: "text", sort_order: 330 },
  { content_key: "hotel.cat_medium_price", label: "Cat medium room", section: "Hotel", value: "₱850", content_type: "text", sort_order: 340 },
  { content_key: "hotel.cat_large_price", label: "Cat large room", section: "Hotel", value: "₱950", content_type: "text", sort_order: 350 },
  { content_key: "hotel.cat_xlarge_price", label: "Cat extra-large room", section: "Hotel", value: "₱1000", content_type: "text", sort_order: 360 },
  { content_key: "grooming.title", label: "Heading", section: "Grooming", value: "Every service, every price, up front", content_type: "text", sort_order: 400 },
  { content_key: "grooming.description", label: "Introduction", section: "Grooming", value: "One pet at a time, never rushed. Prices are per pet and per visit.", content_type: "textarea", sort_order: 410 },
  { content_key: "grooming.bath_price", label: "Bath and blowdry", section: "Grooming", value: "₱300", content_type: "text", sort_order: 420 },
  { content_key: "grooming.ear_price", label: "Ear cleaning", section: "Grooming", value: "₱150", content_type: "text", sort_order: 430 },
  { content_key: "grooming.nail_price", label: "Nail trimming", section: "Grooming", value: "₱100", content_type: "text", sort_order: 440 },
  { content_key: "grooming.haircut_price", label: "Haircut", section: "Grooming", value: "₱500", content_type: "text", sort_order: 450 },
  { content_key: "prepare.title", label: "Heading", section: "Before You Stay", value: "Help us make their stay safe and happy", content_type: "text", sort_order: 500 },
  { content_key: "prepare.description", label: "Introduction", section: "Before You Stay", value: "A little preparation keeps every fur guest comfortable. Here is what to pack and what to tell us.", content_type: "textarea", sort_order: 510 },
  { content_key: "gallery.title", label: "Heading", section: "Gallery", value: "Have a look around the shop", content_type: "text", sort_order: 600 },
  { content_key: "gallery.description", label: "Introduction", section: "Gallery", value: "The shop floor, the grooming room, the hotel and the team who run it.", content_type: "textarea", sort_order: 610 },
  { content_key: "story.title", label: "Heading", section: "Our Story", value: "It began with one Shiba Inu called Kumi", content_type: "text", sort_order: 700 },
  { content_key: "story.paragraph_1", label: "Paragraph 1", section: "Our Story", value: "I always admired Shibas for being loyal, clever and stubbornly independent. When I finally found a breeder rehoming puppies, I fell for one of them on the spot and named her Kumi.", content_type: "textarea", sort_order: 710 },
  { content_key: "story.paragraph_2", label: "Paragraph 2", section: "Our Story", value: "A friend’s success with breeding got me thinking, but I wanted to build something of my own. So I spent a long time researching how pet businesses run in Japan and Korea, and landed on an idea: breed one breed properly, and wrap a complete pet-care business around it.", content_type: "textarea", sort_order: 720 },
  { content_key: "story.paragraph_3", label: "Paragraph 3", section: "Our Story", value: "That is what this is. Not just somewhere to buy a puppy, but puppies, supplies, professional grooming and a 24 hour hotel in one place, so owners never have to worry about who is looking after their pet.", content_type: "textarea", sort_order: 730 },
  { content_key: "team.title", label: "Heading", section: "Team", value: "The people your pet will actually meet", content_type: "text", sort_order: 800 },
  { content_key: "team.description", label: "Introduction", section: "Team", value: "Same faces every visit, in the shop, the grooming room and on the overnight desk.", content_type: "textarea", sort_order: 810 },
  { content_key: "reviews.title", label: "Heading", section: "Reviews", value: "What owners tell us", content_type: "text", sort_order: 900 },
  { content_key: "contact.title", label: "Heading", section: "Contact", value: "Contact us or give us a ring", content_type: "text", sort_order: 1000 },
  { content_key: "contact.description", label: "Introduction", section: "Contact", value: "There is no online booking here. Send us a message with your question and we will reply the same day. In a hurry? Ring us, someone is on the desk 24/7.", content_type: "textarea", sort_order: 1010 },
  { content_key: "contact.phone", label: "Phone number", section: "Contact", value: "0955 422 2664", content_type: "phone", sort_order: 1020 },
  { content_key: "contact.email", label: "Email address", section: "Contact", value: "hello@shibainupetshop.ph", content_type: "email", sort_order: 1030 },
  { content_key: "contact.address", label: "Address", section: "Contact", value: "KM5 Buhangin-Lapanday Rd, Buhangin, Davao City", content_type: "text", sort_order: 1040 },
  { content_key: "footer.description", label: "Business description", section: "Footer", value: "A family run Shiba Inu breeder, 24/7 pet hotel, grooming salon and pet shop in Davao City. Started because of one dog called Kumi.", content_type: "textarea", sort_order: 1100 },
  { content_key: "footer.hours_hotel", label: "Pet hotel hours", section: "Footer", value: "Open 24/7", content_type: "text", sort_order: 1110 },
  { content_key: "footer.hours_shop", label: "Shop and grooming hours", section: "Footer", value: "9am – 7pm daily", content_type: "text", sort_order: 1120 },
];

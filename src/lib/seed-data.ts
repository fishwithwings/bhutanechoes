import type { Tour, Guide, GuideTour, Review, TourTier } from './types';

/**
 * Bundled fallback data so the site renders before Supabase is connected.
 * Mirrors supabase/migrations/0003_seed.sql plus a couple of demo guides.
 * Once PUBLIC_SUPABASE_URL is set and reachable, real DB data is used instead.
 */

export const SEED_TOURS: Tour[] = [
  {
    id: "t1", slug: "tigers-nest-hike", name: "Tiger's Nest (Paro Taktsang) Hike",
    summary: "The iconic clifftop monastery — Bhutan's most sacred and photographed site.",
    description: "A guided day hike to Paro Taktsang, the Tiger's Nest monastery clinging to a cliff 900m above the Paro valley. Your guide handles permits, pacing, and the stories behind every prayer flag and shrine. Includes the climb, monastery visit, and a traditional lunch at the cafeteria viewpoint.",
    duration_days: 1, difficulty: "moderate", region: "Paro",
    min_price_cents: 8000, max_price_cents: 18000, max_group_size: 12,
    image_url: "https://images.unsplash.com/photo-1743402063949-ad3c824c2484?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1761048163587-0c13c4ae450b?w=900&q=80",
      "https://images.unsplash.com/photo-1638245771029-9bdb1e3e7a01?w=900&q=80",
      "https://images.unsplash.com/photo-1667984895361-6de69c521903?w=900&q=80",
    ],
    highlights: ["Sacred clifftop monastery", "Panoramic Paro valley views", "Permits & logistics handled", "Traditional Bhutanese lunch"],
    itinerary: [
      { day: 1, title: "Paro Trailhead to Tiger's Nest and Back", description: "Begin at the trailhead in the Paro valley and ascend through fragrant pine forest. Rest at the cafeteria viewpoint (halfway) for tea and sweeping views of the monastery. Continue the final steep climb to Paro Taktsang, explore the four sacred temples carved into the cliff face, then descend for a traditional Bhutanese lunch before returning to Paro." }
    ],
    map_points: [
      { lat: 27.4287, lng: 89.4171, label: "Paro Town" },
      { lat: 27.4810, lng: 89.3700, label: "Tiger's Nest Trailhead" },
      { lat: 27.4930, lng: 89.3635, label: "Paro Taktsang (Tiger's Nest)" }
    ],
    is_active: true, sort_order: 1
  },
  {
    id: "t2", slug: "druk-path-trek", name: "Druk Path Trek",
    summary: "A classic high-altitude trek between Paro and Thimphu through alpine lakes.",
    description: "Five days across the ridges separating the Paro and Thimphu valleys, past crystal alpine lakes, ancient lhakhangs, and rhododendron forests. Camping trek with full guide and support. Best in spring and autumn.",
    duration_days: 5, difficulty: "challenging", region: "Paro - Thimphu",
    min_price_cents: 45000, max_price_cents: 95000, max_group_size: 10,
    image_url: "https://images.unsplash.com/photo-1638245771029-9bdb1e3e7a01?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584095434749-d1b975e1ca9c?w=900&q=80",
      "https://images.unsplash.com/photo-1761048163587-0c13c4ae450b?w=900&q=80",
      "https://images.unsplash.com/photo-1743402063949-ad3c824c2484?w=900&q=80",
    ],
    highlights: ["Remote alpine lakes", "Camping under the stars", "Rhododendron forests in bloom", "Ends in the capital, Thimphu"],
    itinerary: [
      { day: 1, title: "Paro — Acclimatization & Rinpung Dzong", description: "Arrive in Paro, meet your guide, and visit Rinpung Dzong fortress-monastery on the riverbank. Stroll through Paro town and prepare gear for the trek." },
      { day: 2, title: "Trek to Jele Dzong (3,480m)", description: "Depart from the trailhead near Paro and climb steeply through mixed forest to the ruins of Jele Dzong. Camp with first views toward the high ridgeline ahead." },
      { day: 3, title: "Trek to Jangchhu Lakha via Tshonapang Lake", description: "Cross a series of high ridges and pass the glacial Tshonapang Lake. Spot blue sheep grazing the slopes and look for the Himalayan monal pheasant. Camp near the sacred Jangchhu Lakha." },
      { day: 4, title: "Trek to Phajoding via Simkotra Tsho", description: "Traverse more alpine terrain past the turquoise Simkotra Tsho lake. Descend gradually to Phajoding monastery complex perched above Thimphu, with sweeping valley views." },
      { day: 5, title: "Descend to Thimphu", description: "A final morning descent through juniper and rhododendron forest brings you into the capital. Visit Changangkha Lhakhang, shower, celebrate with a warm meal in Thimphu." }
    ],
    map_points: [
      { lat: 27.4287, lng: 89.4171, label: "Paro (Start)" },
      { lat: 27.4700, lng: 89.3900, label: "Jele Dzong (3,480m)" },
      { lat: 27.5100, lng: 89.5200, label: "Tshonapang Lake" },
      { lat: 27.5300, lng: 89.6000, label: "Phajoding Monastery" },
      { lat: 27.4728, lng: 89.6393, label: "Thimphu (End)" }
    ],
    is_active: true, sort_order: 2
  },
  {
    id: "t3", slug: "punakha-day-tour", name: "Punakha Day Tour",
    summary: "The majestic Punakha Dzong at the confluence of two rivers.",
    description: "A full-day tour to Punakha, Bhutan's former capital. Visit the spectacular Punakha Dzong, walk the suspension bridge, and stroll to the Chimi Lhakhang fertility temple through terraced rice fields.",
    duration_days: 1, difficulty: "easy", region: "Punakha",
    min_price_cents: 7000, max_price_cents: 15000, max_group_size: 12,
    image_url: "https://images.unsplash.com/photo-1608236475016-1dcc7a260326?w=1200&q=80", gallery: [],
    highlights: ["Stunning Punakha Dzong", "Longest suspension bridge in Bhutan", "Chimi Lhakhang temple walk", "Rice-paddy countryside"],
    itinerary: [
      { day: 1, title: "Thimphu to Punakha via Dochula Pass — Dzong, Bridge & Temple", description: "Morning drive from Thimphu over Dochula Pass (3,116m) where 108 white chortens dot the ridgeline. Descend to Punakha for a guided tour of Punakha Dzong, built at the confluence of the Pho Chhu and Mo Chhu rivers. Walk the swaying suspension bridge. Afternoon stroll through mustard fields to Chimi Lhakhang, the fertility temple. Return to Thimphu by evening." }
    ],
    map_points: [
      { lat: 27.4728, lng: 89.6393, label: "Thimphu" },
      { lat: 27.5017, lng: 89.5440, label: "Dochula Pass (3,116m)" },
      { lat: 27.6124, lng: 89.8677, label: "Punakha Dzong" },
      { lat: 27.6300, lng: 89.8500, label: "Chimi Lhakhang" }
    ],
    is_active: true, sort_order: 3
  },
  {
    id: "t4", slug: "thimphu-cultural-tour", name: "Thimphu Cultural Tour",
    summary: "The world's only capital without traffic lights — temples, crafts and the giant Buddha.",
    description: "A day exploring Thimphu: the giant Buddha Dordenma, the Memorial Chorten, the weekend market, traditional arts school, and the takin preserve. A relaxed cultural immersion with a local guide.",
    duration_days: 1, difficulty: "easy", region: "Thimphu",
    min_price_cents: 6000, max_price_cents: 13000, max_group_size: 12,
    image_url: "https://images.unsplash.com/photo-1640248174356-81b49c507e54?w=1200&q=80", gallery: [],
    highlights: ["Giant Buddha Dordenma", "Bustling weekend market", "Traditional arts & crafts school", "National animal: the takin"],
    itinerary: [
      { day: 1, title: "Thimphu — Capital City Cultural Circuit", description: "Start at the colossal Buddha Dordenma (51m tall, gilded bronze) overlooking the valley. Visit the National Memorial Chorten with its spinning prayer wheels. Explore Trashi Chhoe Dzong, the seat of government. Tour the Zorig Chusum School of Traditional Arts to see thangka painting and wood carving in progress. Browse the weekend handicraft market. Finish at the takin preserve to see Bhutan's national animal." }
    ],
    map_points: [
      { lat: 27.4479, lng: 89.6501, label: "Buddha Dordenma" },
      { lat: 27.4648, lng: 89.6420, label: "National Memorial Chorten" },
      { lat: 27.4893, lng: 89.6384, label: "Trashi Chhoe Dzong" },
      { lat: 27.4990, lng: 89.6250, label: "Takin Preserve" }
    ],
    is_active: true, sort_order: 4
  },
  {
    id: "t5", slug: "jumolhari-trek", name: "Jumolhari Trek",
    summary: "A 13-day Himalayan expedition to the base of sacred Mount Jumolhari (7,326m).",
    description: "Bhutan's flagship high-altitude trek. Thirteen days deep into the Himalaya to base camp beneath the holy peak of Jumolhari, crossing high passes, yak herder camps, and remote villages. For experienced trekkers; full support crew and guide.",
    duration_days: 13, difficulty: "strenuous", region: "Paro - Thimphu (high Himalaya)",
    min_price_cents: 180000, max_price_cents: 350000, max_group_size: 8,
    image_url: "https://images.unsplash.com/photo-1584095434749-d1b975e1ca9c?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1638245771029-9bdb1e3e7a01?w=900&q=80",
      "https://images.unsplash.com/photo-1762062867669-0d58b892cb04?w=900&q=80",
      "https://images.unsplash.com/photo-1761048163587-0c13c4ae450b?w=900&q=80",
      "https://images.unsplash.com/photo-1743402063949-ad3c824c2484?w=900&q=80",
    ],
    highlights: ["Base of sacred Jumolhari (7,326m)", "High Himalayan passes", "Remote yak-herder villages", "Full expedition support crew"],
    itinerary: [
      { day: 1, title: "Arrive Paro — Acclimatization", description: "Arrive in Paro, meet your trekking crew. Easy walk along the Paro Chhu river. Gear check and briefing." },
      { day: 2, title: "Drive to Drukgyel Dzong, Trek to Shana (2,870m)", description: "Drive to the ruined Drukgyel Dzong at the valley's head. Begin trekking alongside the Paro Chhu river to Shana camp, with first glimpses of remote Bhutan." },
      { day: 3, title: "Trek to Thangthanka (3,610m)", description: "Follow the river deeper into the Himalayan foothills, passing yak herder huts and stone walls covered in prayer carvings. Camp at Thangthanka." },
      { day: 4, title: "Trek to Jangothang Base Camp (4,080m)", description: "The dramatic approach to Jangothang with Jumolhari's sacred pyramid filling the horizon. Settle into base camp and soak in the mountain silence." },
      { day: 5, title: "Rest Day at Jangothang", description: "Acclimatize with a short hike to the lake above camp or explore nearby yak herder villages. Optional sunrise Jumolhari photography session." },
      { day: 6, title: "Cross Nyile La Pass (4,870m) to Lingshi", description: "An early start for the high crossing of Nyile La. Prayer flags at the pass mark a hard-won summit. Descend to the remote valley of Lingshi." },
      { day: 7, title: "Rest & Explore Lingshi Dzong", description: "Visit the remote Lingshi Dzong fortress, one of Bhutan's most isolated. Walk among the herder settlements and rest tired legs." },
      { day: 8, title: "Cross Chhe La (4,890m) to Shodu", description: "Another high pass crossing with wind-carved ridgelines and panoramic views into Tibet's Chumbi Valley on clear days." },
      { day: 9, title: "Trek to Robluthang through Rhododendron Forests", description: "Descend into ancient rhododendron forests blazing with color in spring. Camp by a clear glacial stream at Robluthang." },
      { day: 10, title: "Cross Thombu La (4,380m) to Tsheri Jathang", description: "Third major pass of the trek. Tsheri Jathang is a favourite grazing ground for blue sheep and sometimes wolves and snow leopards." },
      { day: 11, title: "Trek to Gunitsawa — Final Day in Wilderness", description: "The last long day on trail, descending from high country to Gunitsawa where the road begins. Bittersweet end of the wilderness experience." },
      { day: 12, title: "Drive to Paro — Celebration Dinner", description: "Transfer to Paro. Hot showers, laundry, and a celebratory dinner with your guide and crew." },
      { day: 13, title: "Depart Paro", description: "Transfer to Paro airport for your onward flight. The mountains will call you back." }
    ],
    map_points: [
      { lat: 27.4287, lng: 89.4171, label: "Paro" },
      { lat: 27.4860, lng: 89.3320, label: "Drukgyel Dzong" },
      { lat: 27.6200, lng: 89.3500, label: "Thangthanka (3,610m)" },
      { lat: 27.8200, lng: 89.2700, label: "Jangothang Base Camp (4,080m)" },
      { lat: 27.8500, lng: 89.4500, label: "Lingshi Dzong" },
      { lat: 27.6000, lng: 89.5300, label: "Gunitsawa" }
    ],
    is_active: true, sort_order: 5
  },
  {
    id: "t6", slug: "bumthang-cultural-tour", name: "Bumthang Cultural Tour",
    summary: "The spiritual heartland — ancient temples and sacred valleys over two days.",
    description: "Two days in Bumthang, the religious heart of Bhutan. Visit Jakar Dzong, Jambay Lhakhang, Kurjey Lhakhang, and the Burning Lake. Time for local cheese, honey, and apple brandy tastings.",
    duration_days: 2, difficulty: "easy", region: "Bumthang",
    min_price_cents: 18000, max_price_cents: 38000, max_group_size: 12,
    image_url: "https://images.unsplash.com/photo-1662546803799-9a1d5532514f?w=1200&q=80", gallery: [],
    highlights: ["Ancient Jambay & Kurjey temples", "The sacred Burning Lake", "Local cheese, honey & brandy", "Bhutan's spiritual heartland"],
    itinerary: [
      { day: 1, title: "Arrive Bumthang — Jakar Dzong & Jambay Lhakhang", description: "Fly or drive to Bumthang's Jakar town (2,600m). Visit Jakar Dzong (White Bird Castle) overlooking the valley. Afternoon at Jambay Lhakhang, one of Bhutan's oldest temples, said to have been built in 659 AD to pin down a demoness. Traditional farmhouse dinner." },
      { day: 2, title: "Kurjey Lhakhang, Membartsho & Local Tastings", description: "Morning at Kurjey Lhakhang, the complex of three temples where Guru Rinpoche left a body imprint in the rock. Walk to Membartsho, the Burning Lake where sacred texts were hidden centuries ago. Afternoon visit a local dairy for Bhutan's famous yak cheese, a honey farm, and the Swiss-founded distillery for apple brandy tasting." }
    ],
    map_points: [
      { lat: 27.5406, lng: 90.7303, label: "Jakar Dzong" },
      { lat: 27.5550, lng: 90.7210, label: "Jambay Lhakhang" },
      { lat: 27.5640, lng: 90.7070, label: "Kurjey Lhakhang" },
      { lat: 27.5470, lng: 90.6840, label: "Membartsho (Burning Lake)" }
    ],
    is_active: true, sort_order: 6
  },
  {
    id: "t7", slug: "phobjikha-valley-tour", name: "Phobjikha Valley & Black-Necked Crane Tour",
    summary: "The glacier-carved valley where endangered black-necked cranes winter.",
    description: "Two days in Phobjikha, one of Bhutan's most pristine glacial valleys and a RAMSAR-listed wetland. Walk the Gangtey Nature Trail past traditional farmhouses, visit the 17th-century Gangtey Gonpa monastery, and look for the rare black-necked cranes that migrate here from the Tibetan plateau (October-February). An unhurried retreat into rural Bhutan.",
    duration_days: 2, difficulty: "easy", region: "Phobjikha Valley",
    min_price_cents: 16000, max_price_cents: 30000, max_group_size: 10,
    image_url: "https://images.unsplash.com/photo-1761048163587-0c13c4ae450b?w=1200&q=80", gallery: [],
    highlights: ["Gangtey Gonpa monastery", "Black-necked crane habitat (RAMSAR wetland)", "Gangtey Nature Trail", "Pristine glacial valley"],
    itinerary: [
      { day: 1, title: "Arrive Phobjikha — Gangtey Gonpa & Evening Crane Walk", description: "Drive from Thimphu or Punakha into the broad, open Phobjikha Valley. Visit Gangtey Gonpa, the only Nyingmapa monastery in western Bhutan, with its sweeping valley views. Evening walk to the wetland viewing area — in season (Oct-Feb), hundreds of black-necked cranes roost at dusk." },
      { day: 2, title: "Gangtey Nature Trail & Crane Information Centre", description: "Morning 5km walk along the Gangtey Nature Trail through dwarf bamboo, traditional farmhouses, and forest. Visit the Royal Society for Protection of Nature's Black-Necked Crane Information Centre to learn about the cranes' migration from the Tibetan plateau. Afternoon departure." }
    ],
    map_points: [
      { lat: 27.4578, lng: 90.1812, label: "Gangtey Gonpa" },
      { lat: 27.4650, lng: 90.1750, label: "Crane Information Centre" },
      { lat: 27.4620, lng: 90.1950, label: "Wetland Viewing Area" }
    ],
    is_active: true, sort_order: 7
  },
  {
    id: "t8", slug: "haa-valley-tour", name: "Haa Valley - Hidden Bhutan",
    summary: "Bhutan's most secluded valley: twin ancient temples, Chele La Pass, and zero crowds.",
    description: "Three days exploring the Haa Valley, one of Bhutan's least-visited and most atmospheric valleys. Cross the Chele La Pass (3,988m), the highest motorable pass in Bhutan, for Himalayan panoramas. Visit Lhakhang Karp (White Temple) and Lhakhang Narp (Black Temple), sacred twin monasteries.",
    duration_days: 3, difficulty: "moderate", region: "Haa Valley",
    min_price_cents: 24000, max_price_cents: 48000, max_group_size: 10,
    image_url: "https://images.unsplash.com/photo-1742539327294-a050227d15b7?w=1200&q=80", gallery: [],
    highlights: ["Chele La Pass (3,988m)", "Twin temples: Lhakhang Karp & Lhakhang Narp", "Authentic village walks", "Himalayan panoramas"],
    itinerary: [
      { day: 1, title: "Paro to Haa via Chele La Pass (3,988m)", description: "Drive from Paro up to Chele La, the highest motorable pass in Bhutan, draped in thousands of prayer flags. On clear days you can see Jumolhari and Jichu Drake. Descend into the secretive Haa Valley — open to tourists only since 2002." },
      { day: 2, title: "Twin Temples & Village Walks", description: "Morning visit to Lhakhang Karp (White Temple) and Lhakhang Narp (Black Temple), twin 7th-century monasteries said to have been built in a single night. Afternoon walk through Haa village, past traditional stone houses and buckwheat fields, with a home-cooked lunch in a local household." },
      { day: 3, title: "Haa Valley Morning & Return to Paro", description: "Easy morning walk along the Haa Chhu river. Visit Haa Dzong before the return drive to Paro over the Chele La, stopping for a final look at the peaks." }
    ],
    map_points: [
      { lat: 27.4287, lng: 89.4171, label: "Paro" },
      { lat: 27.3500, lng: 89.2100, label: "Chele La Pass (3,988m)" },
      { lat: 27.3916, lng: 89.2780, label: "Haa Town" },
      { lat: 27.3980, lng: 89.2800, label: "Lhakhang Karp (White Temple)" }
    ],
    is_active: true, sort_order: 8
  },
  {
    id: "t9", slug: "western-bhutan-grand-tour", name: "Western Bhutan Grand Tour - 7 Days",
    summary: "The complete western circuit: Paro, Thimphu, Punakha, Phobjikha and Tiger's Nest.",
    description: "Seven days covering the western highlights at a comfortable pace. Tiger's Nest hike, Punakha Dzong, the giant Buddha Dordenma, Dochula Pass with its 108 chortens, and the Phobjikha Valley. The most comprehensive introduction to Bhutan.",
    duration_days: 7, difficulty: "moderate", region: "Paro & Thimphu & Punakha",
    min_price_cents: 90000, max_price_cents: 180000, max_group_size: 12,
    image_url: "https://images.unsplash.com/photo-1743402063949-ad3c824c2484?w=1200&q=80", gallery: [],
    highlights: ["Tiger's Nest hike (Paro Taktsang)", "Punakha Dzong at the confluence of two rivers", "Dochula Pass - 108 memorial chortens", "Phobjikha Valley nature walk"],
    itinerary: [
      { day: 1, title: "Arrive Paro — Rinpung Dzong & Town Walk", description: "Arrive at Paro International Airport, the world's most scenic commercial airstrip. Visit Rinpung Dzong and stroll the market street. Settle in and acclimatize." },
      { day: 2, title: "Tiger's Nest Hike", description: "The iconic all-day hike to Paro Taktsang. Ascend through pine forest to the cafeteria viewpoint, then the final climb to the clifftop monastery complex. Traditional lunch on the mountain." },
      { day: 3, title: "Paro to Thimphu — Buddha, Arts & Market", description: "Drive to Thimphu. Buddha Dordenma, Zorig Chusum arts school, Memorial Chorten, and the lively weekend market (Saturdays and Sundays). Dinner in the capital." },
      { day: 4, title: "Thimphu to Punakha via Dochula Pass", description: "Cross Dochula Pass and its 108 white chortens with Himalayan peak views. Visit the majestic Punakha Dzong at the confluence of two rivers and walk the famous suspension bridge." },
      { day: 5, title: "Punakha — Chimi Lhakhang & Drive to Phobjikha", description: "Morning stroll to Chimi Lhakhang through mustard fields. Drive through mountain passes to the open Phobjikha Valley. Evening at Gangtey Gonpa monastery." },
      { day: 6, title: "Phobjikha — Nature Trail & Crane Spotting", description: "Full day in the valley: Gangtey Nature Trail, Black-Necked Crane Information Centre, and the pristine wetland. Unhurried rural Bhutan at its best." },
      { day: 7, title: "Return to Paro — Farewell Dinner", description: "Scenic drive back to Paro. Optional visit to the National Museum above Rinpung Dzong. Farewell dinner with your guide." }
    ],
    map_points: [
      { lat: 27.4287, lng: 89.4171, label: "Paro" },
      { lat: 27.4930, lng: 89.3635, label: "Tiger's Nest" },
      { lat: 27.4728, lng: 89.6393, label: "Thimphu" },
      { lat: 27.5017, lng: 89.5440, label: "Dochula Pass (3,116m)" },
      { lat: 27.6124, lng: 89.8677, label: "Punakha Dzong" },
      { lat: 27.4578, lng: 90.1812, label: "Phobjikha Valley" }
    ],
    is_active: true, sort_order: 9
  },
  {
    id: "t10", slug: "dochula-wangdue-day-tour", name: "Dochula Pass & Wangdue Day Tour",
    summary: "108 memorial chortens at 3,100m, mountain views, and the ancient Wangdue Dzong.",
    description: "A single-day arc from Thimphu over Dochula Pass (3,116m) - 108 Druk Wangyal chortens set against Himalayan peaks on a clear day. Descend to Wangdue Phodrang Dzong, one of Bhutan's most dramatically sited fortresses.",
    duration_days: 1, difficulty: "easy", region: "Thimphu - Dochula - Wangdue",
    min_price_cents: 7000, max_price_cents: 14000, max_group_size: 12,
    image_url: "https://images.unsplash.com/photo-1772702812440-b3b1c2c3abe3?w=1200&q=80", gallery: [],
    highlights: ["108 Druk Wangyal chortens at 3,116m", "Clear-day views of Himalayan peaks", "Wangdue Phodrang Dzong", "Rhododendron forests in spring"],
    itinerary: [
      { day: 1, title: "Thimphu — Dochula Pass — Wangdue Phodrang — Thimphu", description: "Depart Thimphu in the morning and climb to Dochula Pass (3,116m). Walk among the 108 Druk Wangyal chortens commissioned by the Queen Mother — on clear mornings the entire high Himalayan chain is visible. Descend to Wangdue Phodrang Dzong, an imposing fortress rebuilt after a 2012 fire, dramatically positioned above the confluence of the Punakha and Daga rivers. Lunch in Wangdue town. Return to Thimphu by evening." }
    ],
    map_points: [
      { lat: 27.4728, lng: 89.6393, label: "Thimphu" },
      { lat: 27.5017, lng: 89.5440, label: "Dochula Pass (3,116m)" },
      { lat: 27.4875, lng: 89.9010, label: "Wangdue Phodrang Dzong" }
    ],
    is_active: true, sort_order: 10
  },
  {
    id: "t11", slug: "bhutan-festival-tour", name: "Bhutan Tshechu Festival Tour - 4 Days",
    summary: "Masked dances, sacred thangkas, and the living culture of Bhutan's Tshechu festivals.",
    description: "Four days timed around a major Tshechu, the most vivid window into Bhutanese spiritual life. Watch monks in elaborate costumes perform cham (masked dances) in dzong courtyards, witness the unfurling of a giant thongdrel (sacred thangka), and visit surrounding highlights.",
    duration_days: 4, difficulty: "easy", region: "Paro / Thimphu / Punakha (festival-dependent)",
    min_price_cents: 44000, max_price_cents: 90000, max_group_size: 12,
    image_url: "https://images.unsplash.com/photo-1667984895361-6de69c521903?w=1200&q=80", gallery: [],
    highlights: ["Live Tshechu cham (masked dance) performances", "Thongdrel (giant sacred thangka) unfurling ceremony", "Dzong courtyard experience", "Guide confirms festival dates and secures your spot"],
    itinerary: [
      { day: 1, title: "Arrive & Festival Orientation", description: "Arrive at the festival location (Paro, Thimphu, or Punakha — depending on date). Your guide briefs you on the festival's religious significance, the different masked dances, and the schedule. Visit the local market and explore the dzong exterior." },
      { day: 2, title: "Main Festival Day — Cham Dances & Thongdrel", description: "At dawn witness the unfurling of the giant thongdrel (sacred appliqued thangka) on the dzong wall — merely seeing it is said to bring liberation. Full day in the courtyard watching the cham masked dances performed by monks. Your guide explains each deity and the stories they enact." },
      { day: 3, title: "Second Festival Day & Surrounding Monasteries", description: "More cham performances and the chance to see the Atsara (sacred clown) interact with the crowd. Afternoon visit to nearby monasteries for a quieter, contemplative complement to the festival's energy." },
      { day: 4, title: "Morning Photography & Departure", description: "Early morning light is ideal for photographing the costumes and dzong. Debrief with your guide over breakfast. Transfer to Paro for departure." }
    ],
    map_points: [
      { lat: 27.4287, lng: 89.4171, label: "Paro (Paro Tshechu)" },
      { lat: 27.4728, lng: 89.6393, label: "Thimphu (Thimphu Tshechu)" },
      { lat: 27.6124, lng: 89.8677, label: "Punakha (Punakha Tshechu)" }
    ],
    is_active: true, sort_order: 11
  },
];

export const SEED_GUIDES: Guide[] = [
  { id: "g1", user_id: "u1", slug: "sonam-wangchuk", name: "Sonam Wangchuk",
    email: "sonam@example.com", phone: null,
    bio: "Born and raised in the Paro valley, I have guided trekkers and pilgrims for over a decade. I love sharing the quiet stories of our monasteries and the rhythm of mountain life.",
    photo_url: "/images/guide-placeholder.svg",
    languages: ["English", "Dzongkha", "Hindi"], certifications: ["Licensed Cultural Guide", "Wilderness First Aid"],
    license_number: "BT-CG-1042", years_experience: 12, status: "approved",
    rejection_reason: null, stripe_account_id: null, stripe_onboarding_done: true },
  { id: "g2", user_id: "u2", slug: "tashi-dema", name: "Tashi Dema",
    email: "tashi@example.com", phone: null,
    bio: "One of Bhutan's few female trekking guides. I specialise in high-altitude treks and bird watching, and I run a small homestay in Bumthang.",
    photo_url: "/images/guide-placeholder.svg",
    languages: ["English", "Dzongkha"], certifications: ["Licensed Trekking Guide"],
    license_number: "BT-TG-2208", years_experience: 8, status: "approved",
    rejection_reason: null, stripe_account_id: null, stripe_onboarding_done: true },
  { id: "g3", user_id: "u3", slug: "karma-tenzin", name: "Karma Tenzin",
    email: "karma@example.com", phone: null,
    bio: "History graduate turned guide. I bring the dzongs and temples to life with the legends behind them. Patient pace, great for families.",
    photo_url: "/images/guide-placeholder.svg",
    languages: ["English", "Dzongkha", "Japanese"], certifications: ["Licensed Cultural Guide"],
    license_number: "BT-CG-1777", years_experience: 6, status: "approved",
    rejection_reason: null, stripe_account_id: null, stripe_onboarding_done: true },
];

export const SEED_GUIDE_TOURS: GuideTour[] = [
  { id: "gt1", guide_id: "g1", tour_id: "t1", price_cents: 12000, is_active: true },
  { id: "gt2", guide_id: "g1", tour_id: "t2", price_cents: 68000, is_active: true },
  { id: "gt3", guide_id: "g1", tour_id: "t5", price_cents: 240000, is_active: true },
  { id: "gt4", guide_id: "g2", tour_id: "t2", price_cents: 72000, is_active: true },
  { id: "gt5", guide_id: "g2", tour_id: "t5", price_cents: 260000, is_active: true },
  { id: "gt6", guide_id: "g2", tour_id: "t6", price_cents: 28000, is_active: true },
  { id: "gt7", guide_id: "g3", tour_id: "t1", price_cents: 9500,  is_active: true },
  { id: "gt8", guide_id: "g3", tour_id: "t3", price_cents: 11000, is_active: true },
  { id: "gt9", guide_id: "g3", tour_id: "t4", price_cents: 9000,  is_active: true },
];

const HOTEL_BASIC  = ["Budget hotel (2-3 star)", "All meals", "SDF ($100/night)", "Licensed guide", "Shared vehicle", "Entry permits"];
const HOTEL_CLASS  = ["Mid-range hotel (4 star)", "All meals", "SDF ($100/night)", "Licensed guide", "Private vehicle", "Entry permits"];
const HOTEL_LUX    = ["Boutique lodge (Uma/Amankora-style)", "Fine dining", "SDF ($100/night)", "Senior guide", "Luxury vehicle", "All permits", "Spa access"];
const CAMP_BASIC   = ["Tented camp", "All meals (trek kitchen)", "SDF ($100/night)", "Licensed trekking guide", "Pack horses", "Permits & park fees"];
const CAMP_CLASS   = ["Enhanced camp (foam mattress, solar light)", "All meals + snacks", "SDF ($100/night)", "Senior guide + cook", "Support crew", "Emergency kit", "Permits"];
const CAMP_LUX     = ["Luxury glamping (real beds, heated tents)", "Gourmet meals + wine", "SDF ($100/night)", "Expert guide + cook + medic", "Full crew", "Satellite comms", "All permits"];

const TIER_BASIC   = (includes: string[]) => ({ key: "basic"   as const, label: "Essential", tagline: "Comfortable & straightforward", includes, sort_order: 1 });
const TIER_CLASSIC = (includes: string[]) => ({ key: "classic" as const, label: "Classic",   tagline: "The best-value Bhutan experience", includes, sort_order: 2 });
const TIER_LUXURY  = (includes: string[]) => ({ key: "luxury"  as const, label: "Luxury",    tagline: "Five-star Bhutan, no compromises", includes, sort_order: 3 });

export const SEED_TIERS: (TourTier & { tour_id_ref: string })[] = [
  // Tiger's Nest
  { id: "tt1a", tour_id: "t1", tour_id_ref: "t1", ...TIER_BASIC(HOTEL_BASIC),  price_cents: 18000 },
  { id: "tt1b", tour_id: "t1", tour_id_ref: "t1", ...TIER_CLASSIC(HOTEL_CLASS), price_cents: 32000 },
  { id: "tt1c", tour_id: "t1", tour_id_ref: "t1", ...TIER_LUXURY([...HOTEL_LUX, "Picnic lunch at the viewpoint"]), price_cents: 65000 },
  // Druk Path Trek
  { id: "tt2a", tour_id: "t2", tour_id_ref: "t2", ...TIER_BASIC(CAMP_BASIC),   price_cents: 125000 },
  { id: "tt2b", tour_id: "t2", tour_id_ref: "t2", ...TIER_CLASSIC(CAMP_CLASS), price_cents: 200000 },
  { id: "tt2c", tour_id: "t2", tour_id_ref: "t2", ...TIER_LUXURY(CAMP_LUX),   price_cents: 450000 },
  // Punakha Day Tour
  { id: "tt3a", tour_id: "t3", tour_id_ref: "t3", ...TIER_BASIC(HOTEL_BASIC),  price_cents: 17000 },
  { id: "tt3b", tour_id: "t3", tour_id_ref: "t3", ...TIER_CLASSIC(HOTEL_CLASS), price_cents: 30000 },
  { id: "tt3c", tour_id: "t3", tour_id_ref: "t3", ...TIER_LUXURY([...HOTEL_LUX, "Riverside lunch"]), price_cents: 60000 },
  // Thimphu Cultural Tour
  { id: "tt4a", tour_id: "t4", tour_id_ref: "t4", ...TIER_BASIC(HOTEL_BASIC),  price_cents: 16000 },
  { id: "tt4b", tour_id: "t4", tour_id_ref: "t4", ...TIER_CLASSIC([...HOTEL_CLASS, "Traditional craft workshop"]), price_cents: 28000 },
  { id: "tt4c", tour_id: "t4", tour_id_ref: "t4", ...TIER_LUXURY([...HOTEL_LUX, "Private archery lesson"]), price_cents: 55000 },
  // Jumolhari Trek
  { id: "tt5a", tour_id: "t5", tour_id_ref: "t5", ...TIER_BASIC(CAMP_BASIC),   price_cents: 325000 },
  { id: "tt5b", tour_id: "t5", tour_id_ref: "t5", ...TIER_CLASSIC([...CAMP_CLASS, "Satellite phone"]), price_cents: 490000 },
  { id: "tt5c", tour_id: "t5", tour_id_ref: "t5", ...TIER_LUXURY([...CAMP_LUX, "Weather briefings"]), price_cents: 910000 },
  // Bumthang Cultural Tour
  { id: "tt6a", tour_id: "t6", tour_id_ref: "t6", ...TIER_BASIC(HOTEL_BASIC),  price_cents: 40000 },
  { id: "tt6b", tour_id: "t6", tour_id_ref: "t6", ...TIER_CLASSIC([...HOTEL_CLASS, "Local honey & cheese tasting"]), price_cents: 72000 },
  { id: "tt6c", tour_id: "t6", tour_id_ref: "t6", ...TIER_LUXURY([...HOTEL_LUX, "Private temple ceremony access"]), price_cents: 150000 },
  // Phobjikha Valley Tour
  { id: "tt7a", tour_id: "t7", tour_id_ref: "t7", ...TIER_BASIC(["Budget guesthouse", "All meals (farmhouse style)", "SDF ($100/night)", "Licensed guide", "Shared vehicle", "Crane sanctuary entry"]), price_cents: 40000 },
  { id: "tt7b", tour_id: "t7", tour_id_ref: "t7", ...TIER_CLASSIC(["Valley lodge (4 star)", "All meals", "SDF ($100/night)", "Licensed guide", "Private vehicle", "Crane sanctuary entry", "Nature trail with binoculars"]), price_cents: 72000 },
  { id: "tt7c", tour_id: "t7", tour_id_ref: "t7", ...TIER_LUXURY(["Boutique eco-lodge with valley views", "Fine dining", "SDF ($100/night)", "Senior naturalist guide", "Luxury vehicle", "Private crane spotting session", "Stargazing evening"]), price_cents: 145000 },
  // Haa Valley Tour
  { id: "tt8a", tour_id: "t8", tour_id_ref: "t8", ...TIER_BASIC(HOTEL_BASIC),  price_cents: 62000 },
  { id: "tt8b", tour_id: "t8", tour_id_ref: "t8", ...TIER_CLASSIC([...HOTEL_CLASS, "Village homestay dinner"]), price_cents: 110000 },
  { id: "tt8c", tour_id: "t8", tour_id_ref: "t8", ...TIER_LUXURY([...HOTEL_LUX, "Private monastery visit after hours"]), price_cents: 220000 },
  // Western Grand Tour
  { id: "tt9a", tour_id: "t9", tour_id_ref: "t9", ...TIER_BASIC([...HOTEL_BASIC, "Airport transfers"]), price_cents: 175000 },
  { id: "tt9b", tour_id: "t9", tour_id_ref: "t9", ...TIER_CLASSIC([...HOTEL_CLASS, "1 cooking class", "Airport transfers"]), price_cents: 308000 },
  { id: "tt9c", tour_id: "t9", tour_id_ref: "t9", ...TIER_LUXURY([...HOTEL_LUX, "Daily spa", "Private events", "Airport transfers"]), price_cents: 630000 },
  // Dochula Day Tour
  { id: "tt10a", tour_id: "t10", tour_id_ref: "t10", ...TIER_BASIC(HOTEL_BASIC),  price_cents: 16000 },
  { id: "tt10b", tour_id: "t10", tour_id_ref: "t10", ...TIER_CLASSIC(HOTEL_CLASS), price_cents: 28000 },
  { id: "tt10c", tour_id: "t10", tour_id_ref: "t10", ...TIER_LUXURY([...HOTEL_LUX, "Champagne at the pass"]), price_cents: 55000 },
  // Festival Tour
  { id: "tt11a", tour_id: "t11", tour_id_ref: "t11", ...TIER_BASIC([...HOTEL_BASIC, "Festival viewing spot"]), price_cents: 88000 },
  { id: "tt11b", tour_id: "t11", tour_id_ref: "t11", ...TIER_CLASSIC([...HOTEL_CLASS, "Reserved courtyard viewing", "Costume photo session"]), price_cents: 155000 },
  { id: "tt11c", tour_id: "t11", tour_id_ref: "t11", ...TIER_LUXURY(["Boutique lodge", "Fine dining", "SDF ($100/night)", "Senior festival guide", "Luxury vehicle", "VIP dzong access", "Private dancer meet", "Traditional dress provided", "Spa"]), price_cents: 310000 },
];

export const SEED_REVIEWS: Review[] = [
  { id: "r1", guide_id: "g1", booking_id: null, author_name: "Emma R.", rating: 5, is_published: true,
    comment: "Sonam made the Tiger's Nest hike unforgettable. Knowledgeable, kind, and never rushed us.", created_at: "2025-10-02T00:00:00Z" },
  { id: "r2", guide_id: "g1", booking_id: null, author_name: "David K.", rating: 5, is_published: true,
    comment: "Best guide we had in all of Asia. Highly recommend.", created_at: "2025-09-15T00:00:00Z" },
  { id: "r3", guide_id: "g2", booking_id: null, author_name: "Marie L.", rating: 5, is_published: true,
    comment: "Tashi is a phenomenal trekking guide. Felt safe the entire Jumolhari route.", created_at: "2025-08-20T00:00:00Z" },
  { id: "r4", guide_id: "g3", booking_id: null, author_name: "Tom B.", rating: 4, is_published: true,
    comment: "Great stories, very patient with our kids.", created_at: "2025-07-11T00:00:00Z" },
];

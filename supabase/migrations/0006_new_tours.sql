-- ============================================================================
-- Five additional tours sourced from market research (June 2026).
-- Price references: TourRadar listings ($790–$2,400 / 5–7 days all-in),
-- bhutanhappiness.com breakdown ($25–$40/day guide fee),
-- SDF = $100/person/night (mandatory, collected by government — NOT included in
-- these prices; guides must inform guests they pay SDF separately).
-- Price bands below reflect the guide-service portion only (guide time, local
-- know-how, permits, logistics). Mid-market rate ~$80–$120/person/day.
-- ============================================================================

insert into tours
  (slug, name, summary, description, duration_days, difficulty, region,
   min_price_cents, max_price_cents, max_group_size, image_url, highlights, sort_order)
values

  -- 1. Phobjikha Valley --------------------------------------------------
  ('phobjikha-valley-tour',
   'Phobjikha Valley & Black-Necked Crane Tour',
   'The glacier-carved valley where endangered black-necked cranes winter.',
   'Two days in Phobjikha, one of Bhutan''s most pristine glacial valleys and a
RAMSAR-listed wetland. Walk the Gangtey Nature Trail past traditional farmhouses,
visit the 17th-century Gangtey Gonpa monastery, and look for the rare black-necked
cranes that migrate here from the Tibetan plateau (October–February). An unhurried
retreat into rural Bhutan.',
   2, 'easy', 'Phobjikha Valley',
   16000, 30000, 10,
   '/images/phobjikha.svg',
   '["Gangtey Gonpa — the largest Nyingma monastery in western Bhutan",
     "Black-necked crane habitat (RAMSAR wetland)",
     "Gangtey Nature Trail through farmhouses and forest",
     "Pristine glacial valley, no cars in the core"]',
   7),

  -- 2. Haa Valley --------------------------------------------------------
  ('haa-valley-tour',
   'Haa Valley — Hidden Bhutan',
   'Bhutan''s most secluded valley: twin ancient temples, Chele La Pass, and zero crowds.',
   'Three days exploring the Haa Valley, one of Bhutan''s least-visited and most
atmospheric valleys. Cross the Chele La Pass (3,988m), the highest motorable pass
in Bhutan, for Himalayan panoramas. Visit Lhakhang Karp (White Temple) and Lhakhang
Narp (Black Temple), sacred twin monasteries set against a dramatic ridgeline. Walk
through ancient villages largely untouched by tourism.',
   3, 'moderate', 'Haa Valley',
   24000, 48000, 10,
   '/images/haa-valley.svg',
   '["Chele La Pass (3,988m) — highest motorable pass in Bhutan",
     "Twin temples: Lhakhang Karp & Lhakhang Narp",
     "Authentic village walks — minimal tourist footprint",
     "Himalayan panoramas to Bhutan''s sacred peaks"]',
   8),

  -- 3. 7-Day Western Grand Tour ------------------------------------------
  ('western-bhutan-grand-tour',
   'Western Bhutan Grand Tour — 7 Days',
   'The complete western circuit: Paro, Thimphu, Punakha, Phobjikha and Tiger''s Nest.',
   'Seven days covering the western highlights that most visitors come to Bhutan to
see — done at a comfortable, non-rushed pace. Tiger''s Nest hike, Punakha Dzong at
the river confluence, the giant Buddha Dordenma, Dochula Pass with its 108 chortens,
and the crane-wintering Phobjikha Valley. The most comprehensive introduction to
Bhutan, matching the popular 5-day TourRadar packages but with two extra days to
breathe and go deeper.',
   7, 'moderate', 'Paro · Thimphu · Punakha · Phobjikha',
   90000, 180000, 12,
   '/images/western-grand.svg',
   '["Tiger''s Nest hike (Paro Taktsang)",
     "Punakha Dzong at the confluence of two rivers",
     "Dochula Pass — 108 memorial chortens",
     "Phobjikha Valley nature walk",
     "Giant Buddha Dordenma, Thimphu"]',
   9),

  -- 4. Dochula & Wangdue Day Tour ----------------------------------------
  ('dochula-wangdue-day-tour',
   'Dochula Pass & Wangdue Day Tour',
   '108 memorial chortens at 3,100m, mountain views, and the ancient Wangdue Dzong.',
   'A single-day arc from Thimphu over the Dochula Pass (3,116m) — 108 Druk Wangyal
chortens built in memory of soldiers, set against Himalayan peaks on a clear day
including Gangkhar Puensum (the world''s highest unclimbed mountain). Descend to
the Wangdue Phodrang Dzong, one of Bhutan''s most dramatically sited fortresses,
before returning to Thimphu. Best visibility October–February.',
   1, 'easy', 'Thimphu – Dochula – Wangdue',
   7000, 14000, 12,
   '/images/dochula.svg',
   '["108 Druk Wangyal chortens at 3,116m",
     "Clear-day views of Himalayan peaks including Gangkhar Puensum",
     "Wangdue Phodrang Dzong",
     "Rhododendron forests — spectacular in spring"]',
   10),

  -- 5. Festival Highlight Tour -------------------------------------------
  ('bhutan-festival-tour',
   'Bhutan Tshechu Festival Tour — 4 Days',
   'Masked dances, sacred thangkas, and the living culture of Bhutan''s Tshechu festivals.',
   'Four days timed around a major Tshechu (festival), the most vivid window into
Bhutanese spiritual life. Watch monks in elaborate costumes perform cham (masked
dances) in dzong courtyards, witness the unfurling of a giant thongdrel (sacred
thangka), and visit the surrounding highlights — Paro, Thimphu or Punakha depending
on the festival. Dates shift each year with the lunar calendar; your guide confirms
the schedule and secures permits.
Major festivals: Paro Tshechu (Mar/Apr), Thimphu Tshechu (Sep/Oct),
Punakha Drubchen & Tshechu (Feb/Mar), Jambay Lhakhang Drup (Oct/Nov).',
   4, 'easy', 'Paro / Thimphu / Punakha (festival-dependent)',
   44000, 90000, 12,
   '/images/festival.svg',
   '["Live Tshechu cham (masked dance) performances",
     "Thongdrel (giant sacred thangka) unfurling ceremony",
     "Dzong courtyard experience — locals in traditional dress",
     "Guide confirms festival dates and secures your spot"]',
   11);

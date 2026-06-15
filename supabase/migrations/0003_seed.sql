-- ============================================================================
-- Seed: the six standard tours. Prices are PER PERSON in US cents.
-- Bands are illustrative starting points; admin can adjust in the panel.
-- ============================================================================
insert into tours
  (slug, name, summary, description, duration_days, difficulty, region,
   min_price_cents, max_price_cents, max_group_size, image_url, highlights, sort_order)
values
  ('tigers-nest-hike',
   'Tiger''s Nest (Paro Taktsang) Hike',
   'The iconic clifftop monastery — Bhutan''s most sacred and photographed site.',
   'A guided day hike to Paro Taktsang, the Tiger''s Nest monastery clinging to a cliff 900m above the Paro valley. Your guide handles permits, pacing, and the stories behind every prayer flag and shrine. Includes the climb, monastery visit, and a traditional lunch at the cafeteria viewpoint.',
   1, 'moderate', 'Paro',
   8000, 18000, 12,
   '/images/tigers-nest.svg',
   '["Sacred clifftop monastery","Panoramic Paro valley views","Permits & logistics handled","Traditional Bhutanese lunch"]',
   1),

  ('druk-path-trek',
   'Druk Path Trek',
   'A classic high-altitude trek between Paro and Thimphu through alpine lakes.',
   'Five days across the ridges separating the Paro and Thimphu valleys, past crystal alpine lakes, ancient lhakhangs, and rhododendron forests. Camping trek with full guide and support. Best in spring and autumn.',
   5, 'challenging', 'Paro – Thimphu',
   45000, 95000, 10,
   '/images/druk-path.svg',
   '["Remote alpine lakes","Camping under the stars","Rhododendron forests in bloom","Ends in the capital, Thimphu"]',
   2),

  ('punakha-day-tour',
   'Punakha Day Tour',
   'The majestic Punakha Dzong at the confluence of two rivers.',
   'A full-day tour to Punakha, Bhutan''s former capital. Visit the spectacular Punakha Dzong, walk the suspension bridge, and stroll to the Chimi Lhakhang fertility temple through terraced rice fields.',
   1, 'easy', 'Punakha',
   7000, 15000, 12,
   '/images/punakha.svg',
   '["Stunning Punakha Dzong","Longest suspension bridge in Bhutan","Chimi Lhakhang temple walk","Rice-paddy countryside"]',
   3),

  ('thimphu-cultural-tour',
   'Thimphu Cultural Tour',
   'The world''s only capital without traffic lights — temples, crafts and the giant Buddha.',
   'A day exploring Thimphu: the giant Buddha Dordenma, the Memorial Chorten, the weekend market, traditional arts school, and the takin preserve. A relaxed cultural immersion with a local guide.',
   1, 'easy', 'Thimphu',
   6000, 13000, 12,
   '/images/thimphu.svg',
   '["Giant Buddha Dordenma","Bustling weekend market","Traditional arts & crafts school","National animal: the takin"]',
   4),

  ('jumolhari-trek',
   'Jumolhari Trek',
   'A 13-day Himalayan expedition to the base of sacred Mount Jumolhari (7,326m).',
   'Bhutan''s flagship high-altitude trek. Thirteen days deep into the Himalaya to base camp beneath the holy peak of Jumolhari, crossing high passes, yak herder camps, and remote villages. For experienced trekkers; full support crew and guide.',
   13, 'strenuous', 'Paro – Thimphu (high Himalaya)',
   180000, 350000, 8,
   '/images/jumolhari.svg',
   '["Base of sacred Jumolhari (7,326m)","High Himalayan passes","Remote yak-herder villages","Full expedition support crew"]',
   5),

  ('bumthang-cultural-tour',
   'Bumthang Cultural Tour',
   'The spiritual heartland — ancient temples and sacred valleys over two days.',
   'Two days in Bumthang, the religious heart of Bhutan. Visit Jakar Dzong, Jambay Lhakhang, Kurjey Lhakhang, and the Burning Lake. Time for local cheese, honey, and apple brandy tastings.',
   2, 'easy', 'Bumthang',
   18000, 38000, 12,
   '/images/bumthang.svg',
   '["Ancient Jambay & Kurjey temples","The sacred Burning Lake","Local cheese, honey & brandy","Bhutan''s spiritual heartland"]',
   6);

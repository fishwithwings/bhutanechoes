-- ============================================================================
-- Tier pricing seed — all 11 tours, 3 tiers each. ALL-INCLUSIVE per person.
-- Market reference: TourRadar $790–$2,400 / 5–7 days; mid-range ~$350–500/day;
-- luxury lodges (Uma, Six Senses, Amankora) ~$800–1,200/day.
-- SDF = $100/person/night (included in every tier).
-- ============================================================================

-- Helper: resolve tour_id by slug
-- We insert using a subquery so this file is idempotent and order-independent.

insert into tour_tiers (tour_id, key, label, tagline, price_cents, includes, sort_order)
values

-- ── Tiger's Nest Hike (1 day) ──────────────────────────────────────────────
((select id from tours where slug='tigers-nest-hike'),
 'basic','Essential','Comfortable & straightforward',18000,
 '["1-night budget hotel (2–3★)","All meals","SDF ($100)","Licensed guide","Shared vehicle","Entry permits"]',1),
((select id from tours where slug='tigers-nest-hike'),
 'classic','Classic','The best-value Bhutan experience',32000,
 '["1-night mid-range hotel (4★)","All meals","SDF ($100)","Licensed guide","Private vehicle","Entry permits","Welcome drink"]',2),
((select id from tours where slug='tigers-nest-hike'),
 'luxury','Luxury','Five-star Bhutan, no compromises',65000,
 '["1-night boutique lodge (Uma/Amankora-style)","Fine dining","SDF ($100)","Senior guide","Luxury vehicle","All permits","Spa access","Picnic lunch at the viewpoint"]',3),

-- ── Druk Path Trek (5 days) ───────────────────────────────────────────────
((select id from tours where slug='druk-path-trek'),
 'basic','Essential','Trek the classic route, well-supported',125000,
 '["4 nights tented camp","All meals (trek kitchen)","SDF ($100 × 5)","Licensed trekking guide","Pack horses","Permits & park fees"]',1),
((select id from tours where slug='druk-path-trek'),
 'classic','Classic','Enhanced comfort on the trail',200000,
 '["4 nights enhanced tented camp (foam mattress, solar light)","All meals + snacks","SDF ($100 × 5)","Licensed guide + assistant","Pack horses","Permits","Emergency equipment"]',2),
((select id from tours where slug='druk-path-trek'),
 'luxury','Luxury','Glamping at altitude',450000,
 '["4 nights luxury glamping (real beds, heated tents)","Gourmet trail meals + wine","SDF ($100 × 5)","Senior guide + cook + crew","All equipment supplied","Satellite comms & first-aid kit"]',3),

-- ── Punakha Day Tour (1 day) ──────────────────────────────────────────────
((select id from tours where slug='punakha-day-tour'),
 'basic','Essential','Comfortable & straightforward',17000,
 '["1-night budget hotel (2–3★)","All meals","SDF ($100)","Licensed guide","Shared vehicle","Entry permits"]',1),
((select id from tours where slug='punakha-day-tour'),
 'classic','Classic','The best-value Bhutan experience',30000,
 '["1-night mid-range hotel (4★)","All meals","SDF ($100)","Licensed guide","Private vehicle","Entry permits"]',2),
((select id from tours where slug='punakha-day-tour'),
 'luxury','Luxury','Five-star Bhutan, no compromises',60000,
 '["1-night boutique riverside lodge","Fine dining","SDF ($100)","Senior guide","Luxury vehicle","All permits","Spa access"]',3),

-- ── Thimphu Cultural (1 day) ──────────────────────────────────────────────
((select id from tours where slug='thimphu-cultural-tour'),
 'basic','Essential','Comfortable & straightforward',16000,
 '["1-night budget hotel (2–3★)","All meals","SDF ($100)","Licensed guide","Shared vehicle","Entry permits"]',1),
((select id from tours where slug='thimphu-cultural-tour'),
 'classic','Classic','The best-value Bhutan experience',28000,
 '["1-night mid-range hotel (4★)","All meals","SDF ($100)","Licensed guide","Private vehicle","Entry permits","Traditional craft workshop"]',2),
((select id from tours where slug='thimphu-cultural-tour'),
 'luxury','Luxury','Five-star Bhutan, no compromises',55000,
 '["1-night boutique city hotel","Fine dining","SDF ($100)","Senior guide","Luxury vehicle","All permits","Private archery lesson","Spa access"]',3),

-- ── Jumolhari Trek (13 days) ──────────────────────────────────────────────
((select id from tours where slug='jumolhari-trek'),
 'basic','Essential','A full expedition, well-run',325000,
 '["12 nights tented camp","All meals (trek kitchen)","SDF ($100 × 13)","Licensed trekking guide","Full support crew & horses","All permits & park fees"]',1),
((select id from tours where slug='jumolhari-trek'),
 'classic','Classic','Enhanced comfort on a demanding trek',490000,
 '["12 nights enhanced camp (foam mattress, solar lanterns)","All meals + daily hot lunch","SDF ($100 × 13)","Senior guide + cook","Support crew","Satellite phone","All permits"]',2),
((select id from tours where slug='jumolhari-trek'),
 'luxury','Luxury','The ultimate Himalayan expedition',910000,
 '["12 nights luxury expedition camp (real beds, heated mess tent)","Gourmet meals + wine","SDF ($100 × 13)","Expert guide + private cook + medic","Full crew","Satellite comms","Weather briefings","All permits"]',3),

-- ── Bumthang Cultural (2 days) ────────────────────────────────────────────
((select id from tours where slug='bumthang-cultural-tour'),
 'basic','Essential','Comfortable & straightforward',40000,
 '["2 nights budget hotel (2–3★)","All meals","SDF ($100 × 2)","Licensed guide","Shared vehicle","Entry permits"]',1),
((select id from tours where slug='bumthang-cultural-tour'),
 'classic','Classic','The best-value Bhutan experience',72000,
 '["2 nights mid-range hotel (4★)","All meals","SDF ($100 × 2)","Licensed guide","Private vehicle","Entry permits","Local honey & cheese tasting"]',2),
((select id from tours where slug='bumthang-cultural-tour'),
 'luxury','Luxury','Five-star Bhutan, no compromises',150000,
 '["2 nights boutique valley lodge","Fine dining","SDF ($100 × 2)","Senior guide","Luxury vehicle","All permits","Private temple ceremony access","Spa access"]',3),

-- ── Phobjikha Valley (2 days) ─────────────────────────────────────────────
((select id from tours where slug='phobjikha-valley-tour'),
 'basic','Essential','Comfortable & straightforward',40000,
 '["2 nights budget guesthouse","All meals (local farmhouse style)","SDF ($100 × 2)","Licensed guide","Shared vehicle","Crane sanctuary entry"]',1),
((select id from tours where slug='phobjikha-valley-tour'),
 'classic','Classic','The best-value Bhutan experience',72000,
 '["2 nights mid-range valley lodge","All meals","SDF ($100 × 2)","Licensed guide","Private vehicle","Crane sanctuary entry","Nature trail with binoculars"]',2),
((select id from tours where slug='phobjikha-valley-tour'),
 'luxury','Luxury','Five-star Bhutan, no compromises',145000,
 '["2 nights boutique eco-lodge with valley views","Fine dining","SDF ($100 × 2)","Senior naturalist guide","Luxury vehicle","Private crane spotting session","Stargazing evening"]',3),

-- ── Haa Valley (3 days) ───────────────────────────────────────────────────
((select id from tours where slug='haa-valley-tour'),
 'basic','Essential','Comfortable & straightforward',62000,
 '["3 nights budget guesthouse","All meals","SDF ($100 × 3)","Licensed guide","Shared vehicle","Entry permits"]',1),
((select id from tours where slug='haa-valley-tour'),
 'classic','Classic','The best-value Bhutan experience',110000,
 '["3 nights mid-range hotel","All meals","SDF ($100 × 3)","Licensed guide","Private vehicle","Entry permits","Village homestay dinner"]',2),
((select id from tours where slug='haa-valley-tour'),
 'luxury','Luxury','Five-star Bhutan, no compromises',220000,
 '["3 nights boutique mountain lodge","Fine dining","SDF ($100 × 3)","Senior guide","Luxury 4WD","All permits","Private monastery visit after hours"]',3),

-- ── Western Grand Tour (7 days) ───────────────────────────────────────────
((select id from tours where slug='western-bhutan-grand-tour'),
 'basic','Essential','Complete Bhutan, well-priced',175000,
 '["7 nights budget hotels (2–3★)","All meals","SDF ($100 × 7)","Licensed guide","Shared vehicle","All entry permits & park fees"]',1),
((select id from tours where slug='western-bhutan-grand-tour'),
 'classic','Classic','The complete Bhutan experience',308000,
 '["7 nights mid-range hotels (4★)","All meals","SDF ($100 × 7)","Licensed guide","Private vehicle","All permits","1 cultural cooking class","Airport transfers"]',2),
((select id from tours where slug='western-bhutan-grand-tour'),
 'luxury','Luxury','Seven-day Bhutan in total luxury',630000,
 '["7 nights boutique lodges (Uma/Amankora-level)","Fine dining + wine","SDF ($100 × 7)","Senior guide","Luxury vehicle","All permits","Daily spa","Private events","Airport transfers"]',3),

-- ── Dochula & Wangdue Day Tour (1 day) ────────────────────────────────────
((select id from tours where slug='dochula-wangdue-day-tour'),
 'basic','Essential','Comfortable & straightforward',16000,
 '["1-night budget hotel (2–3★)","All meals","SDF ($100)","Licensed guide","Shared vehicle","Entry permits"]',1),
((select id from tours where slug='dochula-wangdue-day-tour'),
 'classic','Classic','The best-value Bhutan experience',28000,
 '["1-night mid-range hotel (4★)","All meals","SDF ($100)","Licensed guide","Private vehicle","Entry permits"]',2),
((select id from tours where slug='dochula-wangdue-day-tour'),
 'luxury','Luxury','Five-star Bhutan, no compromises',55000,
 '["1-night boutique mountain lodge","Fine dining","SDF ($100)","Senior guide","Luxury vehicle","All permits","Champagne at the pass"]',3),

-- ── Festival Tour (4 days) ────────────────────────────────────────────────
((select id from tours where slug='bhutan-festival-tour'),
 'basic','Essential','Festival Bhutan, well-organised',88000,
 '["4 nights budget hotel (2–3★)","All meals","SDF ($100 × 4)","Licensed guide","Shared vehicle","Festival viewing spot","Entry permits"]',1),
((select id from tours where slug='bhutan-festival-tour'),
 'classic','Classic','The definitive festival experience',155000,
 '["4 nights mid-range hotel (4★)","All meals","SDF ($100 × 4)","Licensed guide","Private vehicle","Reserved courtyard viewing","Costume photo session","Entry permits"]',2),
((select id from tours where slug='bhutan-festival-tour'),
 'luxury','Luxury','VIP festival Bhutan',310000,
 '["4 nights boutique lodge","Fine dining","SDF ($100 × 4)","Senior guide with festival expertise","Luxury vehicle","VIP dzong access","Private dancer meet","Traditional dress provided","Spa"]',3);

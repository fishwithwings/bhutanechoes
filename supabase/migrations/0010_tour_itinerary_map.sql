-- Add itinerary and map_points to tours table
-- itinerary: [{day, title, description}]
-- map_points: [{lat, lng, label}]
alter table tours
  add column if not exists itinerary  jsonb not null default '[]'::jsonb,
  add column if not exists map_points jsonb not null default '[]'::jsonb;

-- Back-fill Tiger's Nest
update tours set
  image_url   = 'https://images.unsplash.com/photo-1743402063949-ad3c824c2484?w=1200&q=80',
  itinerary   = '[{"day":1,"title":"Paro Trailhead to Tiger''s Nest and Back","description":"Begin at the trailhead in the Paro valley and ascend through fragrant pine forest. Rest at the cafeteria viewpoint (halfway) for tea and sweeping views of the monastery. Continue the final steep climb to Paro Taktsang, explore the four sacred temples carved into the cliff face, then descend for a traditional Bhutanese lunch before returning to Paro."}]'::jsonb,
  map_points  = '[{"lat":27.4287,"lng":89.4171,"label":"Paro Town"},{"lat":27.481,"lng":89.37,"label":"Tiger''s Nest Trailhead"},{"lat":27.493,"lng":89.3635,"label":"Paro Taktsang (Tiger''s Nest)"}]'::jsonb
where slug = 'tigers-nest-hike';

-- Back-fill Druk Path Trek
update tours set
  image_url   = 'https://images.unsplash.com/photo-1638245771029-9bdb1e3e7a01?w=1200&q=80',
  itinerary   = '[{"day":1,"title":"Paro — Acclimatization & Rinpung Dzong","description":"Arrive in Paro, meet your guide, and visit Rinpung Dzong fortress-monastery on the riverbank."},{"day":2,"title":"Trek to Jele Dzong (3,480m)","description":"Depart from the trailhead near Paro and climb steeply through mixed forest to the ruins of Jele Dzong."},{"day":3,"title":"Trek to Jangchhu Lakha via Tshonapang Lake","description":"Cross a series of high ridges and pass the glacial Tshonapang Lake. Spot blue sheep grazing the slopes."},{"day":4,"title":"Trek to Phajoding via Simkotra Tsho","description":"Traverse more alpine terrain past the turquoise Simkotra Tsho lake. Descend gradually to Phajoding monastery above Thimphu."},{"day":5,"title":"Descend to Thimphu","description":"A final morning descent through juniper and rhododendron forest brings you into the capital."}]'::jsonb,
  map_points  = '[{"lat":27.4287,"lng":89.4171,"label":"Paro (Start)"},{"lat":27.47,"lng":89.39,"label":"Jele Dzong (3,480m)"},{"lat":27.51,"lng":89.52,"label":"Tshonapang Lake"},{"lat":27.53,"lng":89.6,"label":"Phajoding Monastery"},{"lat":27.4728,"lng":89.6393,"label":"Thimphu (End)"}]'::jsonb
where slug = 'druk-path-trek';

-- Back-fill Punakha Day Tour
update tours set
  image_url   = 'https://images.unsplash.com/photo-1608236475016-1dcc7a260326?w=1200&q=80',
  itinerary   = '[{"day":1,"title":"Thimphu to Punakha via Dochula Pass — Dzong, Bridge & Temple","description":"Morning drive from Thimphu over Dochula Pass (3,116m) where 108 white chortens dot the ridgeline. Visit Punakha Dzong at the confluence of two rivers, walk the suspension bridge, and stroll to Chimi Lhakhang through mustard fields."}]'::jsonb,
  map_points  = '[{"lat":27.4728,"lng":89.6393,"label":"Thimphu"},{"lat":27.5017,"lng":89.544,"label":"Dochula Pass (3,116m)"},{"lat":27.6124,"lng":89.8677,"label":"Punakha Dzong"},{"lat":27.63,"lng":89.85,"label":"Chimi Lhakhang"}]'::jsonb
where slug = 'punakha-day-tour';

-- Back-fill Thimphu Cultural Tour
update tours set
  image_url   = 'https://images.unsplash.com/photo-1640248174356-81b49c507e54?w=1200&q=80',
  itinerary   = '[{"day":1,"title":"Thimphu — Capital City Cultural Circuit","description":"Buddha Dordenma (51m gilded bronze), National Memorial Chorten, Trashi Chhoe Dzong, Zorig Chusum arts school (thangka painting & wood carving), weekend market, and the takin preserve."}]'::jsonb,
  map_points  = '[{"lat":27.4479,"lng":89.6501,"label":"Buddha Dordenma"},{"lat":27.4648,"lng":89.642,"label":"National Memorial Chorten"},{"lat":27.4893,"lng":89.6384,"label":"Trashi Chhoe Dzong"},{"lat":27.499,"lng":89.625,"label":"Takin Preserve"}]'::jsonb
where slug = 'thimphu-cultural-tour';

-- Back-fill Jumolhari Trek
update tours set
  image_url   = 'https://images.unsplash.com/photo-1584095434749-d1b975e1ca9c?w=1200&q=80',
  itinerary   = '[{"day":1,"title":"Arrive Paro — Acclimatization","description":"Arrive in Paro, meet your trekking crew. Easy walk along the Paro Chhu river. Gear check and briefing."},{"day":2,"title":"Drive to Drukgyel Dzong, Trek to Shana (2,870m)","description":"Drive to the ruined Drukgyel Dzong. Begin trekking alongside the Paro Chhu river to Shana camp."},{"day":3,"title":"Trek to Thangthanka (3,610m)","description":"Follow the river deeper into the Himalayan foothills past yak herder huts and prayer carvings."},{"day":4,"title":"Trek to Jangothang Base Camp (4,080m)","description":"Dramatic approach with Jumolhari filling the horizon. Settle into base camp under the sacred peak."},{"day":5,"title":"Rest Day at Jangothang","description":"Acclimatize with a short hike to the lake above camp or explore yak herder villages."},{"day":6,"title":"Cross Nyile La Pass (4,870m) to Lingshi","description":"Early start for the high crossing of Nyile La. Prayer flags at the pass, then descend to Lingshi."},{"day":7,"title":"Rest & Explore Lingshi Dzong","description":"Visit the remote Lingshi Dzong fortress. Walk among herder settlements and rest tired legs."},{"day":8,"title":"Cross Chhe La (4,890m) to Shodu","description":"Another high pass crossing with panoramic views into Tibet''s Chumbi Valley on clear days."},{"day":9,"title":"Trek to Robluthang through Rhododendron Forests","description":"Descend into ancient rhododendron forests blazing with color in spring."},{"day":10,"title":"Cross Thombu La (4,380m) to Tsheri Jathang","description":"Third major pass. Tsheri Jathang is prime blue sheep and snow leopard territory."},{"day":11,"title":"Trek to Gunitsawa — Final Day in Wilderness","description":"Last long day on trail, descending from high country to Gunitsawa where the road begins."},{"day":12,"title":"Drive to Paro — Celebration Dinner","description":"Transfer to Paro. Hot showers and a celebratory dinner with your guide and crew."},{"day":13,"title":"Depart Paro","description":"Transfer to Paro airport for your onward flight."}]'::jsonb,
  map_points  = '[{"lat":27.4287,"lng":89.4171,"label":"Paro"},{"lat":27.486,"lng":89.332,"label":"Drukgyel Dzong"},{"lat":27.62,"lng":89.35,"label":"Thangthanka (3,610m)"},{"lat":27.82,"lng":89.27,"label":"Jangothang Base Camp (4,080m)"},{"lat":27.85,"lng":89.45,"label":"Lingshi Dzong"},{"lat":27.6,"lng":89.53,"label":"Gunitsawa"}]'::jsonb
where slug = 'jumolhari-trek';

-- Back-fill Bumthang Cultural Tour
update tours set
  image_url   = 'https://images.unsplash.com/photo-1662546803799-9a1d5532514f?w=1200&q=80',
  itinerary   = '[{"day":1,"title":"Arrive Bumthang — Jakar Dzong & Jambay Lhakhang","description":"Fly or drive to Bumthang''s Jakar town (2,600m). Visit Jakar Dzong (White Bird Castle). Afternoon at Jambay Lhakhang, one of Bhutan''s oldest temples, built in 659 AD. Traditional farmhouse dinner."},{"day":2,"title":"Kurjey Lhakhang, Membartsho & Local Tastings","description":"Morning at Kurjey Lhakhang where Guru Rinpoche left a body imprint in rock. Walk to Membartsho (Burning Lake). Afternoon: yak cheese, honey farm, and apple brandy tasting at the local distillery."}]'::jsonb,
  map_points  = '[{"lat":27.5406,"lng":90.7303,"label":"Jakar Dzong"},{"lat":27.555,"lng":90.721,"label":"Jambay Lhakhang"},{"lat":27.564,"lng":90.707,"label":"Kurjey Lhakhang"},{"lat":27.547,"lng":90.684,"label":"Membartsho (Burning Lake)"}]'::jsonb
where slug = 'bumthang-cultural-tour';

-- Back-fill Phobjikha Valley Tour
update tours set
  image_url   = 'https://images.unsplash.com/photo-1761048163587-0c13c4ae450b?w=1200&q=80',
  itinerary   = '[{"day":1,"title":"Arrive Phobjikha — Gangtey Gonpa & Evening Crane Walk","description":"Drive into the broad Phobjikha Valley. Visit Gangtey Gonpa, the only Nyingmapa monastery in western Bhutan. Evening walk to the wetland viewing area — in season (Oct-Feb), hundreds of black-necked cranes roost at dusk."},{"day":2,"title":"Gangtey Nature Trail & Crane Information Centre","description":"Morning 5km walk through dwarf bamboo, farmhouses, and forest. Visit the Black-Necked Crane Information Centre to learn about the cranes'' migration from the Tibetan plateau. Afternoon departure."}]'::jsonb,
  map_points  = '[{"lat":27.4578,"lng":90.1812,"label":"Gangtey Gonpa"},{"lat":27.465,"lng":90.175,"label":"Crane Information Centre"},{"lat":27.462,"lng":90.195,"label":"Wetland Viewing Area"}]'::jsonb
where slug = 'phobjikha-valley-tour';

-- Back-fill Haa Valley Tour
update tours set
  image_url   = 'https://images.unsplash.com/photo-1742539327294-a050227d15b7?w=1200&q=80',
  itinerary   = '[{"day":1,"title":"Paro to Haa via Chele La Pass (3,988m)","description":"Drive from Paro up to Chele La, the highest motorable pass in Bhutan, draped in prayer flags. Clear days reveal Jumolhari and Jichu Drake. Descend into the secretive Haa Valley, open to tourists only since 2002."},{"day":2,"title":"Twin Temples & Village Walks","description":"Visit Lhakhang Karp (White Temple) and Lhakhang Narp (Black Temple), twin 7th-century monasteries. Afternoon walk through Haa village with a home-cooked lunch in a local household."},{"day":3,"title":"Haa Valley Morning & Return to Paro","description":"Easy morning walk along the Haa Chhu river. Visit Haa Dzong before the return drive to Paro over Chele La."}]'::jsonb,
  map_points  = '[{"lat":27.4287,"lng":89.4171,"label":"Paro"},{"lat":27.35,"lng":89.21,"label":"Chele La Pass (3,988m)"},{"lat":27.3916,"lng":89.278,"label":"Haa Town"},{"lat":27.398,"lng":89.28,"label":"Lhakhang Karp (White Temple)"}]'::jsonb
where slug = 'haa-valley-tour';

-- Back-fill Western Grand Tour
update tours set
  image_url   = 'https://images.unsplash.com/photo-1743402063949-ad3c824c2484?w=1200&q=80',
  itinerary   = '[{"day":1,"title":"Arrive Paro — Rinpung Dzong & Town Walk","description":"Arrive at Paro International Airport. Visit Rinpung Dzong and stroll the market street. Settle in and acclimatize."},{"day":2,"title":"Tiger''s Nest Hike","description":"All-day hike to Paro Taktsang. Cafeteria viewpoint, then the final climb to the clifftop monastery. Traditional lunch on the mountain."},{"day":3,"title":"Paro to Thimphu — Buddha, Arts & Market","description":"Drive to Thimphu. Buddha Dordenma, Zorig Chusum arts school, Memorial Chorten, and the weekend market."},{"day":4,"title":"Thimphu to Punakha via Dochula Pass","description":"Cross Dochula Pass and its 108 white chortens. Visit Punakha Dzong and walk the famous suspension bridge."},{"day":5,"title":"Punakha — Chimi Lhakhang & Drive to Phobjikha","description":"Morning stroll to Chimi Lhakhang through mustard fields. Drive to Phobjikha Valley. Evening at Gangtey Gonpa."},{"day":6,"title":"Phobjikha — Nature Trail & Crane Spotting","description":"Gangtey Nature Trail, Black-Necked Crane Information Centre, and the pristine wetland."},{"day":7,"title":"Return to Paro — Farewell Dinner","description":"Scenic drive back to Paro. Optional visit to the National Museum. Farewell dinner with your guide."}]'::jsonb,
  map_points  = '[{"lat":27.4287,"lng":89.4171,"label":"Paro"},{"lat":27.493,"lng":89.3635,"label":"Tiger''s Nest"},{"lat":27.4728,"lng":89.6393,"label":"Thimphu"},{"lat":27.5017,"lng":89.544,"label":"Dochula Pass (3,116m)"},{"lat":27.6124,"lng":89.8677,"label":"Punakha Dzong"},{"lat":27.4578,"lng":90.1812,"label":"Phobjikha Valley"}]'::jsonb
where slug = 'western-bhutan-grand-tour';

-- Back-fill Dochula Day Tour
update tours set
  image_url   = 'https://images.unsplash.com/photo-1772702812440-b3b1c2c3abe3?w=1200&q=80',
  itinerary   = '[{"day":1,"title":"Thimphu — Dochula Pass — Wangdue Phodrang — Thimphu","description":"Drive to Dochula Pass (3,116m). Walk among the 108 Druk Wangyal chortens with Himalayan views. Descend to Wangdue Phodrang Dzong above the river confluence. Lunch in Wangdue town. Return to Thimphu by evening."}]'::jsonb,
  map_points  = '[{"lat":27.4728,"lng":89.6393,"label":"Thimphu"},{"lat":27.5017,"lng":89.544,"label":"Dochula Pass (3,116m)"},{"lat":27.4875,"lng":89.901,"label":"Wangdue Phodrang Dzong"}]'::jsonb
where slug = 'dochula-wangdue-day-tour';

-- Back-fill Festival Tour
update tours set
  image_url   = 'https://images.unsplash.com/photo-1667984895361-6de69c521903?w=1200&q=80',
  itinerary   = '[{"day":1,"title":"Arrive & Festival Orientation","description":"Arrive at the festival location. Your guide briefs you on the festival''s religious significance, dance schedule, and dzong layout. Visit the local market and explore the dzong exterior."},{"day":2,"title":"Main Festival Day — Cham Dances & Thongdrel","description":"At dawn witness the unfurling of the giant thongdrel on the dzong wall. Full day watching cham masked dances performed by monks."},{"day":3,"title":"Second Festival Day & Surrounding Monasteries","description":"More cham performances and the Atsara (sacred clown). Afternoon visit to nearby monasteries for quiet contemplation."},{"day":4,"title":"Morning Photography & Departure","description":"Early morning light for photographing costumes and the dzong. Debrief breakfast with your guide, then transfer to Paro for departure."}]'::jsonb,
  map_points  = '[{"lat":27.4287,"lng":89.4171,"label":"Paro (Paro Tshechu)"},{"lat":27.4728,"lng":89.6393,"label":"Thimphu (Thimphu Tshechu)"},{"lat":27.6124,"lng":89.8677,"label":"Punakha (Punakha Tshechu)"}]'::jsonb
where slug = 'bhutan-festival-tour';

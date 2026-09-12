-- The 10 live tours were seeded/edited with Unsplash *photo-page slug IDs*
-- (e.g. "photo-uMbGXBy7bKs") instead of the actual CDN image path
-- (e.g. "photo-1743402063949-ad3c824c2484"), so every tour card image
-- 404s on https://bhutanechoes.com/tours. Replacing with verified,
-- correctly-formatted Unsplash CDN URLs (same curated set already used
-- elsewhere in this repo's seed data / earlier migrations).

update tours set image_url = 'https://images.unsplash.com/photo-1743402063949-ad3c824c2484?w=1200&q=80' where slug = 'essential-bhutan-7d';
update tours set image_url = 'https://images.unsplash.com/photo-1638245771029-9bdb1e3e7a01?w=1200&q=80' where slug = 'discover-bhutan-10d';
update tours set image_url = 'https://images.unsplash.com/photo-1608236475016-1dcc7a260326?w=1200&q=80' where slug = 'punakha-tshechu-9d';
update tours set image_url = 'https://images.unsplash.com/photo-1640248174356-81b49c507e54?w=1200&q=80' where slug = 'black-necked-crane-festival-9d';
update tours set image_url = 'https://images.unsplash.com/photo-1584095434749-d1b975e1ca9c?w=1200&q=80' where slug = 'magical-bhutan-5d';
update tours set image_url = 'https://images.unsplash.com/photo-1662546803799-9a1d5532514f?w=1200&q=80' where slug = 'uma-paro-luxury-5d';
update tours set image_url = 'https://images.unsplash.com/photo-1761048163587-0c13c4ae450b?w=1200&q=80' where slug = 'amankora-8d';
update tours set image_url = 'https://images.unsplash.com/photo-1742539327294-a050227d15b7?w=1200&q=80' where slug = 'thimphu-tshechu-7d';
update tours set image_url = 'https://images.unsplash.com/photo-1772702812440-b3b1c2c3abe3?w=1200&q=80' where slug = 'paro-tshechu-7d';
update tours set image_url = 'https://images.unsplash.com/photo-1667984895361-6de69c521903?w=1200&q=80' where slug = 'royal-highlander-festival-11d';

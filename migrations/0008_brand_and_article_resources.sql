-- Additive: old API requests keep resources on update. Existing posts start empty.
ALTER TABLE posts ADD COLUMN resources TEXT NOT NULL DEFAULT '{"title":"本期视频提到的链接","items":[],"descriptionUrl":""}' CHECK(json_valid(resources) AND json_type(resources)='object');

-- Replace reference branding only; preserve independently customized names/logos.
UPDATE settings SET value=replace(replace(replace(replace(value,
 '星环无限 Rinfinity','YaChin科技生活'),'星环无限','YaChin科技生活'),
 '/images/405529e8e5aee5e1.png','/images/yachin-mark.svg'),
 '/images/60e6104ad07aab16.png','/images/yachin-mark.svg'), version=version+1 WHERE id=1;
UPDATE settings SET value=json_set(value,
 '$.youtube',CASE WHEN json_extract(value,'$.youtube')='https://www.youtube.com/@rinfinity' THEN '' ELSE coalesce(json_extract(value,'$.youtube'),'') END,
 '$.telegram',CASE WHEN json_extract(value,'$.telegram')='https://t.me/rinfinity' THEN '' ELSE coalesce(json_extract(value,'$.telegram'),'') END,
 '$.bilibili',CASE WHEN json_extract(value,'$.bilibili')='https://space.bilibili.com/' THEN '' ELSE coalesce(json_extract(value,'$.bilibili'),'') END,
 '$.twitter',CASE WHEN json_extract(value,'$.twitter')='https://x.com/' THEN '' ELSE coalesce(json_extract(value,'$.twitter'),'') END
) WHERE id=1;

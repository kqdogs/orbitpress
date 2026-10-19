-- NULL marks legacy rows; [] is an explicit choice to hide highlights.
ALTER TABLE posts ADD COLUMN highlights TEXT DEFAULT NULL
 CHECK(highlights IS NULL OR (json_valid(highlights) AND json_type(highlights)='array' AND json_array_length(highlights)<=6));

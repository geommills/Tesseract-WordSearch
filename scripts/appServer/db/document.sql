CREATE TABLE document
(
  id serial NOT NULL,
  name character varying(200),
  pages integer,
  content text NOT NULL
)
WITH (
  OIDS=FALSE
);
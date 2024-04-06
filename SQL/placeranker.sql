--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Friends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Friends" (
    username character varying NOT NULL,
    requests character varying[],
    friends_list character varying[]
);


ALTER TABLE public."Friends" OWNER TO postgres;

--
-- Name: Login; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Login" (
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL
);


ALTER TABLE public."Login" OWNER TO postgres;

--
-- Name: Places; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Places" (
    longitude double precision,
    latitude double precision,
    location_id character varying
);


ALTER TABLE public."Places" OWNER TO postgres;

--
-- Name: Ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ratings" (
    "Username" character varying[] NOT NULL,
    "LocationID" character varying[] NOT NULL,
    "Rating" int4range,
    "Comment" character varying[]
);


ALTER TABLE public."Ratings" OWNER TO postgres;

--
-- Data for Name: Friends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Friends" (username, requests, friends_list) FROM stdin;
bob	{}	{test,test1234}
\.


--
-- Data for Name: Login; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Login" (username, password) FROM stdin;
bob	test
bob123	Test123
\.


--
-- Data for Name: Places; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Places" (longitude, latitude, location_id) FROM stdin;
\.


--
-- Data for Name: Ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ratings" ("Username", "LocationID", "Rating", "Comment") FROM stdin;
\.


--
-- Name: Friends Friends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "Friends_pkey" PRIMARY KEY (username);


--
-- Name: Login Login_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Login"
    ADD CONSTRAINT "Login_pkey" PRIMARY KEY (username);


--
-- Name: Ratings Ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_pkey" PRIMARY KEY ("Username");


--
-- PostgreSQL database dump complete
--


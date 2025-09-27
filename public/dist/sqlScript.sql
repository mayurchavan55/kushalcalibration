CREATE SEQUENCE IF NOT EXISTS public.tbl_customer_master_tcm_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;
	
	CREATE SEQUENCE IF NOT EXISTS public.tbl_material_master_tmm_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;
	
	CREATE SEQUENCE IF NOT EXISTS public.tbl_make_master_tm_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;
	
	CREATE SEQUENCE IF NOT EXISTS public.tbl_instruments_master_tim_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;
	
	
	CREATE SEQUENCE IF NOT EXISTS public.tbl_user_tu_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;
	
	
	CREATE SEQUENCE IF NOT EXISTS public.tbl_role_master_trm_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;
	
	
	CREATE SEQUENCE IF NOT EXISTS public.tbl_job_register_tjr_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;
	
	
	CREATE TABLE IF NOT EXISTS public.tbl_role_master
(
    trm_id smallint NOT NULL DEFAULT nextval('tbl_role_master_trm_id_seq'::regclass),
    trm_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    trm_isenable boolean DEFAULT true,
    CONSTRAINT tbl_role_master_pkey PRIMARY KEY (trm_id)
)


	CREATE TABLE IF NOT EXISTS public.tbl_user
(
    tu_id integer NOT NULL DEFAULT nextval('tbl_user_tu_id_seq'::regclass),
    tu_fk_trm_id integer,
    tu_username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    tu_firstname character varying(255) COLLATE pg_catalog."default",
    tu_lastname character varying(255) COLLATE pg_catalog."default",
    tu_password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    tu_isenable boolean DEFAULT true,
    tu_createdby integer,
    tu_createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tu_updatedby integer,
    tu_updatedat timestamp without time zone,
    tu_email character varying COLLATE pg_catalog."default",
    CONSTRAINT tbl_user_pkey PRIMARY KEY (tu_id),
    CONSTRAINT tu_fk_trm_id_fkey FOREIGN KEY (tu_fk_trm_id)
        REFERENCES public.tbl_role_master (trm_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)



	CREATE TABLE IF NOT EXISTS public.tbl_customer_master
(
    tcm_id integer NOT NULL DEFAULT nextval('tbl_customer_master_tcm_id_seq'::regclass),
    tcm_contact_person character varying(255) COLLATE pg_catalog."default",
    tcm_email character varying(255) COLLATE pg_catalog."default",
    tcm_mobile character varying(255) COLLATE pg_catalog."default" NOT NULL,
	tcm_address character varying COLLATE pg_catalog."default",
    tcm_isenable boolean DEFAULT true,
    tcm_createdby integer,
    tcm_createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tcm_updatedby integer,
    tcm_updatedat timestamp without time zone,
    CONSTRAINT tbl_customer_master_pkey PRIMARY KEY (tcm_id)
)

CREATE TABLE IF NOT EXISTS public.tbl_material_master
(
    tmm_id smallint NOT NULL DEFAULT nextval('tbl_material_master_tmm_id_seq'::regclass),
    tmm_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    tmm_isenable boolean DEFAULT true,
    CONSTRAINT tbl_material_master_pkey PRIMARY KEY (tmm_id)
)


CREATE TABLE IF NOT EXISTS public.tbl_make_master
(
    tm_id smallint NOT NULL DEFAULT nextval('tbl_make_master_tm_id_seq'::regclass),
    tm_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    tm_isenable boolean DEFAULT true,
    CONSTRAINT tbl_make_master_pkey PRIMARY KEY (tm_id)
)


CREATE TABLE IF NOT EXISTS public.tbl_instruments_master
(
    tim_id smallint NOT NULL DEFAULT nextval('tbl_instruments_master_tim_id_seq'::regclass),
    tim_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    tim_isenable boolean DEFAULT true,
    CONSTRAINT tbl_instruments_master_pkey PRIMARY KEY (tim_id)
)




CREATE TABLE IF NOT EXISTS public.tbl_job_register
(
    tjr_id integer NOT NULL DEFAULT nextval('tbl_job_register_tjr_id_seq'::regclass),
    tjr_fk_tcm_id integer,
	tjr_fk_tim_id integer,
	tjr_fk_tm_id integer,
	tjr_fk_tmm_id integer,
    tjr_range character varying(50) COLLATE pg_catalog."default" NOT NULL,
    tjr_resolution character varying(50) COLLATE pg_catalog."default",
    tjr_srno character varying(50) COLLATE pg_catalog."default",
    tjr_customer_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
	tjr_modelno character varying(50) COLLATE pg_catalog."default" NOT NULL,
    tjr_grande character varying(50) COLLATE pg_catalog."default",
    tjr_customer_challan_no character varying(50) COLLATE pg_catalog."default",
    tjr_lab_ref_no character varying(50) COLLATE pg_catalog."default" NOT NULL,
	tjr_labid character varying(50) COLLATE pg_catalog."default" NOT NULL,
    tjr_certificate_no character varying(50) COLLATE pg_catalog."default",
    tjr_ulr_no character varying(50) COLLATE pg_catalog."default",
    tjr_reciept_date timestamp without time zone,
	tjr_calibration_date timestamp without time zone,
	tjr_next_calibration_date timestamp without time zone,
	tjr_certificate_date timestamp without time zone,
	tjr_remark TEXT COLLATE pg_catalog."default",
	tjr_additional_details TEXT COLLATE pg_catalog."default",
	tjr_calibration_lab character varying(50) COLLATE pg_catalog."default",
    tjr_isenable boolean DEFAULT true,
    tjr_createdby integer,
    tjr_createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tjr_updatedby integer,
    tjr_updatedat timestamp without time zone,
    CONSTRAINT tbl_job_register_pkey PRIMARY KEY (tjr_id),
    CONSTRAINT tjr_fk_tcm_id_fkey FOREIGN KEY (tjr_fk_tcm_id)
        REFERENCES public.tbl_customer_master (tcm_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
		CONSTRAINT tjr_fk_tim_id_fkey FOREIGN KEY (tjr_fk_tim_id)
        REFERENCES public.tbl_instruments_master (tim_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
		CONSTRAINT tjr_fk_tm_id_fkey FOREIGN KEY (tjr_fk_tm_id)
        REFERENCES public.tbl_make_master (tm_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
		CONSTRAINT tjr_fk_tmm_id_fkey FOREIGN KEY (tjr_fk_tmm_id)
        REFERENCES public.tbl_material_master (tmm_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)



INSERT INTO public.tbl_role_master(
	trm_id, trm_name, trm_isenable)
	VALUES (DEFAULT, 'Admin', true);
	
	INSERT INTO public.tbl_user(
	tu_id, tu_fk_trm_id, tu_username, tu_firstname, tu_lastname, tu_password, tu_isenable, tu_createdby, tu_createdat, tu_updatedby, tu_updatedat, tu_email)
	VALUES (DEFAULT, 1, 'sachin.jogdand', 'Sachin', 'Jogdand', '$2a$06$3hGoGWFL26DTPr/fOqrPGu7GwJpvPqxUY0jxANnh5wabQT2R7aKKm', true, 1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP, 'sachin.jogdand@yopmail.com');


    
	ALTER TABLE IF EXISTS public.tbl_user
    RENAME TO tbl_users;

    ALTER TABLE IF EXISTS public.tbl_role_master
    RENAME TO tbl_role_masters;



CREATE OR REPLACE FUNCTION public.crypt(
	text,
	text)
    RETURNS text
    LANGUAGE 'c'
    COST 1
    IMMUTABLE STRICT PARALLEL SAFE 
AS '$libdir/pgcrypto', 'pg_crypt'
;



INSERT INTO public.tbl_make_master (tm_id, tm_name, tm_isenable) 
VALUES 
(DEFAULT, 'µ- tek', true),
(DEFAULT, 'A-1 Gauge', true),
(DEFAULT, 'A-1 Tools', true),
(DEFAULT, 'Aadesh', true),
(DEFAULT, 'Absolute', true),
(DEFAULT, 'Absolute', true),
(DEFAULT, 'Accretech', true),
(DEFAULT, 'Accu Plus', true),
(DEFAULT, 'Accuplus', true),
(DEFAULT, 'Accurate', true),
(DEFAULT, 'Accuseize', true),
(DEFAULT, 'Accusize', true),
(DEFAULT, 'Accu-Size', true),
(DEFAULT, 'Accutech', true),
(DEFAULT, 'Accuthread', true),
(DEFAULT, 'Accutool', true),
(DEFAULT, 'Accu-Tool', true),
(DEFAULT, 'Adis', true),
(DEFAULT, 'Aditya', true),
(DEFAULT, 'Advance', true),
(DEFAULT, 'Aero Space', true),
(DEFAULT, 'Aerospace', true),
(DEFAULT, 'AIIPL', true),
(DEFAULT, 'AIM', true),
(DEFAULT, 'Ajanta', true),
(DEFAULT, 'Ajanta', true),
(DEFAULT, 'Ajit', true),
(DEFAULT, 'Ampsy', true),
(DEFAULT, 'Aniket', true),
(DEFAULT, 'Anyi', true),
(DEFAULT, 'Apollo', true),
(DEFAULT, 'ARCK', true),
(DEFAULT, 'Arcs', true),
(DEFAULT, 'Armatech Associates', true),
(DEFAULT, 'Asa Bhanu', true),
(DEFAULT, 'Atul', true),
(DEFAULT, 'Avadhoot', true),
(DEFAULT, 'Avadhoot Auto', true),
(DEFAULT, 'Bagson', true),
(DEFAULT, 'Baker', true),
(DEFAULT, 'Baker/Sizemasters', true),
(DEFAULT, 'Baker/Universal', true),
(DEFAULT, 'Bharat', true),
(DEFAULT, 'Bharat A-Grade', true),
(DEFAULT, 'BHY 267', true),
(DEFAULT, 'Blue Steel', true),
(DEFAULT, 'BMA 665', true),
(DEFAULT, 'BNA 1708', true),
(DEFAULT, 'Bosch', true),
(DEFAULT, 'Bowers', true),
(DEFAULT, 'BPA 1878', true),
(DEFAULT, 'Britool', true),
(DEFAULT, 'BTY 1637', true),
(DEFAULT, 'Buffalo', true),
(DEFAULT, 'C.I.P.L', true),
(DEFAULT, 'Caltech', true),
(DEFAULT, 'CAPITAL', true),
(DEFAULT, 'Carl Mahr', true),
(DEFAULT, 'Carl-Zeiss', true),
(DEFAULT, 'CARMAR', true),
(DEFAULT, 'China', true),
(DEFAULT, 'CIC', true),
(DEFAULT, 'Classic', true),
(DEFAULT, 'Classic Yamayo', true),
(DEFAULT, 'Crystal', true),
(DEFAULT, 'Crytal', true),
(DEFAULT, 'Darshi', true),
(DEFAULT, 'Dasqua', true),
(DEFAULT, 'Defelsko', true),
(DEFAULT, 'Dev', true),
(DEFAULT, 'Digical', true),
(DEFAULT, 'Dimensional Control', true),
(DEFAULT, 'Dino Lite', true),
(DEFAULT, 'Dodi', true),
(DEFAULT, 'Dolphin', true),
(DEFAULT, 'Domco', true),
(DEFAULT, 'Elcometer', true),
(DEFAULT, 'Elecoat', true),
(DEFAULT, 'Electronica', true),
(DEFAULT, 'Elora', true),
(DEFAULT, 'Emuge', true),
(DEFAULT, 'Equinox', true),
(DEFAULT, 'ETALON - Aditya', true),
(DEFAULT, 'Excel', true),
(DEFAULT, 'F191186', true),
(DEFAULT, 'Falcon', true),
(DEFAULT, 'Filetta', true),
(DEFAULT, 'FINE', true),
(DEFAULT, 'Fischer', true),
(DEFAULT, 'Fluke', true),
(DEFAULT, 'Forbes', true),
(DEFAULT, 'Freemans', true),
(DEFAULT, 'Fremans', true),
(DEFAULT, 'FSK', true),
(DEFAULT, 'Fujitech', true),
(DEFAULT, 'G.T.', true),
(DEFAULT, 'Gagemaker', true),
(DEFAULT, 'Gaug Mark', true),
(DEFAULT, 'Gauge Mark', true),
(DEFAULT, 'Gaugewel', true),
(DEFAULT, 'Germany', true),
(DEFAULT, 'Globe', true),
(DEFAULT, 'GMG', true),
(DEFAULT, 'GMS', true),
(DEFAULT, 'GMT', true),
(DEFAULT, 'GMT metrology', true),
(DEFAULT, 'Gold', true),
(DEFAULT, 'Granite', true),
(DEFAULT, 'Graphica', true),
(DEFAULT, 'H.I.P', true),
(DEFAULT, 'Hallmark', true),
(DEFAULT, 'Hardman', true),
(DEFAULT, 'Harshman', true),
(DEFAULT, 'Hatco', true),
(DEFAULT, 'HG', true),
(DEFAULT, 'HI-MEZAR', true),
(DEFAULT, 'HIP', true),
(DEFAULT, 'Hiroshima', true),
(DEFAULT, 'HME', true),
(DEFAULT, 'Innovative', true),
(DEFAULT, 'Innovative Automation', true),
(DEFAULT, 'Inox', true),
(DEFAULT, 'Insize', true),
(DEFAULT, 'Involute', true),
(DEFAULT, 'Jafuji', true),
(DEFAULT, 'Jataji', true),
(DEFAULT, 'JIT', true),
(DEFAULT, 'Kafer', true),
(DEFAULT, 'Kann', true),
(DEFAULT, 'KCP', true),
(DEFAULT, 'Kency', true),
(DEFAULT, 'Khyati', true),
(DEFAULT, 'King Tony', true),
(DEFAULT, 'KOBA', true),
(DEFAULT, 'Kristeel', true),
(DEFAULT, 'Kristeel Shinwa', true),
(DEFAULT, 'Kroeplin', true),
(DEFAULT, 'Kumaun', true),
(DEFAULT, 'Kundan', true),
(DEFAULT, 'Kusam-Meco', true),
(DEFAULT, 'KVR International', true),
(DEFAULT, 'Kwality', true),
(DEFAULT, 'Limra', true),
(DEFAULT, 'LTL', true),
(DEFAULT, 'Luthra', true),
(DEFAULT, 'Lutron', true),
(DEFAULT, 'M & W', true),
(DEFAULT, 'M&W', true),
(DEFAULT, 'M.T.', true),
(DEFAULT, 'Mac Master', true),
(DEFAULT, 'Madhur', true),
(DEFAULT, 'Mahr', true),
(DEFAULT, 'Manigo', true),
(DEFAULT, 'Markvel', true),
(DEFAULT, 'Martin Tschopp', true),
(DEFAULT, 'MASTER', true),
(DEFAULT, 'Master Metrology', true),
(DEFAULT, 'Master Tools', true),
(DEFAULT, 'Mastermakes', true),
(DEFAULT, 'Matchwell', true),
(DEFAULT, 'Mauli', true),
(DEFAULT, 'Mauli Mahesh', true),
(DEFAULT, 'MC', true),
(DEFAULT, 'MCRON IND.', true),
(DEFAULT, 'Mecrametzer', true),
(DEFAULT, 'Meerametzer', true),
(DEFAULT, 'Merciful', true),
(DEFAULT, 'Metrix', true),
(DEFAULT, 'Metrology', true),
(DEFAULT, 'MEXTECH', true),
(DEFAULT, 'MGPL', true),
(DEFAULT, 'MGW', true),
(DEFAULT, 'Micro', true),
(DEFAULT, 'MICRO GAUGES', true),
(DEFAULT, 'Microflat', true),
(DEFAULT, 'Microgauges', true),
(DEFAULT, 'Micron', true),
(DEFAULT, 'Micron Ind.', true),
(DEFAULT, 'Microns', true),
(DEFAULT, 'Mikron', true),
(DEFAULT, 'MIKRON', true),
(DEFAULT, 'MIKRON', true),
(DEFAULT, 'Mikronix', true),
(DEFAULT, 'Mikronix-Octagon', true),
(DEFAULT, 'Mitoya', true),
(DEFAULT, 'Mitutoya', true),
(DEFAULT, 'Mitutoyo', true),
(DEFAULT, 'MLK', true),
(DEFAULT, 'MMT', true),
(DEFAULT, 'Mnimet', true),
(DEFAULT, 'Modisonic', true),
(DEFAULT, 'Modsonic', true),
(DEFAULT, 'Moore&Wright', true),
(DEFAULT, 'MR Ventures', true),
(DEFAULT, 'Mukund', true),
(DEFAULT, 'Nika', true),
(DEFAULT, 'Nilesh Engg.', true),
(DEFAULT, 'Octagon', true),
(DEFAULT, 'Om', true),
(DEFAULT, 'OM SGEW', true),
(DEFAULT, 'OME', true),
(DEFAULT, 'Omega', true),
(DEFAULT, 'Optomech', true),
(DEFAULT, 'OTHAM', true),
(DEFAULT, 'OXFORD', true),
(DEFAULT, 'P.P.E', true),
(DEFAULT, 'Peacock', true),
(DEFAULT, 'PEARL', true),
(DEFAULT, 'Perfect', true),
(DEFAULT, 'PGF', true),
(DEFAULT, 'PGS', true),
(DEFAULT, 'PGT', true),
(DEFAULT, 'Poland', true),
(DEFAULT, 'Positector', true),
(DEFAULT, 'PQG', true),
(DEFAULT, 'Prachi', true),
(DEFAULT, 'Pradeep Vikas', true),
(DEFAULT, 'Praka-Vision', true),
(DEFAULT, 'Praman', true),
(DEFAULT, 'Pramar', true),
(DEFAULT, 'Prasad', true),
(DEFAULT, 'PRECIMES GAUGING', true),
(DEFAULT, 'Precise', true),
(DEFAULT, 'Precision', true),
(DEFAULT, 'PRECISON', true),
(DEFAULT, 'Q.M.G.', true),
(DEFAULT, 'QC', true),
(DEFAULT, 'QMI', true),
(DEFAULT, 'Radium', true),
(DEFAULT, 'Raj Mahesh', true),
(DEFAULT, 'Rapid Scan', true),
(DEFAULT, 'Renishaw', true),
(DEFAULT, 'Ronald', true),
(DEFAULT, 'Sai', true),
(DEFAULT, 'Sai Gauges', true),
(DEFAULT, 'Sakshi', true),
(DEFAULT, 'Samarth', true),
(DEFAULT, 'Samarth/Truthread', true),
(DEFAULT, 'Samenx Tools', true),
(DEFAULT, 'Samrat', true),
(DEFAULT, 'Samsung', true),
(DEFAULT, 'Sankalp', true),
(DEFAULT, 'Sansui', true),
(DEFAULT, 'SAR IND', true),
(DEFAULT, 'Scal', true),
(DEFAULT, 'Schut', true),
(DEFAULT, 'Scotts', true),
(DEFAULT, 'SG', true),
(DEFAULT, 'SGE', true),
(DEFAULT, 'SGEW', true),
(DEFAULT, 'SGT', true),
(DEFAULT, 'SGT', true),
(DEFAULT, 'SGTPL', true),
(DEFAULT, 'SHARS', true),
(DEFAULT, 'SHIRKE', true),
(DEFAULT, 'Shree', true),
(DEFAULT, 'Shree ganesh', true),
(DEFAULT, 'Size Control', true),
(DEFAULT, 'Size Master', true),
(DEFAULT, 'SkillMG', true),
(DEFAULT, 'SME', true),
(DEFAULT, 'SMG', true),
(DEFAULT, 'Solartron', true),
(DEFAULT, 'SovPlym', true),
(DEFAULT, 'SPCPL', true),
(DEFAULT, 'SPI', true),
(DEFAULT, 'Stainless Steel', true),
(DEFAULT, 'Standard', true),
(DEFAULT, 'Stanley', true),
(DEFAULT, 'Star P.T', true),
(DEFAULT, 'Starrett', true),
(DEFAULT, 'Status', true),
(DEFAULT, 'Stech Enginers', true),
(DEFAULT, 'STG', true),
(DEFAULT, 'STG / Truthread', true),
(DEFAULT, 'SUBLIME', true),
(DEFAULT, 'SUBLIME-1', true),
(DEFAULT, 'SUBLIME-2', true),
(DEFAULT, 'Success', true),
(DEFAULT, 'Sumida', true),
(DEFAULT, 'Sungold', true),
(DEFAULT, 'Suranga', true),
(DEFAULT, 'SWASTIK', true),
(DEFAULT, 'Swatik', true),
(DEFAULT, 'Sylvac', true),
(DEFAULT, 'System', true),
(DEFAULT, 'SYSTEMS', true),
(DEFAULT, 'Systems/Sizemasters', true),
(DEFAULT, 'Tanisshk', true),
(DEFAULT, 'Techno', true),
(DEFAULT, 'Technocart', true),
(DEFAULT, 'Teclock', true),
(DEFAULT, 'TEKPRO', true),
(DEFAULT, 'Tesa', true),
(DEFAULT, 'TESA - RSD', true),
(DEFAULT, 'TESATAST', true),
(DEFAULT, 'Tessa', true),
(DEFAULT, 'Threadmaster', true),
(DEFAULT, 'Tieco', true),
(DEFAULT, 'TIMEX', true),
(DEFAULT, 'Tirupati', true),
(DEFAULT, 'TMTG', true),
(DEFAULT, 'Tohnichi', true),
(DEFAULT, 'Torc Star', true),
(DEFAULT, 'Tower', true),
(DEFAULT, 'Toyo', true),
(DEFAULT, 'Trimos', true),
(DEFAULT, 'Truesize', true),
(DEFAULT, 'Truthread', true),
(DEFAULT, 'Truthread / Samarth', true),
(DEFAULT, 'TSS', true),
(DEFAULT, 'U.G.', true),
(DEFAULT, 'U.T', true),
(DEFAULT, 'Ultra', true),
(DEFAULT, 'Unik', true),
(DEFAULT, 'UNIMET', true),
(DEFAULT, 'Unity', true),
(DEFAULT, 'Universal', true),
(DEFAULT, 'Universal / Samarth', true),
(DEFAULT, 'Universal / Truthread', true),
(DEFAULT, 'Universal Gauges', true),
(DEFAULT, 'USA', true),
(DEFAULT, 'Use-Tech', true),
(DEFAULT, 'UT', true),
(DEFAULT, 'UTM9', true),
(DEFAULT, 'V.P', true),
(DEFAULT, 'Valco', true),
(DEFAULT, 'Valco Ask', true),
(DEFAULT, 'valco suniti', true),
(DEFAULT, 'VALLEY', true),
(DEFAULT, 'V-Green', true),
(DEFAULT, 'Vikas', true),
(DEFAULT, 'vipron', true),
(DEFAULT, 'VPW', true),
(DEFAULT, 'W.W.S', true),
(DEFAULT, 'W.W.S.', true),
(DEFAULT, 'Wiseman', true),
(DEFAULT, 'Workzone', true),
(DEFAULT, 'WWS', true),
(DEFAULT, 'XIAMEN TENFEI', true),
(DEFAULT, 'Y2k', true),
(DEFAULT, 'Yamayo', true),
(DEFAULT, 'Yamayo Classic', true),
(DEFAULT, 'Yeesha', true),
(DEFAULT, 'Airtech', true),
(DEFAULT, 'Mahavir', true),
(DEFAULT, 'Yuri', true),
(DEFAULT, 'Yuri', true),
(DEFAULT, 'Yuri Silver', true),
(DEFAULT, 'Yuyutsu', true),
(DEFAULT, 'Yuzuki', true),
(DEFAULT, 'Zawar', true),
(DEFAULT, 'Zeiss', true),
(DEFAULT, 'Zodiac', true),
(DEFAULT, 'Zoom', true);

INSERT INTO public.tbl_instruments_master (tim_id, tim_name, tim_isenable)
VALUES 
(DEFAULT, 'Angle Gauge Block', true),
(DEFAULT, 'Angle Plate', true),
(DEFAULT, 'Angle Protractor', true),
(DEFAULT, 'Angular Glass Scale', true),
(DEFAULT, 'Angular Graticule', true),
(DEFAULT, 'API 5B - Working Plug Gauge', true),
(DEFAULT, 'API 5B - Working Ring Gauge', true),
(DEFAULT, 'Base Plate Gauge', true),
(DEFAULT, 'Bench Centre', true),
(DEFAULT, 'Bevel Protractor', true),
(DEFAULT, 'Bevel Protractor-Digital', true),
(DEFAULT, 'Blong Pin Gauge For Bottol Support', true),
(DEFAULT, 'Bore Gauge', true),
(DEFAULT, 'Bore Gauge (Attached with Plunger Dial)', true),
(DEFAULT, 'Bridge Cam Gauge', true),
(DEFAULT, 'Caliper Checker', true),
(DEFAULT, 'Cam Type Guages', true),
(DEFAULT, 'CD Checking Gauge', true),
(DEFAULT, 'Chain Pulley', true),
(DEFAULT, 'Coating Thickness Gauge', true),
(DEFAULT, 'Coating Thickness Gauge - Digital Type', true),
(DEFAULT, 'Coating Thickness Meter', true),
(DEFAULT, 'Coating Thickness Meter - Dial Type', true),
(DEFAULT, 'Coating Thickness Probe', true),
(DEFAULT, 'Combination Set', true),
(DEFAULT, 'Comparator Base', true),
(DEFAULT, 'Comparator Stand', true),
(DEFAULT, 'Comparator Stand - With Electronic Probe & DRO', true),
(DEFAULT, 'Concentricity Gauge', true),
(DEFAULT, 'Conductivity Meter', true),
(DEFAULT, 'Crimping Tool', true),
(DEFAULT, 'Degree Protector - Digital Type', true),
(DEFAULT, 'Degree Protractor', true),
(DEFAULT, 'Depth Checker', true),
(DEFAULT, 'Depth Gauge', true),
(DEFAULT, 'Depth Gauge - Digital Dial Type', true),
(DEFAULT, 'Depth Micrometer', true),
(DEFAULT, 'Depth Micrometer - Digital Type', true),
(DEFAULT, 'Dial Calibration Tester', true),
(DEFAULT, 'Dial Snap Gauge', true),
(DEFAULT, 'Dial Snap Gauge - Digital Type', true),
(DEFAULT, 'Dial Thickness Gauge', true),
(DEFAULT, 'Dial Thickness Gauge - Digital Type', true),
(DEFAULT, 'Dial Thickness Gauge - Roller Type', true),
(DEFAULT, 'Digital Anemometer', true),
(DEFAULT, 'Durometer', true),
(DEFAULT, 'Electronic Height Gauge', true),
(DEFAULT, 'Electronic Height Gauge - Squareness', true),
(DEFAULT, 'Electronic Probe', true),
(DEFAULT, 'Electronic Probe with DRO', true),
(DEFAULT, 'Engineering Square', true),
(DEFAULT, 'External Micrometer - Low Force Mechanism', true),
(DEFAULT, 'External Micrometer', true),
(DEFAULT, 'External Micrometer - Digital Type', true),
(DEFAULT, 'External Micrometer - with interchangeable anvils', true),
(DEFAULT, 'External Micrometer - with interchangeable anvils-Digital Type', true),
(DEFAULT, 'External Micrometer- Ball Point Anvil', true),
(DEFAULT, 'External Micrometer- Ball Point Anvil (Digital Type)', true),
(DEFAULT, 'External Micrometer- Blade Anvil', true),
(DEFAULT, 'External Micrometer- Blade Anvil (Digital Type)', true),
(DEFAULT, 'External Micrometer- Disc Anvil', true),
(DEFAULT, 'External Micrometer- Disc Anvil (Digital Type)', true),
(DEFAULT, 'External Micrometer- Flat Anvil', true),
(DEFAULT, 'External Micrometer- Flat Anvil (Digital Type)', true),
(DEFAULT, 'External Micrometer- Pin Anvil', true),
(DEFAULT, 'External Micrometer- Pin Anvil (Digital Type)', true),
(DEFAULT, 'External Micrometer- Point Anvil', true),
(DEFAULT, 'External Micrometer- Point Anvil (Digital Type)', true),
(DEFAULT, 'Feeler Gauge', true),
(DEFAULT, 'Feeler Gauge Set', true),
(DEFAULT, 'Fillet Gauge', true),
(DEFAULT, 'Floating Carriage Diameter Measuring Machine', true),
(DEFAULT, 'Flush Pin Gauge', true),
(DEFAULT, 'Foils Set', true),
(DEFAULT, 'Ferrite Scope', true),
(DEFAULT, 'Gap Gauge', true),
(DEFAULT, 'Gauge Block Calibrator', true),
(DEFAULT, 'Gauge Block Comparator', true),
(DEFAULT, 'Hardness Tester (Rubber)', true),
(DEFAULT, 'Height Gauge', true),
(DEFAULT, 'Height Gauge - Dial Type', true),
(DEFAULT, 'Height Gauge - Digital Type', true),
(DEFAULT, 'Height Gauge - Vernier Scale', true),
(DEFAULT, 'Height Master', true),
(DEFAULT, 'Height Master (C.D Gauge)', true),
(DEFAULT, 'Horizontal Metroscope', true),
(DEFAULT, 'I.R. Thermometer', true),
(DEFAULT, 'Inside Caliper', true),
(DEFAULT, 'Inside Dial Caliper', true),
(DEFAULT, 'Inside Groove Caliper', true),
(DEFAULT, 'Inside Micrometer', true),
(DEFAULT, 'Inside Micrometer  - Three Points', true),
(DEFAULT, 'Inside Micrometer - Digital Type', true),
(DEFAULT, 'Internal Micrometer (3 Points)', true),
(DEFAULT, 'Laser Distance meter', true),
(DEFAULT, 'Length Bar', true),
(DEFAULT, 'Length Bar Parallel Jaws', true),
(DEFAULT, 'Length Bars - Set', true),
(DEFAULT, 'Length Gauge (GO & NOGO)', true),
(DEFAULT, 'Length Measuring Machine', true);


INSERT INTO public.tbl_instruments_master(tim_name, tim_isenable)
VALUES 
('Level Bottle', true),
('Lever Dial', true),
('Lever Dial - Digital Type', true),
('Linear Glass Scale', true),
('Lux Meter', true),
('LVDT Probe', true),
('LVDT Probe with DRO', true),
('Mandrill', true),
('Measuring Tape', true),
('Measuring Ball', true),
('Measuring Ball - Stylus', true),
('Measuring Pin', true),
('Measuring Pin Set', true),
('Measuring Scale', true),
('Measuring Tape', true),
('Metroscope', true),
('Micrometer - 3 Points', true),
('Micrometer Check Set', true),
('Micrometer Head', true),
('Micrometer Setting Standard', true),
('Micrometer Stick', true),
('Microscope', true),
('Microscope Glass Scale', true),
('O Ring', true),
('Oblong Gauge', true),
('OD Gauge', true),
('OD Master', true),
('Optical Flat', true),
('Parallel Block', true),
('Piramyd', true),
('Pin Gauge', true),
('Pistol Caliper', true),
('Pistol Caliper - Digital Type', true),
('Pitch Gauge', true),
('Plain Plug Gauge', true),
('Plain Plug Gauge (C.D Pin Type)', true),
('Plain Plug Gauge (GO & NOGO)', true),
('Plain Plug Gauge (GO)', true),
('Plain Plug Gauge (Hex. Type)', true),
('Plain Plug Gauge (NOGO)', true),
('Plain Plug Gauge (Special type)', true),
('Plain Plug Gauge (Square Type)', true),
('Plain Ring Gauge', true),
('Plain Ring Gauge (Counter Ring)', true),
('Plain Ring Gauge (GO & NOGO)', true),
('Plain Ring Gauge (GO)', true),
('Plain Ring Gauge (NOGO)', true),
('Plain Ring Washer', true),
('Plunger Dial', true),
('Plunger Dial - Digital Type', true),
('Plunger Dial (Attached to Bore gauge)', true),
('Pressure Gauge', true),
('Prism', true),
('Prism - Type A, B, C, D.', true),
('Profile Projector', true),
('Radius Gauge', true),
('Radius Gauge - Set', true),
('Right Angle', true),
('Right Angle Block', true),
('RPM Indicator', true),
('Rubber Hardness Tester', true),
('Screw Thread Micrometer', true),
('Setting Master', true),
('Setting Ring Gauge', true),
('Setting Ring Gauge (Air Gauge Unit)', true),
('Setting Ring Gauge (Air Plug Gauge Unit)', true),
('Setting Ring Gauge (Air Snap Gauge Unit)', true),
('Setting Ring Gauge (Air Taper Plug Gauge Unit)', true),
('Shims Foils of Coating Thickness Gauge', true),
('Shore A (Hardness Tester)', true),
('Shore A (Hardness Tester) - Digital Type', true),
('Shore D (Hardness Tester)', true),
('Shore D (Hardness Tester) - Digital Type', true),
('Sine Bar', true),
('Sine Centre', true),
('Single Arm Brg.', true),
('Slip Gauge Accessories', true),
('Slip Gauge Block', true),
('Slip Gauge Block (Eal G21) - Set', true),
('Slip Gauge Blocks - Set', true),
('Snap Gauge', true),
('SNEHA', true),
('Sound Level Meter', true),
('Spline Gauge', true),
('Spline Plug Gauge', true),
('Spline Ring Gauge', true),
('Square Master', true),
('Square Plug Gauge', true),
('Squareness Block', true),
('Squareness Cylinder', true),
('Stage Micrometer', true),
('Step Gauge', true),
('Step Gauge - CMM Master', true),
('Straight Edge', true),
('Straightness Guage', true),
('Surface Plate (Cast Iron)', true),
('Surface Plate (Granite)', true),
('Surface Profile Gauge', true),
('Surface Roughness Specimen', true),
('Surface Roughness Tester', true);



INSERT INTO public.tbl_instruments_master(tim_id, tim_name, tim_isenable)
VALUES
(DEFAULT, 'Symmetry Master Gauge', TRUE),
(DEFAULT, 'Tape & Scale Calibrator', TRUE),
(DEFAULT, 'Tape & Scale Measuring Machine', TRUE),
(DEFAULT, 'Taper Plain Plug Gauge', TRUE),
(DEFAULT, 'Taper Plain Ring Gauge', TRUE),
(DEFAULT, 'Taper Scale', TRUE),
(DEFAULT, 'Taper Thread Plug Gauge', TRUE),
(DEFAULT, 'Taper Thread Ring Gauge', TRUE),
(DEFAULT, 'Test Bar - Mandril', TRUE),
(DEFAULT, 'Test Sieve', TRUE),
(DEFAULT, 'Thermometer', TRUE),
(DEFAULT, 'Thickness Foils', TRUE),
(DEFAULT, 'Thickness Gauge (Dig. Type)', TRUE),
(DEFAULT, 'Thread Caliper', TRUE),
(DEFAULT, 'Thread Caliper - GO', TRUE),
(DEFAULT, 'Thread Caliper - GO & NOGO', TRUE),
(DEFAULT, 'Thread Caliper - NOGO', TRUE),
(DEFAULT, 'Thread Depth Gauge', TRUE),
(DEFAULT, 'Thread Measuring Wires', TRUE),
(DEFAULT, 'Thread Pitch Gauge', TRUE),
(DEFAULT, 'Thread Pitch Gauge - Set', TRUE),
(DEFAULT, 'Thread Plug Gauge', TRUE),
(DEFAULT, 'Thread Plug Gauge - WCP', TRUE),
(DEFAULT, 'Thread Plug Gauge - WCP for GO & NOGO Ring', TRUE),
(DEFAULT, 'Thread Plug Gauge - WCP for GO Ring', TRUE),
(DEFAULT, 'Thread Plug Gauge - WCP for NOGO Ring', TRUE),
(DEFAULT, 'Thread Plug Gauge (GO & NOGO)', TRUE),
(DEFAULT, 'Thread Plug Gauge (GO)', TRUE),
(DEFAULT, 'Thread Plug Gauge (NOGO)', TRUE),
(DEFAULT, 'Thread Plug Gauge (Taper)', TRUE),
(DEFAULT, 'Thread Plug Gauge 2B AP (Unified)', TRUE),
(DEFAULT, 'Thread Plug Gauge 2B BP (Unified)', TRUE),
(DEFAULT, 'Thread Plug Gauge AP (Metric)', TRUE),
(DEFAULT, 'Thread Plug Gauge AP (Pg Threads)', TRUE),
(DEFAULT, 'Thread Plug Gauge AP (Unified) 3 Starts', TRUE),
(DEFAULT, 'Thread Plug Gauge AP 6H (Metric)', TRUE),
(DEFAULT, 'Thread Plug Gauge BP (Metric)', TRUE),
(DEFAULT, 'Thread Plug Gauge BP (Pg Threads)', TRUE),
(DEFAULT, 'Thread Plug Gauge BP (Unified)', TRUE),
(DEFAULT, 'Thread Plug Gauge DS-(Unified) AP', TRUE),
(DEFAULT, 'Thread Plug Gauge DS-(Unified) BP', TRUE),
(DEFAULT, 'Thread Plug Gauge LH-(Unified) AP', TRUE),
(DEFAULT, 'Thread Plug Gauge LH-(Unified) BP', TRUE),
(DEFAULT, 'Thread Plug Gauge Metric B/P- Left Hand', TRUE),
(DEFAULT, 'Thread Plug Gauge TR D Start AP', TRUE),
(DEFAULT, 'Thread Plug Gauge-AP (Pg Threads)', TRUE),
(DEFAULT, 'Thread Plug Gauge-AP (Unified) 3 Starts', TRUE),
(DEFAULT, 'Thread Plug Gauge-AP-6H (Metric)', TRUE),
(DEFAULT, 'Thread Plug Gauge-BP (Pg Threads)', TRUE),
(DEFAULT, 'Thread Plug Gauge-BP- 3 Starts', TRUE),
(DEFAULT, 'Thread Ring Gauge', TRUE),
(DEFAULT, 'Thread Ring Gauge - WCR for GO & NOGO Plug', TRUE),
(DEFAULT, 'Thread Ring Gauge - WCR for GO Plug', TRUE),
(DEFAULT, 'Thread Ring Gauge - WCR for NOGO Plug', TRUE),
(DEFAULT, 'Thread Ring Gauge - WCR', TRUE),
(DEFAULT, 'Thread Ring Gauge AP (Metric)', TRUE),
(DEFAULT, 'Thread Ring Gauge AP (Unified)', TRUE),
(DEFAULT, 'Thread Ring Gauge (GO & NOGO)', TRUE),
(DEFAULT, 'Thread Ring Gauge (GO)', TRUE),
(DEFAULT, 'Thread Ring Gauge (NOGO)', TRUE),
(DEFAULT, 'Thread Ring Gauge (Taper)', TRUE),
(DEFAULT, 'Thread Ring Gauge 2A AP Unified', TRUE),
(DEFAULT, 'Thread Ring Gauge 2A BP Unified', TRUE),
(DEFAULT, 'Thread Ring Gauge AP Unified 3 Start', TRUE),
(DEFAULT, 'Thread Ring Gauge AP-6g (Metric)', TRUE),
(DEFAULT, 'Thread Ring Gauge BP Metric', TRUE),
(DEFAULT, 'Thread Ring Gauge BP Unified 3 Start', TRUE),
(DEFAULT, 'Thread Ring Gauge BP(Unified)', TRUE),
(DEFAULT, 'Thread Ring Gauge DS - Unified AP', TRUE),
(DEFAULT, 'Thread Ring Gauge DS-Unified BP', TRUE),
(DEFAULT, 'Thread Ring Gauge Set (GO & NOGO)', TRUE),
(DEFAULT, 'Thread Ring Gauges', TRUE),
(DEFAULT, 'Three Point Micrometer', TRUE),
(DEFAULT, 'TL Master', TRUE),
(DEFAULT, 'Torque Wrench', TRUE),
(DEFAULT, 'Torque Wrench - Dial Type', TRUE),
(DEFAULT, 'Torque Wrench - Digital Type', TRUE),
(DEFAULT, 'Tread Depth Gauge - Digital Type', TRUE),
(DEFAULT, 'Trip Bar Gauge', TRUE),
(DEFAULT, 'Trip Bar Gauge (GO & NOGO)', TRUE),
(DEFAULT, 'Try Square', TRUE),
(DEFAULT, 'Ultrasonic Thickness Gauge', TRUE),
(DEFAULT, 'V Block - Magnetic', TRUE),
(DEFAULT, 'V Block - Non Magnetic', TRUE),
(DEFAULT, 'V-Block', TRUE),
(DEFAULT, 'Vernier Caliper', TRUE),
(DEFAULT, 'Vernier Caliper - Dial Type', TRUE),
(DEFAULT, 'Vernier Caliper - Digital Inside Groove Type', TRUE),
(DEFAULT, 'Vernier Caliper - Digital Type', TRUE),
(DEFAULT, 'Vernier Caliper - Digital Type - Gear Tooth Mechanism', TRUE),
(DEFAULT, 'Vernier Caliper - Digital Type - Low Force Mechanism', TRUE),
(DEFAULT, 'Vernier Caliper - Digital Type (Long Jaws)', TRUE),
(DEFAULT, 'Vernier Caliper (B-Type)', TRUE),
(DEFAULT, 'Vernier Depth Gauge', TRUE),
(DEFAULT, 'Vernier Depth Gauge - Dial Type', TRUE),
(DEFAULT, 'Vernier Depth Gauge - Digital Type', TRUE),
(DEFAULT, 'Vibration Meter', TRUE),
(DEFAULT, 'Video Measuring Machine', TRUE),
(DEFAULT, 'Vision Measuring Machine', TRUE),
(DEFAULT, 'Weld Fillet Gauge - Radius Gauge Type Mechanism', TRUE),
(DEFAULT, 'Weld gauge', TRUE),
(DEFAULT, 'Weld Gauge - Digital Type', TRUE),
(DEFAULT, 'Weld Gauge (HI-LO)', TRUE),
(DEFAULT, 'Wet Film Thickness Gauge', TRUE),
(DEFAULT, 'WFT Gauge', TRUE),
(DEFAULT, 'Width Gauge', TRUE);


INSERT INTO public.tbl_material_master(tmm_id, tmm_name, tmm_isenable)
VALUES (DEFAULT, 'Tungsten Carbide', true),
       (DEFAULT, 'Chromium Carbide', true),
       (DEFAULT, 'Ceramic', true),
       (DEFAULT, 'Steel', true),
       (DEFAULT, 'Aluminium', true),
       (DEFAULT, 'Tungsten Carbide & Steel', true),
       (DEFAULT, 'NA', true),
       (DEFAULT, 'Steel & Ceramic', true),
       (DEFAULT, 'Granite', true),
       (DEFAULT, 'Casting', true);


CREATE OR REPLACE FUNCTION public.gen_salt(
	text,
	integer)
    RETURNS text
    LANGUAGE 'c'
    COST 1
    VOLATILE STRICT PARALLEL SAFE 
AS '$libdir/pgcrypto', 'pg_gen_salt_rounds'
;

ALTER TABLE tbl_customer_master
ADD COLUMN tcm_company_name VARCHAR(255) NOT NULL;


CREATE SEQUENCE IF NOT EXISTS public.tbl_email_reminder_ter_id_seq
ALTER TABLE IF EXISTS public.tbl_job_register
    ADD COLUMN tjr_status character varying(255);

CREATE TABLE tbl_measurement_units_master (
   tmum_id integer NOT NULL DEFAULT nextval('tbl_measurement_units_master_tmum_id_seq'::regclass),
    tmum_unit_symbol VARCHAR(20) NOT NULL,
    tmum_isenable BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE SEQUENCE IF NOT EXISTS public.tbl_measurement_units_master_tmum_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER TABLE IF EXISTS public.tbl_job_register
ADD COLUMN tjr_tmum_id INT;

   CREATE TABLE IF NOT EXISTS public.tbl_email_reminder
(
    ter_id integer NOT NULL DEFAULT nextval('tbl_email_reminder_ter_id_seq'::regclass),
    ter_fk_tcm_id integer,
	ter_for_month timestamp without time zone,
    ter_isenable boolean DEFAULT true,
    ter_createdby integer,
    ter_createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ter_updatedby integer,
    ter_updatedat timestamp without time zone,
    CONSTRAINT tbl_email_reminder_pkey PRIMARY KEY (ter_id),
    CONSTRAINT ter_fk_tcm_id_fkey FOREIGN KEY (ter_fk_tcm_id)
        REFERENCES public.tbl_customer_master (tcm_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

ALTER TABLE IF EXISTS public.tbl_job_register
ADD COLUMN tjr_fk_tmum_id INT;


    INSERT INTO tbl_measurement_units_master (tmum_id, tmum_unit_symbol, tmum_isenable) VALUES
(DEFAULT, 'mm', true),
(DEFAULT, 'cm', true),
(DEFAULT, 'm', true),
(DEFAULT, 'km', true),
(DEFAULT, 'in', true),
(DEFAULT, 'ft', true),
(DEFAULT, 'yd', true),
(DEFAULT, 'mi', true),
(DEFAULT, 'mg', true),
(DEFAULT, 'g', true),
(DEFAULT, 'kg', true),
(DEFAULT, 't', true),
(DEFAULT, 'oz', true),
(DEFAULT, 'lb', true),
(DEFAULT, 'mL', true),
(DEFAULT, 'L', true),
(DEFAULT, 'm³', true),
(DEFAULT, '°C', true),
(DEFAULT, '°F', true),
(DEFAULT, 'K', true),
(DEFAULT, 's', true),
(DEFAULT, 'min', true),
(DEFAULT, 'h', true),
(DEFAULT, 'm/s', true),
(DEFAULT, 'km/h', true),
(DEFAULT, 'mph', true),
(DEFAULT, 'J', true),
(DEFAULT, 'kJ', true),
(DEFAULT, 'cal', true),
(DEFAULT, 'W', true),
(DEFAULT, 'kW', true),
(DEFAULT, 'Pa', true),
(DEFAULT, 'bar', true),
(DEFAULT, 'atm', true),
(DEFAULT, 'psi', true),
(DEFAULT, 'A', true),
(DEFAULT, 'V', true),
(DEFAULT, 'Ω', true),
(DEFAULT, 'µ', true),
(DEFAULT, 'cm²', true),
(DEFAULT, 'cm³', true);

-- ALTER TABLE IF EXISTS public.tbl_job_register
-- ADD COLUMN tjr_frequency_month INT;

ALTER TABLE IF EXISTS public.tbl_job_register
ADD COLUMN tjr_frequency_month INT;


ALTER TABLE IF EXISTS public.tbl_job_register
    ADD COLUMN tjr_fk_tmum_lc_resolution_id integer;
    
ALTER TABLE IF EXISTS public.tbl_job_register
    ADD CONSTRAINT tjr_fk_tmum_lc_resolution_id FOREIGN KEY (tjr_fk_tmum_lc_resolution_id)
    REFERENCES public.tbl_measurement_units_master (tmum_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


INSERT INTO tbl_customer_master (
    tcm_contact_person, 
    tcm_company_name, 
    tcm_address, 
    tcm_email, 
    tcm_mobile, 
    tcm_isenable, 
    tcm_createdby, 
    tcm_createdat, 
    tcm_updatedby, 
    tcm_updatedat
) VALUES
('Faith Automation', 'Faith Automation Systems & Tooling Private Limited', 'Gat No.634, Behind Spicer India Limited, Kurli, Chakan, Taluka Khed, Pune - 410 501.', 'abcd@gmail.com', '1234567890', TRUE, 1, NOW(), 1, NOW()),
('Crane Process', 'Crane Process Flow Technologies (India) Pvt Ltd.', 'E7-E8/2, Old MIDC, Satara- 415 004.', 'abcd@gmail.com', '1234567892', TRUE, 1, NOW(), 1, NOW()),
('Alfa Laval', 'Alfa Laval India Private Ltd.', 'Mumbai - Pune Road Dapodi, Pune - 411 012.', 'abcd@gmail.com', '1234567893', TRUE, 1, NOW(), 1, NOW()),
('Ksb', 'KSB LIMITED', 'Plot No A1, Khandala MIDC, Phase-II, Village Kesurdi, Tal Khandala, Dist Satara - 412 802.', 'abcd@gmail.com', '1234567894', TRUE, 1, NOW(), 1, NOW()),
('Shree Vighneshwara', 'Shree Vighneshwara Industries', '58/59, D-II Block, Shed No.7/8, Chinchwad, Pune - 411 019.', 'abcd@gmail.com', '1234567895', TRUE, 1, NOW(), 1, NOW()),
('Sunitha Enterprises', 'SUNITHA ENTERPRISES', 'Plot No. A-11, Shop No.4. "H" Block, Indolink Industrial Premises, Pimpri, Pune - 411 018', 'abcd@gmail.com', '1234567896', TRUE, 1, NOW(), 1, NOW()),
('Shree Industries', 'Shree Industries', 'S-73/1, M.I.D.C., Bhosari, Pune - 411 026.', 'abcd@gmail.com', '1234567897', TRUE, 1, NOW(), 1, NOW()),
('Bloomtech', 'BLOOMTECH', 'S. No. 15, Pandurang Industrial Estate, Nanded Phata, Sinhagad Road, Pune - 411 041.', 'abcd@gmail.com', '1234567898', TRUE, 1, NOW(), 1, NOW()),
('Rahul Enterprises', 'Rahul Enterprises', 'T-106/2, Gala No.10, Rajgurunagar Industrial Estate, M.I.D.C., Bhosari, Pune - 411 026.', 'abcd@gmail.com', '1234567899', TRUE, 1, NOW(), 1, NOW()),
('Shree Ganesh', 'Shree Ganesh Enterprises', 'Sec. No.10, Plot No.4/26, Opp.Times of India, Bhosari, Pune - 411 026', 'abcd@gmail.com', '1234567900', TRUE, 1, NOW(), 1, NOW()),
('Serview Bhosari', 'Serview Enterprises', 'Plot S-184, MIDC, "S" Block, Bhosari, Pune - 411 026', 'abcd@gmail.com', '1234567901', TRUE, 1, NOW(), 1, NOW()),
('Serview Chakan', 'Serview Enterprises', 'Plot No.PAP/V-155, Vasuli, Tal-Khed, Chakan Industrial Area Phase-II, Pune.', 'abcd@gmail.com', '1234567902', TRUE, 1, NOW(), 1, NOW()),
('Acg Pharma', 'ACG Pharma Technologies Pvt Ltd.', 'Plot No.1100, Shirwal, Tal. Khandala, Dist, Satara - 412 801.', 'abcd@gmail.com', '1234567903', TRUE, 1, NOW(), 1, NOW()),
('Versatile', 'Versatile Enterprises', 'T-188/A-8, MIDC, Bhosari, Pune - 411 026.', 'abcd@gmail.com', '1234567904', TRUE, 1, NOW(), 1, NOW()),
('Fori Automation', 'Fori Automation India Private Limited', 'Plot No.34, T Block MIDC, Bhosari, Pune - 411 026.', 'abcd@gmail.com', '1234567904', TRUE, 1, NOW(), 1, NOW());

CREATE TABLE IF NOT EXISTS public.tbl_calibration_lab
(
    tcl_id smallint NOT NULL DEFAULT nextval('tbl_calibration_lab_tcl_id_seq'::regclass),
    tcl_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    tcl_isenable boolean DEFAULT true,
    CONSTRAINT tbl_calibration_lab_pkey PRIMARY KEY (tcl_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_calibration_lab
    OWNER to postgres;

CREATE SEQUENCE IF NOT EXISTS public.tbl_calibration_lab_tcl_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.tbl_calibration_lab_tcl_id_seq
    OWNER TO postgres;    

        INSERT INTO tbl_calibration_lab (tcl_id, tcl_name, tcl_isenable) VALUES
 (1, 'Select the calibration lab', true),       
(2, 'TMC', true),
(3, 'JB Calibrators', true),
(4, 'Mikronix', true),
(5, 'Saraf IDL', true),
(6, 'Accutech', true),
(7, 'Perfect', true),
(8, 'Kushal', true),
(9, 'Kudale', true),
(10, 'N.P.K', true),
(11, 'Accumeasure', true),
(12, 'Caltech Mumbai', true),
(13, 'OCTAQ', true),
(14, 'Universal', true)


ALTER TABLE IF EXISTS public.tbl_job_register
    ADD CONSTRAINT tjr_fk_tcl_id FOREIGN KEY (tjr_fk_tcl_id)
    REFERENCES public.tbl_calibration_lab (tcl_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

    ALTER TABLE IF EXISTS public.tbl_job_register
    RENAME tjr_calibration_lab TO tjr_location;

    CREATE TABLE IF NOT EXISTS public.tbl_job_register
(
    tjr_id integer NOT NULL DEFAULT nextval('tbl_job_register_tjr_id_seq'::regclass),
    tjr_fk_tcm_id integer,
    tjr_fk_tim_id integer,
    tjr_fk_tm_id integer,
    tjr_fk_tmm_id integer,
    tjr_range character varying(50) COLLATE pg_catalog."default" NOT NULL,
    tjr_resolution character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    tjr_srno character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    tjr_customer_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    tjr_modelno character varying(50) COLLATE pg_catalog."default" NOT NULL,
    tjr_grande character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    tjr_customer_challan_no character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    tjr_lab_ref_no character varying(50) COLLATE pg_catalog."default" NOT NULL,
    tjr_labid character varying(50) COLLATE pg_catalog."default" NOT NULL,
    tjr_certificate_no character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    tjr_ulr_no character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    tjr_reciept_date date,
    tjr_calibration_date date,
    tjr_next_calibration_date date,
    tjr_certificate_date date,
    tjr_remark text COLLATE pg_catalog."default",
    tjr_additional_details text COLLATE pg_catalog."default",
    tjr_calibration_lab character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    tjr_isenable boolean DEFAULT true,
    tjr_createdby integer,
    tjr_createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tjr_updatedby integer,
    tjr_updatedat timestamp without time zone,
    tjr_location character varying(255) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    tjr_status character varying(255) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    tjr_frequency_month integer,
    tjr_fk_tcl_id integer,
    CONSTRAINT tbl_job_register_pkey PRIMARY KEY (tjr_id),
    CONSTRAINT tjr_fk_tcl_id FOREIGN KEY (tjr_fk_tcl_id)
        REFERENCES public.tbl_calibration_lab (tcl_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tjr_fk_tcm_id_fkey FOREIGN KEY (tjr_fk_tcm_id)
        REFERENCES public.tbl_customer_master (tcm_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tjr_fk_tim_id_fkey FOREIGN KEY (tjr_fk_tim_id)
        REFERENCES public.tbl_instruments_master (tim_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tjr_fk_tm_id_fkey FOREIGN KEY (tjr_fk_tm_id)
        REFERENCES public.tbl_make_master (tm_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tjr_fk_tmm_id_fkey FOREIGN KEY (tjr_fk_tmm_id)
        REFERENCES public.tbl_material_master (tmm_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_job_register
    OWNER to postgres;
/* ============================================================

VISNDT Repository Documentation Edition 2.0

Document ID:
403

Document Name:
PostgreSQL DDL

File Name:
403_PostgreSQL_DDL.sql

Version:
2.0 Final

Status:
In Progress

Repository:
VISNDT Repository Documentation Edition 2.0


Purpose:

Define PostgreSQL database physical implementation.

This document converts:

399_CanonicalNamingSpecification

401_PostgreSQL_ER_Model

402_PostgreSQL_Table_Specification


into executable PostgreSQL DDL.


Dependency:

402_PostgreSQL_Table_Specification.md


Referenced By:

404_Prisma_Schema_Specification.md

405_prisma.schema

406_Seed_Data_Specification.md

407_Migration_Strategy.md


============================================================ */


/* ============================================================

BLOCK 01

Database Foundation

============================================================ */


/*
==============================================================

1. Database Engine Requirement

==============================================================

Required:

PostgreSQL 17+

Character Encoding:

UTF8

Timezone:

UTC


==============================================================
*/


/*
==============================================================

2. Database Architecture Rules

==============================================================

Architecture:

Single Database

Single Schema


Default Schema:

public


Future Extension:

platform

audit

ai

integration


Current Release:

Only public schema is used.


==============================================================
*/


/*
==============================================================

3. Naming Convention

==============================================================

All database objects:

snake_case


Example:

standard_product

product_parameter_value

organization_contact


Forbidden:

StandardProduct

tbl_product

productTable


==============================================================
*/


/*
==============================================================

4. Primary Key Standard

==============================================================

All tables:

Primary Key:

id


Data Type:

UUID


Generation Strategy:

UUID v7


Example:

id UUID PRIMARY KEY


Business Number:

NOT allowed as primary key.


Example:

VIS-PD-20260001

is NOT primary key.


==============================================================
*/


/*
==============================================================

5. Foreign Key Standard

==============================================================

Foreign key naming:

xxx_id


Examples:

organization_id

product_id

parameter_id


Foreign key:

must reference:

target_table.id


==============================================================
*/


/*
==============================================================

6. Timestamp Standard

==============================================================

All tables:

created_at

updated_at


Data Type:

TIMESTAMP WITH TIME ZONE


Storage:

UTC


==============================================================
*/


/*
==============================================================

7. Soft Delete Standard

==============================================================

All business tables:

deleted_at

deleted_by


Physical DELETE:

Forbidden


Data lifecycle:

Active

↓

Deleted

↓

Archived


==============================================================
*/


/*
==============================================================

8. Optimistic Lock Standard

==============================================================

All business tables:

version


Purpose:

Prevent concurrent update conflicts.


Default:

1


==============================================================
*/


/*
==============================================================

9. Status Field Standard

==============================================================

All business entities:

status


Data Type:

VARCHAR(50)


Status values:

Managed by Application Layer


==============================================================
*/


/* ============================================================

PostgreSQL Extension Initialization

============================================================ */


/*
--------------------------------------------------------------

UUID Support

--------------------------------------------------------------
*/


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


/*
--------------------------------------------------------------

Cryptographic Function Support

--------------------------------------------------------------
*/


CREATE EXTENSION IF NOT EXISTS pgcrypto;


/*
--------------------------------------------------------------

Similarity Search Support

--------------------------------------------------------------

Used By:

AI Domain

Search Domain

--------------------------------------------------------------
*/


CREATE EXTENSION IF NOT EXISTS pg_trgm;


/*
--------------------------------------------------------------

International Search Support

--------------------------------------------------------------
*/


CREATE EXTENSION IF NOT EXISTS unaccent;


/* ============================================================

Schema Initialization

============================================================ */


CREATE SCHEMA IF NOT EXISTS public;


/*
==============================================================

Default Schema

==============================================================

All VISNDT tables are created under:

public


==============================================================
*/


SET search_path TO public;


/* ============================================================

UUID Function

============================================================ */


/*
==============================================================

UUID v7 Function Placeholder

==============================================================

PostgreSQL implementation shall use:

Application generated UUID v7

or

Database UUID v7 function

depending on deployment environment.


This function wrapper keeps:

DDL compatibility

Migration compatibility

==============================================================/* UUID v7 Generation

UUID shall be generated by:

Application Layer

or

PostgreSQL native UUID v7 function
(when officially available)

403 does not implement UUID v7 itself.

*/

NOTE:

The above implementation is a compatibility placeholder.

Production environment:

MUST replace with real UUID v7 implementation.


==============================================================
*/


/* ============================================================

Common Column Definition Reference

============================================================ */


/*
All core business tables follow:


id

business_columns...

status

version

created_at

created_by

updated_at

updated_by

deleted_at

deleted_by


==============================================================
*/


/* ============================================================

DDL Execution Order

============================================================ */


/*
01 Dictionary Domain

02 Product Domain

03 Parameter Domain

04 Capability Domain

05 Feature Domain

06 Organization Domain

07 Offer Domain

08 Knowledge Domain

09 Demand Domain

10 RFQ Domain

11 Workflow Domain

12 File Domain

13 AI Domain

14 User Domain

15 System Domain

16 Foreign Keys

17 Indexes

18 Constraints and Comments


==============================================================
*/


/* ============================================================

END BLOCK 01/18

============================================================ */

/* ============================================================

BEGIN BLOCK 02/18

Dictionary Domain

============================================================ */


/* ============================================================

Table:
dictionary

Canonical Name:
Dictionary

Chinese Name:
数据字典

============================================================ */


/*
Purpose

维护全平台字典分类。

Examples

Country

Currency

Language

Industry

Material

Inspection Method

Certificate

Parameter Unit

Workflow Status

Business Status

Measurement Unit

--------------------------------------------------------------
*/


CREATE TABLE dictionary
(

    id                      UUID                    NOT NULL,
    
    code                    VARCHAR(100)            NOT NULL,
    
    name                    VARCHAR(200)            NOT NULL,
    
    display_name            VARCHAR(200),
    
    description             TEXT,
    
    category                VARCHAR(100),
    
    display_order           INTEGER                 NOT NULL DEFAULT 0,
    
    is_system               BOOLEAN                 NOT NULL DEFAULT FALSE,
    
    is_builtin              BOOLEAN                 NOT NULL DEFAULT FALSE,
    
    status                  VARCHAR(50)             NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER                 NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    
    created_by              UUID,
    
    updated_at              TIMESTAMPTZ,
    
    updated_by              UUID,
    
    deleted_at              TIMESTAMPTZ,
    
    deleted_by              UUID,
    
    CONSTRAINT pk_dictionary
        PRIMARY KEY (id),
    
    CONSTRAINT uq_dictionary_code
        UNIQUE (code)

);


/* ============================================================

COMMENT

============================================================ */


COMMENT ON TABLE dictionary
IS 'Platform Dictionary Category';


COMMENT ON COLUMN dictionary.id
IS 'Primary Key';


COMMENT ON COLUMN dictionary.code
IS 'Unique Dictionary Code';


COMMENT ON COLUMN dictionary.name
IS 'Dictionary Name';


COMMENT ON COLUMN dictionary.display_name
IS 'Display Name';


COMMENT ON COLUMN dictionary.description
IS 'Description';


COMMENT ON COLUMN dictionary.category
IS 'Dictionary Category';


COMMENT ON COLUMN dictionary.display_order
IS 'Display Order';


COMMENT ON COLUMN dictionary.is_system
IS 'System Dictionary';


COMMENT ON COLUMN dictionary.is_builtin
IS 'Built-in Dictionary';


COMMENT ON COLUMN dictionary.status
IS 'Business Status';


COMMENT ON COLUMN dictionary.version
IS 'Optimistic Lock Version';


COMMENT ON COLUMN dictionary.created_at
IS 'Creation Time';


COMMENT ON COLUMN dictionary.updated_at
IS 'Last Update Time';


COMMENT ON COLUMN dictionary.deleted_at
IS 'Logical Delete Time';


/* ============================================================

INDEX

============================================================ */


CREATE INDEX idx_dictionary_status
ON dictionary(status);


CREATE INDEX idx_dictionary_category
ON dictionary(category);


CREATE INDEX idx_dictionary_display_order
ON dictionary(display_order);


CREATE INDEX idx_dictionary_created_at
ON dictionary(created_at);


/* ============================================================

CHECK

============================================================ */


ALTER TABLE dictionary

ADD CONSTRAINT chk_dictionary_display_order

CHECK
(
    display_order >= 0
);



/* ============================================================

Table:
dictionary_item

Canonical Name:
Dictionary Item

Chinese Name:
字典项

============================================================ */


/*
Purpose

维护具体字典值。

Examples

Dictionary

↓

Currency

↓

USD

CNY

EUR

JPY

--------------------------------------------------------------
*/


CREATE TABLE dictionary_item
(

    id                      UUID                    NOT NULL,
    
    dictionary_id           UUID                    NOT NULL,
    
    code                    VARCHAR(100)            NOT NULL,
    
    value                   VARCHAR(300)            NOT NULL,
    
    display_name            VARCHAR(300),
    
    description             TEXT,
    
    parent_item_id          UUID,
    
    display_order           INTEGER                 NOT NULL DEFAULT 0,
    
    color                   VARCHAR(50),
    
    icon                    VARCHAR(300),
    
    locale                  VARCHAR(20),
    
    is_default              BOOLEAN                 NOT NULL DEFAULT FALSE,
    
    is_builtin              BOOLEAN                 NOT NULL DEFAULT FALSE,
    
    status                  VARCHAR(50)             NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER                 NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    
    created_by              UUID,
    
    updated_at              TIMESTAMPTZ,
    
    updated_by              UUID,
    
    deleted_at              TIMESTAMPTZ,
    
    deleted_by              UUID,
    
    CONSTRAINT pk_dictionary_item
        PRIMARY KEY (id),
    
    CONSTRAINT uq_dictionary_item
        UNIQUE
        (
            dictionary_id,
            code
        )

);


/* ============================================================

FOREIGN KEY

============================================================ */


ALTER TABLE dictionary_item

ADD CONSTRAINT fk_dictionary_item_dictionary

FOREIGN KEY (dictionary_id)

REFERENCES dictionary(id);



ALTER TABLE dictionary_item

ADD CONSTRAINT fk_dictionary_item_parent

FOREIGN KEY (parent_item_id)

REFERENCES dictionary_item(id);



/* ============================================================

COMMENT

============================================================ */


COMMENT ON TABLE dictionary_item
IS 'Dictionary Item';


COMMENT ON COLUMN dictionary_item.dictionary_id
IS 'Dictionary Reference';


COMMENT ON COLUMN dictionary_item.parent_item_id
IS 'Parent Dictionary Item';


COMMENT ON COLUMN dictionary_item.code
IS 'Dictionary Item Code';


COMMENT ON COLUMN dictionary_item.value
IS 'Dictionary Value';


COMMENT ON COLUMN dictionary_item.display_name
IS 'Display Name';


COMMENT ON COLUMN dictionary_item.display_order
IS 'Display Order';


COMMENT ON COLUMN dictionary_item.locale
IS 'I18N Locale';


COMMENT ON COLUMN dictionary_item.is_default
IS 'Default Item';


COMMENT ON COLUMN dictionary_item.status
IS 'Business Status';


COMMENT ON COLUMN dictionary_item.version
IS 'Optimistic Lock Version';


/* ============================================================

INDEX

============================================================ */


CREATE INDEX idx_dictionary_item_dictionary

ON dictionary_item(dictionary_id);


CREATE INDEX idx_dictionary_item_status

ON dictionary_item(status);


CREATE INDEX idx_dictionary_item_locale

ON dictionary_item(locale);


CREATE INDEX idx_dictionary_item_display_order

ON dictionary_item(display_order);


CREATE INDEX idx_dictionary_item_parent

ON dictionary_item(parent_item_id);


/* ============================================================

CHECK

============================================================ */


ALTER TABLE dictionary_item

ADD CONSTRAINT chk_dictionary_item_display_order

CHECK
(
    display_order >= 0
);



/* ============================================================

Dictionary Domain Complete

============================================================

Tables

dictionary

dictionary_item

Primary Key

2

Foreign Key

2

Unique Constraint

2

Indexes

9

Check Constraint

2

============================================================ */


/* ============================================================

END BLOCK 02/18

============================================================ */

/* ============================================================

BEGIN BLOCK 03/18

Product Domain (Part 1)

============================================================ */


/* ============================================================

Table:
product_category

Canonical Name:
Product Category

Chinese Name:
产品一级分类

============================================================

Purpose

Platform Product Category.

============================================================ */

CREATE TABLE product_category
(
    id                  UUID            NOT NULL DEFAULT generate_uuid_v7(),

    code                VARCHAR(100)    NOT NULL,
    
    name                VARCHAR(200)    NOT NULL,
    
    display_name        VARCHAR(200),
    
    description         TEXT,
    
    icon                VARCHAR(500),
    
    display_order       INTEGER         NOT NULL DEFAULT 0,
    
    status              VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version             INTEGER         NOT NULL DEFAULT 1,
    
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by          UUID,
    
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by          UUID,
    
    deleted_at          TIMESTAMPTZ,
    
    deleted_by          UUID,
    
    CONSTRAINT pk_product_category
        PRIMARY KEY (id),
    
    CONSTRAINT uq_product_category_code
        UNIQUE (code)
);

CREATE INDEX idx_product_category_status
ON product_category(status);

CREATE INDEX idx_product_category_display_order
ON product_category(display_order);

COMMENT ON TABLE product_category
IS 'Platform Product Category';


/* ============================================================

Table:
product_sub_category

Canonical Name:
Product Sub Category

Chinese Name:
产品二级分类

============================================================ */

CREATE TABLE product_sub_category
(
    id                  UUID            NOT NULL DEFAULT generate_uuid_v7(),

    category_id         UUID            NOT NULL,
    
    code                VARCHAR(100)    NOT NULL,
    
    name                VARCHAR(200)    NOT NULL,
    
    display_name        VARCHAR(200),
    
    description         TEXT,
    
    display_order       INTEGER         NOT NULL DEFAULT 0,
    
    status              VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version             INTEGER         NOT NULL DEFAULT 1,
    
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by          UUID,
    
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by          UUID,
    
    deleted_at          TIMESTAMPTZ,
    
    deleted_by          UUID,
    
    CONSTRAINT pk_product_sub_category
        PRIMARY KEY (id),
    
    CONSTRAINT uq_product_sub_category
        UNIQUE(category_id,code)
);

ALTER TABLE product_sub_category

ADD CONSTRAINT fk_product_sub_category_category

FOREIGN KEY(category_id)

REFERENCES product_category(id);

CREATE INDEX idx_product_sub_category_category
ON product_sub_category(category_id);

CREATE INDEX idx_product_sub_category_status
ON product_sub_category(status);

COMMENT ON TABLE product_sub_category
IS 'Platform Product Sub Category';


/* ============================================================

Table:
product_family

Canonical Name:
Product Family

Chinese Name:
产品族

============================================================ */

CREATE TABLE product_family
(
    id                  UUID            NOT NULL DEFAULT generate_uuid_v7(),

    sub_category_id     UUID            NOT NULL,
    
    code                VARCHAR(100)    NOT NULL,
    
    name                VARCHAR(200)    NOT NULL,
    
    display_name        VARCHAR(200),
    
    description         TEXT,
    
    display_order       INTEGER         NOT NULL DEFAULT 0,
    
    status              VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version             INTEGER         NOT NULL DEFAULT 1,
    
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by          UUID,
    
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by          UUID,
    
    deleted_at          TIMESTAMPTZ,
    
    deleted_by          UUID,
    
    CONSTRAINT pk_product_family
        PRIMARY KEY(id),
    
    CONSTRAINT uq_product_family
        UNIQUE(sub_category_id,code)
);

ALTER TABLE product_family

ADD CONSTRAINT fk_product_family_sub_category

FOREIGN KEY(sub_category_id)

REFERENCES product_sub_category(id);

CREATE INDEX idx_product_family_sub_category
ON product_family(sub_category_id);

CREATE INDEX idx_product_family_status
ON product_family(status);

COMMENT ON TABLE product_family
IS 'Platform Product Family';


/* ============================================================

Table:
product_series

Canonical Name:
Product Series

Chinese Name:
产品系列

============================================================ */

CREATE TABLE product_series
(
    id                  UUID            NOT NULL DEFAULT generate_uuid_v7(),

    family_id           UUID            NOT NULL,
    
    code                VARCHAR(100)    NOT NULL,
    
    name                VARCHAR(200)    NOT NULL,
    
    model_prefix        VARCHAR(100),
    
    description         TEXT,
    
    display_order       INTEGER         NOT NULL DEFAULT 0,
    
    status              VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version             INTEGER         NOT NULL DEFAULT 1,
    
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by          UUID,
    
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by          UUID,
    
    deleted_at          TIMESTAMPTZ,
    
    deleted_by          UUID,
    
    CONSTRAINT pk_product_series
        PRIMARY KEY(id),
    
    CONSTRAINT uq_product_series
        UNIQUE(family_id,code)
);

ALTER TABLE product_series

ADD CONSTRAINT fk_product_series_family

FOREIGN KEY(family_id)

REFERENCES product_family(id);

CREATE INDEX idx_product_series_family
ON product_series(family_id);

CREATE INDEX idx_product_series_status
ON product_series(status);

COMMENT ON TABLE product_series
IS 'Platform Product Series';


/* ============================================================

Product Domain Part 1 Complete

Tables

product_category

product_sub_category

product_family

product_series

============================================================ */


/* ============================================================

END BLOCK 03/18

============================================================ */



/* ============================================================

BEGIN BLOCK 04/18

Product Domain (Part 2)

Core Product Tables

============================================================ */


/* ============================================================

Table:
standard_product

Canonical Name:
Standard Product

Chinese Name:
标准产品

============================================================

Purpose

Platform Master Product.

The only product master entity.

All business modules reference this table.

============================================================ */

CREATE TABLE standard_product
(
    id                          UUID            NOT NULL DEFAULT generate_uuid_v7(),

    series_id                   UUID            NOT NULL,
    
    parameter_template_id        UUID,
    
    code                        VARCHAR(100)    NOT NULL,
    
    sku                         VARCHAR(100),
    
    model                       VARCHAR(200)    NOT NULL,
    
    name                        VARCHAR(300)    NOT NULL,
    
    short_name                  VARCHAR(200),
    
    description                 TEXT,
    
    lifecycle                   VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    publish_status              VARCHAR(50)     NOT NULL DEFAULT 'DRAFT',
    
    current_version             INTEGER         NOT NULL DEFAULT 1,
    
    release_date                DATE,
    
    display_order               INTEGER         NOT NULL DEFAULT 0,
    
    status                      VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                     INTEGER         NOT NULL DEFAULT 1,
    
    created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by                  UUID,
    
    updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by                  UUID,
    
    deleted_at                  TIMESTAMPTZ,
    
    deleted_by                  UUID,
    
    CONSTRAINT pk_standard_product
        PRIMARY KEY(id),
    
    CONSTRAINT uq_standard_product_code
        UNIQUE(code),
    
    CONSTRAINT uq_standard_product_model
        UNIQUE(model)

);

ALTER TABLE standard_product

ADD CONSTRAINT fk_standard_product_series

FOREIGN KEY(series_id)

REFERENCES product_series(id);

CREATE INDEX idx_standard_product_series
ON standard_product(series_id);

CREATE INDEX idx_standard_product_publish
ON standard_product(publish_status);

CREATE INDEX idx_standard_product_status
ON standard_product(status);

COMMENT ON TABLE standard_product
IS 'Platform Standard Product';



/* ============================================================

Table:
product_version

============================================================ */

CREATE TABLE product_version
(

    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),
    
    product_id              UUID            NOT NULL,
    
    version_no              INTEGER         NOT NULL,
    
    version_name            VARCHAR(100),
    
    change_log              TEXT,
    
    released_at             TIMESTAMPTZ,
    
    released_by             UUID,
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    CONSTRAINT pk_product_version
    
        PRIMARY KEY(id),
    
    CONSTRAINT uq_product_version
    
        UNIQUE(product_id,version_no)

);

ALTER TABLE product_version

ADD CONSTRAINT fk_product_version_product

FOREIGN KEY(product_id)

REFERENCES standard_product(id);

CREATE INDEX idx_product_version_product

ON product_version(product_id);

COMMENT ON TABLE product_version

IS 'Product Version History';



/* ============================================================

Table:
product_attachment

============================================================ */

CREATE TABLE product_attachment
(

    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),
    
    product_id              UUID            NOT NULL,
    
    file_object_id          UUID            NOT NULL,
    
    attachment_type         VARCHAR(100),
    
    display_order           INTEGER         NOT NULL DEFAULT 0,
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    CONSTRAINT pk_product_attachment
    
        PRIMARY KEY(id)

);

ALTER TABLE product_attachment

ADD CONSTRAINT fk_product_attachment_product

FOREIGN KEY(product_id)

REFERENCES standard_product(id);

CREATE INDEX idx_product_attachment_product

ON product_attachment(product_id);

COMMENT ON TABLE product_attachment

IS 'Product Attachment';



/* ============================================================

Table:
product_workflow

============================================================ */

CREATE TABLE product_workflow
(

    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),
    
    product_id              UUID            NOT NULL,
    
    workflow_instance_id    UUID            NOT NULL,
    
    workflow_status         VARCHAR(100),
    
    current_node            VARCHAR(200),
    
    started_at              TIMESTAMPTZ,
    
    finished_at             TIMESTAMPTZ,
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pk_product_workflow
    
        PRIMARY KEY(id)

);

ALTER TABLE product_workflow

ADD CONSTRAINT fk_product_workflow_product

FOREIGN KEY(product_id)

REFERENCES standard_product(id);

CREATE INDEX idx_product_workflow_product

ON product_workflow(product_id);

COMMENT ON TABLE product_workflow

IS 'Product Workflow';



/* ============================================================

Table:
product_audit

============================================================ */

CREATE TABLE product_audit
(

    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),
    
    product_id              UUID            NOT NULL,
    
    audit_type              VARCHAR(100),
    
    operator_id             UUID,
    
    operation               VARCHAR(100),
    
    before_data             JSONB,
    
    after_data              JSONB,
    
    audit_time              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    CONSTRAINT pk_product_audit
    
        PRIMARY KEY(id)

);

ALTER TABLE product_audit

ADD CONSTRAINT fk_product_audit_product

FOREIGN KEY(product_id)

REFERENCES standard_product(id);

CREATE INDEX idx_product_audit_product

ON product_audit(product_id);

CREATE INDEX idx_product_audit_time

ON product_audit(audit_time);

COMMENT ON TABLE product_audit

IS 'Product Audit History';



/* ============================================================

Product Domain Complete

Current Tables

product_category

product_sub_category

product_family

product_series

standard_product

product_version

product_attachment

product_workflow

product_audit

============================================================ */


/* ============================================================

END BLOCK 04/18

============================================================ */

/* ============================================================

BEGIN BLOCK 05/18

Parameter Domain

============================================================ */


/* ============================================================

Table:
parameter_group

Canonical Name:
Parameter Group

Chinese Name:
参数分组

============================================================ */

CREATE TABLE parameter_group
(
    id                  UUID            NOT NULL DEFAULT generate_uuid_v7(),

    code                VARCHAR(100)    NOT NULL,
    
    name                VARCHAR(200)    NOT NULL,
    
    display_name        VARCHAR(200),
    
    description         TEXT,
    
    display_order       INTEGER         NOT NULL DEFAULT 0,
    
    status              VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version             INTEGER         NOT NULL DEFAULT 1,
    
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by          UUID,
    
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by          UUID,
    
    deleted_at          TIMESTAMPTZ,
    
    deleted_by          UUID,
    
    CONSTRAINT pk_parameter_group
        PRIMARY KEY(id),
    
    CONSTRAINT uq_parameter_group_code
        UNIQUE(code)

);

CREATE INDEX idx_parameter_group_status
ON parameter_group(status);

CREATE INDEX idx_parameter_group_display_order
ON parameter_group(display_order);

COMMENT ON TABLE parameter_group
IS 'Platform Parameter Group';



/* ============================================================

Table:
parameter_definition

============================================================ */

CREATE TABLE parameter_definition
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    group_id                UUID            NOT NULL,
    
    code                    VARCHAR(120)    NOT NULL,
    
    chinese_name            VARCHAR(300)    NOT NULL,
    
    english_name            VARCHAR(300),
    
    description             TEXT,
    
    value_type              VARCHAR(80)     NOT NULL,
    
    unit                    VARCHAR(80),
    
    validation_rule         TEXT,
    
    required                BOOLEAN         NOT NULL DEFAULT FALSE,
    
    searchable              BOOLEAN         NOT NULL DEFAULT TRUE,
    
    filterable              BOOLEAN         NOT NULL DEFAULT TRUE,
    
    sortable                BOOLEAN         NOT NULL DEFAULT FALSE,
    
    comparable              BOOLEAN         NOT NULL DEFAULT TRUE,
    
    ai_enabled              BOOLEAN         NOT NULL DEFAULT TRUE,
    
    display_order           INTEGER         NOT NULL DEFAULT 0,
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pk_parameter_definition
        PRIMARY KEY(id),
    
    CONSTRAINT uq_parameter_definition_code
        UNIQUE(code)

);

ALTER TABLE parameter_definition

ADD CONSTRAINT fk_parameter_definition_group

FOREIGN KEY(group_id)

REFERENCES parameter_group(id);

CREATE INDEX idx_parameter_definition_group
ON parameter_definition(group_id);

CREATE INDEX idx_parameter_definition_searchable
ON parameter_definition(searchable);

CREATE INDEX idx_parameter_definition_filterable
ON parameter_definition(filterable);

COMMENT ON TABLE parameter_definition
IS 'Platform Parameter Definition';



/* ============================================================

Table:
parameter_template

============================================================ */

CREATE TABLE parameter_template
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    code                    VARCHAR(100)    NOT NULL,
    
    name                    VARCHAR(200)    NOT NULL,
    
    product_category_id     UUID,
    
    product_family_id       UUID,
    
    description             TEXT,
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pk_parameter_template
        PRIMARY KEY(id),
    
    CONSTRAINT uq_parameter_template_code
        UNIQUE(code)

);

CREATE INDEX idx_parameter_template_status
ON parameter_template(status);

COMMENT ON TABLE parameter_template
IS 'Platform Parameter Template';



/* ============================================================

Table:
parameter_template_item

============================================================ */

CREATE TABLE parameter_template_item
(
    id                          UUID            NOT NULL DEFAULT generate_uuid_v7(),

    template_id                 UUID            NOT NULL,
    
    parameter_definition_id     UUID            NOT NULL,
    
    display_order               INTEGER         NOT NULL DEFAULT 0,
    
    inherited                   BOOLEAN         NOT NULL DEFAULT TRUE,
    
    required                    BOOLEAN         NOT NULL DEFAULT FALSE,
    
    editable                    BOOLEAN         NOT NULL DEFAULT TRUE,
    
    visible                     BOOLEAN         NOT NULL DEFAULT TRUE,
    
    default_value               TEXT,
    
    status                      VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                     INTEGER         NOT NULL DEFAULT 1,
    
    created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pk_parameter_template_item
        PRIMARY KEY(id),
    
    CONSTRAINT uq_parameter_template_item
        UNIQUE(template_id,parameter_definition_id)

);

ALTER TABLE parameter_template_item

ADD CONSTRAINT fk_parameter_template_item_template

FOREIGN KEY(template_id)

REFERENCES parameter_template(id);

ALTER TABLE parameter_template_item

ADD CONSTRAINT fk_parameter_template_item_definition

FOREIGN KEY(parameter_definition_id)

REFERENCES parameter_definition(id);

CREATE INDEX idx_parameter_template_item_template
ON parameter_template_item(template_id);

COMMENT ON TABLE parameter_template_item
IS 'Parameter Template Item';



/* ============================================================

Table:
product_parameter_value

============================================================ */

CREATE TABLE product_parameter_value
(
    id                          UUID            NOT NULL DEFAULT generate_uuid_v7(),

    product_id                  UUID            NOT NULL,
    
    parameter_definition_id     UUID            NOT NULL,
    
    value_text                  TEXT,
    
    value_number                NUMERIC(30,8),
    
    value_boolean               BOOLEAN,
    
    value_json                  JSONB,
    
    display_value               VARCHAR(500),
    
    status                      VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                     INTEGER         NOT NULL DEFAULT 1,
    
    created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pk_product_parameter_value
        PRIMARY KEY(id),
    
    CONSTRAINT uq_product_parameter_value
        UNIQUE(product_id,parameter_definition_id)

);

ALTER TABLE product_parameter_value

ADD CONSTRAINT fk_product_parameter_value_product

FOREIGN KEY(product_id)

REFERENCES standard_product(id);

ALTER TABLE product_parameter_value

ADD CONSTRAINT fk_product_parameter_value_definition

FOREIGN KEY(parameter_definition_id)

REFERENCES parameter_definition(id);

CREATE INDEX idx_product_parameter_value_product
ON product_parameter_value(product_id);

CREATE INDEX idx_product_parameter_value_definition
ON product_parameter_value(parameter_definition_id);

COMMENT ON TABLE product_parameter_value
IS 'Product Parameter Value';



/* ============================================================

Parameter Domain Complete

Tables

parameter_group

parameter_definition

parameter_template

parameter_template_item

product_parameter_value

============================================================ */


/* ============================================================

END BLOCK 05/18

============================================================ */

/* ============================================================

BEGIN BLOCK 06/18

Capability & Feature Domain

============================================================ */


/* ============================================================

Table:
capability_definition

Canonical Name:
Capability Definition

Chinese Name:
能力定义

============================================================

Purpose

Platform unified capability library.

============================================================ */

CREATE TABLE capability_definition
(
    id                  UUID            NOT NULL DEFAULT generate_uuid_v7(),

    code                VARCHAR(100)    NOT NULL,
    
    name                VARCHAR(200)    NOT NULL,
    
    display_name        VARCHAR(200),
    
    category            VARCHAR(100),
    
    description         TEXT,
    
    keywords            TEXT,
    
    synonyms            TEXT,
    
    search_weight       NUMERIC(6,2)    NOT NULL DEFAULT 1.00,
    
    ai_weight           NUMERIC(6,2)    NOT NULL DEFAULT 1.00,
    
    display_order       INTEGER         NOT NULL DEFAULT 0,
    
    status              VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version             INTEGER         NOT NULL DEFAULT 1,
    
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by          UUID,
    
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by          UUID,
    
    deleted_at          TIMESTAMPTZ,
    
    deleted_by          UUID,
    
    CONSTRAINT pk_capability_definition
        PRIMARY KEY(id),
    
    CONSTRAINT uq_capability_definition_code
        UNIQUE(code)

);

CREATE INDEX idx_capability_definition_status
ON capability_definition(status);

CREATE INDEX idx_capability_definition_category
ON capability_definition(category);

COMMENT ON TABLE capability_definition
IS 'Platform Capability Definition';



/* ============================================================

Table:
product_capability

============================================================ */

CREATE TABLE product_capability
(
    id                          UUID            NOT NULL DEFAULT generate_uuid_v7(),

    product_id                  UUID            NOT NULL,
    
    capability_definition_id    UUID            NOT NULL,
    
    capability_level            VARCHAR(100),
    
    display_order               INTEGER         NOT NULL DEFAULT 0,
    
    status                      VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                     INTEGER         NOT NULL DEFAULT 1,
    
    created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by                  UUID,
    
    updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by                  UUID,
    
    CONSTRAINT pk_product_capability
        PRIMARY KEY(id),
    
    CONSTRAINT uq_product_capability
        UNIQUE(product_id, capability_definition_id)

);

ALTER TABLE product_capability
ADD CONSTRAINT fk_product_capability_product
FOREIGN KEY(product_id)
REFERENCES standard_product(id);

ALTER TABLE product_capability
ADD CONSTRAINT fk_product_capability_definition
FOREIGN KEY(capability_definition_id)
REFERENCES capability_definition(id);

CREATE INDEX idx_product_capability_product
ON product_capability(product_id);

CREATE INDEX idx_product_capability_definition
ON product_capability(capability_definition_id);

COMMENT ON TABLE product_capability
IS 'Product Capability Mapping';



/* ============================================================

Table:
feature_definition

Canonical Name:
Feature Definition

Chinese Name:
功能定义

============================================================ */

CREATE TABLE feature_definition
(
    id                  UUID            NOT NULL DEFAULT generate_uuid_v7(),

    code                VARCHAR(100)    NOT NULL,
    
    name                VARCHAR(200)    NOT NULL,
    
    display_name        VARCHAR(200),
    
    category            VARCHAR(100),
    
    description         TEXT,
    
    keywords            TEXT,
    
    display_order       INTEGER         NOT NULL DEFAULT 0,
    
    status              VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version             INTEGER         NOT NULL DEFAULT 1,
    
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by          UUID,
    
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by          UUID,
    
    deleted_at          TIMESTAMPTZ,
    
    deleted_by          UUID,
    
    CONSTRAINT pk_feature_definition
        PRIMARY KEY(id),
    
    CONSTRAINT uq_feature_definition_code
        UNIQUE(code)

);

CREATE INDEX idx_feature_definition_status
ON feature_definition(status);

CREATE INDEX idx_feature_definition_category
ON feature_definition(category);

COMMENT ON TABLE feature_definition
IS 'Platform Feature Definition';



/* ============================================================

Table:
product_feature

============================================================ */

CREATE TABLE product_feature
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    product_id              UUID            NOT NULL,
    
    feature_definition_id   UUID            NOT NULL,
    
    firmware_version        VARCHAR(100),
    
    software_version        VARCHAR(100),
    
    license_required        BOOLEAN         NOT NULL DEFAULT FALSE,
    
    enabled                 BOOLEAN         NOT NULL DEFAULT TRUE,
    
    display_order           INTEGER         NOT NULL DEFAULT 0,
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by              UUID,
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by              UUID,
    
    CONSTRAINT pk_product_feature
        PRIMARY KEY(id),
    
    CONSTRAINT uq_product_feature
        UNIQUE(product_id, feature_definition_id)

);

ALTER TABLE product_feature
ADD CONSTRAINT fk_product_feature_product
FOREIGN KEY(product_id)
REFERENCES standard_product(id);

ALTER TABLE product_feature
ADD CONSTRAINT fk_product_feature_definition
FOREIGN KEY(feature_definition_id)
REFERENCES feature_definition(id);

CREATE INDEX idx_product_feature_product
ON product_feature(product_id);

CREATE INDEX idx_product_feature_definition
ON product_feature(feature_definition_id);

COMMENT ON TABLE product_feature
IS 'Product Feature Mapping';



/* ============================================================

Capability & Feature Domain Complete

Tables

capability_definition
product_capability

feature_definition
product_feature

============================================================ */


/* ============================================================

END BLOCK 06/18

============================================================ */

/* ============================================================

BEGIN BLOCK 07/18

Organization Domain

============================================================ */


/* ============================================================

Table:
organization

Canonical Name:
Organization

Chinese Name:
组织

============================================================ */

CREATE TABLE organization
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    code                    VARCHAR(100)    NOT NULL,
    
    organization_name       VARCHAR(300)    NOT NULL,
    
    short_name              VARCHAR(200),
    
    organization_type       VARCHAR(100)    NOT NULL,
    
    legal_person            VARCHAR(200),
    
    unified_social_credit   VARCHAR(100),
    
    tax_number              VARCHAR(100),
    
    website                 VARCHAR(500),
    
    email                   VARCHAR(300),
    
    phone                   VARCHAR(100),
    
    logo_file_id            UUID,
    
    introduction            TEXT,
    
    country                 VARCHAR(100),
    
    province                VARCHAR(100),
    
    city                    VARCHAR(100),
    
    district                VARCHAR(100),
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by              UUID,
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by              UUID,
    
    deleted_at              TIMESTAMPTZ,
    
    deleted_by              UUID,
    
    CONSTRAINT pk_organization
        PRIMARY KEY(id),
    
    CONSTRAINT uq_organization_code
        UNIQUE(code)

);

CREATE INDEX idx_organization_type
ON organization(organization_type);

CREATE INDEX idx_organization_status
ON organization(status);

CREATE INDEX idx_organization_name
ON organization(organization_name);

COMMENT ON TABLE organization
IS 'Organization Master';



/* ============================================================

Table:
organization_contact

============================================================ */

CREATE TABLE organization_contact
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    organization_id         UUID            NOT NULL,
    
    contact_name            VARCHAR(200)    NOT NULL,
    
    title                   VARCHAR(200),
    
    department              VARCHAR(200),
    
    mobile                  VARCHAR(100),
    
    telephone               VARCHAR(100),
    
    email                   VARCHAR(300),
    
    wechat                  VARCHAR(200),
    
    whatsapp                VARCHAR(200),
    
    is_primary              BOOLEAN         NOT NULL DEFAULT FALSE,
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pk_organization_contact
        PRIMARY KEY(id)

);

ALTER TABLE organization_contact

ADD CONSTRAINT fk_organization_contact

FOREIGN KEY(organization_id)

REFERENCES organization(id);

CREATE INDEX idx_organization_contact_org
ON organization_contact(organization_id);

COMMENT ON TABLE organization_contact
IS 'Organization Contact';



/* ============================================================

Table:
organization_address

============================================================ */

CREATE TABLE organization_address
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    organization_id         UUID            NOT NULL,
    
    address_type            VARCHAR(100),
    
    country                 VARCHAR(100),
    
    province                VARCHAR(100),
    
    city                    VARCHAR(100),
    
    district                VARCHAR(100),
    
    postal_code             VARCHAR(50),
    
    address                 TEXT,
    
    is_default              BOOLEAN         NOT NULL DEFAULT FALSE,
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pk_organization_address
        PRIMARY KEY(id)

);

ALTER TABLE organization_address

ADD CONSTRAINT fk_organization_address

FOREIGN KEY(organization_id)

REFERENCES organization(id);

CREATE INDEX idx_organization_address_org
ON organization_address(organization_id);

COMMENT ON TABLE organization_address
IS 'Organization Address';



/* ============================================================

Table:
organization_attachment

============================================================ */

CREATE TABLE organization_attachment
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    organization_id         UUID            NOT NULL,
    
    file_object_id          UUID            NOT NULL,
    
    attachment_type         VARCHAR(100),
    
    display_order           INTEGER         NOT NULL DEFAULT 0,
    
    remark                  TEXT,
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pk_organization_attachment
        PRIMARY KEY(id)

);

ALTER TABLE organization_attachment

ADD CONSTRAINT fk_organization_attachment_org

FOREIGN KEY(organization_id)

REFERENCES organization(id);

CREATE INDEX idx_organization_attachment_org
ON organization_attachment(organization_id);

COMMENT ON TABLE organization_attachment
IS 'Organization Attachment';



/* ============================================================

Organization Domain Complete

Tables

organization
organization_contact
organization_address
organization_attachment

============================================================ */


/* ============================================================

END BLOCK 07/18

============================================================ */

/* ============================================================

BEGIN BLOCK 08/18

Offer Domain

============================================================ */


/* ============================================================

Table:
offer

Canonical Name:
Offer

Chinese Name:
产品供给

============================================================

Purpose

Organization commercial offering of Standard Product.

Relationship:

Organization

        +

Standard Product

        ↓

Offer


Offer stores commercial information only.

Technical parameters remain in Product Domain.

============================================================ */

CREATE TABLE offer
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    organization_id         UUID            NOT NULL,
    
    product_id              UUID            NOT NULL,
    
    offer_code              VARCHAR(120)    NOT NULL,
    
    title                   VARCHAR(300),
    
    sales_status            VARCHAR(50)     NOT NULL DEFAULT 'DRAFT',
    
    region                  VARCHAR(200),
    
    moq                     INTEGER,
    
    lead_time_days          INTEGER,
    
    supports_oem            BOOLEAN         NOT NULL DEFAULT FALSE,
    
    supports_odm            BOOLEAN         NOT NULL DEFAULT FALSE,
    
    customization_available BOOLEAN         NOT NULL DEFAULT FALSE,
    
    recommended              BOOLEAN         NOT NULL DEFAULT FALSE,
    
    description             TEXT,
    
    published_at             TIMESTAMPTZ,
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by              UUID,
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by              UUID,
    
    deleted_at              TIMESTAMPTZ,
    
    deleted_by              UUID,


    CONSTRAINT pk_offer
    
        PRIMARY KEY(id),


    CONSTRAINT uq_offer_code
    
        UNIQUE(offer_code)

);


ALTER TABLE offer

ADD CONSTRAINT fk_offer_organization

FOREIGN KEY(organization_id)

REFERENCES organization(id);



ALTER TABLE offer

ADD CONSTRAINT fk_offer_product

FOREIGN KEY(product_id)

REFERENCES standard_product(id);



CREATE INDEX idx_offer_organization

ON offer(organization_id);



CREATE INDEX idx_offer_product

ON offer(product_id);



CREATE INDEX idx_offer_status

ON offer(sales_status);



COMMENT ON TABLE offer

IS 'Organization Product Offer';



/* ============================================================

Table:
offer_price

============================================================ */


CREATE TABLE offer_price
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    offer_id                UUID            NOT NULL,


    price_type              VARCHAR(100)    NOT NULL,


    amount                  NUMERIC(18,2)   NOT NULL,


    currency                VARCHAR(20)     NOT NULL DEFAULT 'CNY',


    min_quantity            INTEGER,


    max_quantity            INTEGER,


    effective_from          DATE,


    effective_to            DATE,


    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',


    version                 INTEGER         NOT NULL DEFAULT 1,


    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    CONSTRAINT pk_offer_price
    
        PRIMARY KEY(id)

);



ALTER TABLE offer_price

ADD CONSTRAINT fk_offer_price_offer

FOREIGN KEY(offer_id)

REFERENCES offer(id);



CREATE INDEX idx_offer_price_offer

ON offer_price(offer_id);



CREATE INDEX idx_offer_price_effective

ON offer_price(effective_from,effective_to);



COMMENT ON TABLE offer_price

IS 'Offer Price Version';



/* ============================================================

Table:
offer_inventory

============================================================ */


CREATE TABLE offer_inventory
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    offer_id                UUID            NOT NULL,


    warehouse               VARCHAR(200),


    available_quantity       INTEGER         NOT NULL DEFAULT 0,


    reserved_quantity        INTEGER         NOT NULL DEFAULT 0,


    safety_stock             INTEGER         NOT NULL DEFAULT 0,


    inventory_status         VARCHAR(50),


    last_sync_time           TIMESTAMPTZ,


    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',


    version                 INTEGER         NOT NULL DEFAULT 1,


    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    CONSTRAINT pk_offer_inventory
    
        PRIMARY KEY(id)

);



ALTER TABLE offer_inventory

ADD CONSTRAINT fk_offer_inventory_offer

FOREIGN KEY(offer_id)

REFERENCES offer(id);



CREATE INDEX idx_offer_inventory_offer

ON offer_inventory(offer_id);



COMMENT ON TABLE offer_inventory

IS 'Offer Inventory';



/* ============================================================

Table:
offer_service

============================================================ */


CREATE TABLE offer_service
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    offer_id                UUID            NOT NULL,


    warranty_period         VARCHAR(100),


    repair_cycle            VARCHAR(100),


    remote_support          BOOLEAN         NOT NULL DEFAULT FALSE,


    onsite_service          BOOLEAN         NOT NULL DEFAULT FALSE,


    training_available      BOOLEAN         NOT NULL DEFAULT FALSE,


    upgrade_support         BOOLEAN         NOT NULL DEFAULT FALSE,


    service_description     TEXT,


    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',


    version                 INTEGER         NOT NULL DEFAULT 1,


    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    CONSTRAINT pk_offer_service
    
        PRIMARY KEY(id)

);



ALTER TABLE offer_service

ADD CONSTRAINT fk_offer_service_offer

FOREIGN KEY(offer_id)

REFERENCES offer(id);



CREATE INDEX idx_offer_service_offer

ON offer_service(offer_id);



COMMENT ON TABLE offer_service

IS 'Offer Service Information';



/* ============================================================

Table:
offer_attachment

============================================================ */


CREATE TABLE offer_attachment
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    offer_id                UUID            NOT NULL,


    file_object_id          UUID            NOT NULL,


    attachment_type         VARCHAR(100),


    display_order           INTEGER         NOT NULL DEFAULT 0,


    remark                  TEXT,


    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',


    version                 INTEGER         NOT NULL DEFAULT 1,


    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    CONSTRAINT pk_offer_attachment
    
        PRIMARY KEY(id)

);



ALTER TABLE offer_attachment

ADD CONSTRAINT fk_offer_attachment_offer

FOREIGN KEY(offer_id)

REFERENCES offer(id);



CREATE INDEX idx_offer_attachment_offer

ON offer_attachment(offer_id);



COMMENT ON TABLE offer_attachment

IS 'Offer Attachment';



/* ============================================================

Offer Domain Complete

Tables

offer

offer_price

offer_inventory

offer_service

offer_attachment


Business Relationship:

organization

        |
    
        ▼

offer

        |
    
        ▼

standard_product


============================================================ */


/* ============================================================

END BLOCK 08/18

============================================================ */

/* ============================================================

BEGIN BLOCK 09/18

Knowledge Domain

============================================================ */


/* ============================================================

Table:
knowledge

Canonical Name:
Knowledge

Chinese Name:
知识库

============================================================

Purpose

Platform knowledge content management.

Knowledge provides:

- Product documents
- Application cases
- Technical articles
- Training materials
- FAQ
- Detection solutions


Knowledge belongs to Platform.

It does not store:

- Offer
- Price
- Inventory
- Supplier commercial data

============================================================ */


CREATE TABLE knowledge
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    knowledge_code          VARCHAR(120)    NOT NULL,


    title                   VARCHAR(500)    NOT NULL,


    knowledge_type          VARCHAR(100)    NOT NULL,


    summary                 TEXT,


    content                 TEXT,


    language                VARCHAR(50)     DEFAULT 'zh-CN',


    source_type             VARCHAR(100),


    author_id               UUID,


    publish_status          VARCHAR(50)     NOT NULL DEFAULT 'DRAFT',


    published_at            TIMESTAMPTZ,


    search_enabled          BOOLEAN         NOT NULL DEFAULT TRUE,


    ai_enabled              BOOLEAN         NOT NULL DEFAULT TRUE,


    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',


    version                 INTEGER         NOT NULL DEFAULT 1,


    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    created_by              UUID,


    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    updated_by              UUID,


    deleted_at              TIMESTAMPTZ,


    deleted_by              UUID,


    CONSTRAINT pk_knowledge
    
        PRIMARY KEY(id),


    CONSTRAINT uq_knowledge_code
    
        UNIQUE(knowledge_code)

);



CREATE INDEX idx_knowledge_type

ON knowledge(knowledge_type);



CREATE INDEX idx_knowledge_status

ON knowledge(status);



CREATE INDEX idx_knowledge_publish_status

ON knowledge(publish_status);



COMMENT ON TABLE knowledge

IS 'Platform Knowledge Base';



/* ============================================================

Table:
knowledge_attachment

============================================================ */


CREATE TABLE knowledge_attachment
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    knowledge_id            UUID            NOT NULL,


    file_object_id          UUID            NOT NULL,


    attachment_type         VARCHAR(100),


    display_order           INTEGER         NOT NULL DEFAULT 0,


    remark                  TEXT,


    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',


    version                 INTEGER         NOT NULL DEFAULT 1,


    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    CONSTRAINT pk_knowledge_attachment
    
        PRIMARY KEY(id)

);



ALTER TABLE knowledge_attachment

ADD CONSTRAINT fk_knowledge_attachment_knowledge

FOREIGN KEY(knowledge_id)

REFERENCES knowledge(id);



CREATE INDEX idx_knowledge_attachment_knowledge

ON knowledge_attachment(knowledge_id);



COMMENT ON TABLE knowledge_attachment

IS 'Knowledge File Mapping';



/* ============================================================

Table:
product_knowledge_mapping

Canonical Name:
Product Knowledge Mapping

Chinese Name:
产品知识关联

============================================================ */


CREATE TABLE product_knowledge_mapping
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    product_id              UUID            NOT NULL,


    knowledge_id            UUID            NOT NULL,


    relation_type            VARCHAR(100),


    relevance_score          NUMERIC(6,2),


    display_order            INTEGER         NOT NULL DEFAULT 0,


    status                   VARCHAR(50)    NOT NULL DEFAULT 'ACTIVE',


    version                  INTEGER        NOT NULL DEFAULT 1,


    created_at               TIMESTAMPTZ    NOT NULL DEFAULT NOW(),


    created_by               UUID,


    updated_at               TIMESTAMPTZ    NOT NULL DEFAULT NOW(),


    updated_by               UUID,


    CONSTRAINT pk_product_knowledge_mapping
    
        PRIMARY KEY(id),


    CONSTRAINT uq_product_knowledge_mapping
    
        UNIQUE(product_id, knowledge_id)

);



ALTER TABLE product_knowledge_mapping

ADD CONSTRAINT fk_product_knowledge_product

FOREIGN KEY(product_id)

REFERENCES standard_product(id);



ALTER TABLE product_knowledge_mapping

ADD CONSTRAINT fk_product_knowledge_knowledge

FOREIGN KEY(knowledge_id)

REFERENCES knowledge(id);



CREATE INDEX idx_product_knowledge_product

ON product_knowledge_mapping(product_id);



CREATE INDEX idx_product_knowledge_knowledge

ON product_knowledge_mapping(knowledge_id);



COMMENT ON TABLE product_knowledge_mapping

IS 'Product Knowledge Relation';



/* ============================================================

Knowledge Domain Complete


Tables:

knowledge

knowledge_attachment

product_knowledge_mapping


Business Relationship:


standard_product

        │
    
        ▼

product_knowledge_mapping

        │
    
        ▼

knowledge


Knowledge

        │
    
        ▼

File Object


============================================================ */


/* ============================================================

END BLOCK 09/18

============================================================ */

/* ============================================================

BEGIN BLOCK 10/18

Demand Domain

============================================================ */


/* ============================================================

Table:
demand

Canonical Name:
Demand

Chinese Name:
需求

============================================================

Purpose

Manage user business requirements.

Demand is the beginning point of platform business flow.


Business Flow:


Demand

    ↓

AI Analysis

    ↓

Product Recommendation

    ↓

Offer Recommendation

    ↓

RFQ


Demand stores requirement facts only.

It does not store:

- Supplier
- Price
- Inventory
- Quotation


============================================================ */


CREATE TABLE demand
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    demand_code             VARCHAR(120)    NOT NULL,


    title                   VARCHAR(500)    NOT NULL,


    source_type             VARCHAR(100),


    customer_name           VARCHAR(300),


    industry                VARCHAR(200),


    application_scene       TEXT,


    inspection_object       TEXT,


    requirement_description TEXT,


    budget_min              NUMERIC(18,2),


    budget_max              NUMERIC(18,2),


    currency                VARCHAR(20),


    quantity                INTEGER,


    delivery_requirement    TEXT,


    delivery_location       VARCHAR(300),


    contact_name            VARCHAR(200),


    contact_phone           VARCHAR(100),


    contact_email           VARCHAR(300),


    ai_analysis_status      VARCHAR(50)
                            DEFAULT 'PENDING',


    workflow_status         VARCHAR(50)
                            DEFAULT 'DRAFT',


    status                  VARCHAR(50)
                            DEFAULT 'ACTIVE',


    version                 INTEGER
                            NOT NULL DEFAULT 1,


    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    created_by              UUID,


    updated_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    updated_by              UUID,


    deleted_at              TIMESTAMPTZ,


    deleted_by              UUID,


    CONSTRAINT pk_demand
    
        PRIMARY KEY(id),


    CONSTRAINT uq_demand_code
    
        UNIQUE(demand_code)

);



CREATE INDEX idx_demand_status

ON demand(status);



CREATE INDEX idx_demand_industry

ON demand(industry);



CREATE INDEX idx_demand_source

ON demand(source_type);



COMMENT ON TABLE demand

IS 'Customer Demand';



/* ============================================================

Table:
demand_item

Canonical Name:
Demand Item

Chinese Name:
需求明细项

============================================================

Purpose

Support complex requirements.

Example:


Demand:

Aircraft Engine Inspection


Items:

Combustion Chamber

Compressor

Blade


============================================================ */


CREATE TABLE demand_item
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    demand_id               UUID            NOT NULL,


    item_name               VARCHAR(300)
                            NOT NULL,


    item_description        TEXT,


    inspection_object       VARCHAR(300),


    quantity                INTEGER,


    priority                VARCHAR(50),


    status                  VARCHAR(50)
                            DEFAULT 'ACTIVE',


    version                 INTEGER
                            NOT NULL DEFAULT 1,


    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    created_by              UUID,


    updated_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    updated_by              UUID,


    CONSTRAINT pk_demand_item
    
        PRIMARY KEY(id)

);



ALTER TABLE demand_item

ADD CONSTRAINT fk_demand_item_demand

FOREIGN KEY(demand_id)

REFERENCES demand(id);



CREATE INDEX idx_demand_item_demand

ON demand_item(demand_id);



COMMENT ON TABLE demand_item

IS 'Demand Requirement Item';



/* ============================================================

Table:
demand_attachment

============================================================ */


CREATE TABLE demand_attachment
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    demand_id               UUID            NOT NULL,


    file_object_id          UUID            NOT NULL,


    attachment_type         VARCHAR(100),


    display_order           INTEGER
                            DEFAULT 0,


    remark                  TEXT,


    status                  VARCHAR(50)
                            DEFAULT 'ACTIVE',


    version                 INTEGER
                            DEFAULT 1,


    created_at              TIMESTAMPTZ
                            DEFAULT NOW(),


    updated_at              TIMESTAMPTZ
                            DEFAULT NOW(),


    CONSTRAINT pk_demand_attachment
    
        PRIMARY KEY(id)

);



ALTER TABLE demand_attachment

ADD CONSTRAINT fk_demand_attachment_demand

FOREIGN KEY(demand_id)

REFERENCES demand(id);



CREATE INDEX idx_demand_attachment_demand

ON demand_attachment(demand_id);



COMMENT ON TABLE demand_attachment

IS 'Demand File Attachment';



/* ============================================================

Table:
demand_recommendation

Canonical Name:
Demand Recommendation

Chinese Name:
需求推荐

============================================================

Purpose

Store AI recommendation results.


AI generates recommendation.

AI does not modify Demand.


============================================================ */


CREATE TABLE demand_recommendation
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    demand_id               UUID            NOT NULL,


    product_id              UUID,


    offer_id                UUID,


    recommendation_type     VARCHAR(100),


    recommendation_reason   TEXT,


    score                   NUMERIC(8,4),


    confidence              NUMERIC(8,4),


    ranking                 INTEGER,


    model_name              VARCHAR(200),


    model_version            VARCHAR(100),


    generated_at            TIMESTAMPTZ
                            DEFAULT NOW(),


    status                  VARCHAR(50)
                            DEFAULT 'ACTIVE',


    version                 INTEGER
                            DEFAULT 1,


    created_at              TIMESTAMPTZ
                            DEFAULT NOW(),


    created_by              UUID,


    CONSTRAINT pk_demand_recommendation
    
        PRIMARY KEY(id)

);



ALTER TABLE demand_recommendation

ADD CONSTRAINT fk_demand_recommendation_demand

FOREIGN KEY(demand_id)

REFERENCES demand(id);



ALTER TABLE demand_recommendation

ADD CONSTRAINT fk_demand_recommendation_product

FOREIGN KEY(product_id)

REFERENCES standard_product(id);



ALTER TABLE demand_recommendation

ADD CONSTRAINT fk_demand_recommendation_offer

FOREIGN KEY(offer_id)

REFERENCES offer(id);



CREATE INDEX idx_demand_recommendation_demand

ON demand_recommendation(demand_id);



CREATE INDEX idx_demand_recommendation_product

ON demand_recommendation(product_id);



CREATE INDEX idx_demand_recommendation_offer

ON demand_recommendation(offer_id);



COMMENT ON TABLE demand_recommendation

IS 'AI Demand Recommendation';



/* ============================================================

Demand Domain Complete


Tables:

demand

demand_item

demand_attachment

demand_recommendation



Business Relationship:


User Requirement

        │
    
        ▼

Demand

        │
    
        ├──────────────┐
    
        ▼              ▼

AI Recommendation     Attachment


        │
    
        ▼

Standard Product


        │
    
        ▼

Offer



============================================================ */


/* ============================================================

END BLOCK 10/18

============================================================ */

/* ============================================================

BEGIN BLOCK 11/18

RFQ Domain

============================================================ */


/* ============================================================

Table:
rfq

Canonical Name:
Request For Quotation

Chinese Name:
询价单

============================================================

Purpose

RFQ is generated from:

- Demand
- Manual Creation
- AI Recommendation
- Import

RFQ is used to collect supplier quotations.

============================================================ */

CREATE TABLE rfq
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    rfq_code                VARCHAR(120)    NOT NULL,
    
    demand_id               UUID,
    
    title                   VARCHAR(500)    NOT NULL,
    
    description             TEXT,
    
    source_type             VARCHAR(100),
    
    rfq_status              VARCHAR(50)     NOT NULL DEFAULT 'DRAFT',
    
    publish_time            TIMESTAMPTZ,
    
    quotation_deadline      TIMESTAMPTZ,
    
    expected_delivery_date  DATE,
    
    currency                VARCHAR(20),
    
    remark                  TEXT,
    
    workflow_status         VARCHAR(50),
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by              UUID,
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by              UUID,
    
    deleted_at              TIMESTAMPTZ,
    
    deleted_by              UUID,
    
    CONSTRAINT pk_rfq
    
        PRIMARY KEY(id),
    
    CONSTRAINT uq_rfq_code
    
        UNIQUE(rfq_code)

);


ALTER TABLE rfq

ADD CONSTRAINT fk_rfq_demand

FOREIGN KEY(demand_id)

REFERENCES demand(id);



CREATE INDEX idx_rfq_status

ON rfq(rfq_status);



CREATE INDEX idx_rfq_demand

ON rfq(demand_id);



COMMENT ON TABLE rfq

IS 'Request For Quotation';



/* ============================================================

Table:
rfq_item

============================================================ */

CREATE TABLE rfq_item
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    rfq_id                  UUID            NOT NULL,
    
    product_id              UUID,
    
    quantity                INTEGER         NOT NULL,
    
    expected_delivery       DATE,
    
    specification           TEXT,
    
    remark                  TEXT,
    
    display_order           INTEGER         DEFAULT 0,
    
    status                  VARCHAR(50)     DEFAULT 'ACTIVE',
    
    version                 INTEGER         DEFAULT 1,
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    CONSTRAINT pk_rfq_item
    
        PRIMARY KEY(id)

);


ALTER TABLE rfq_item

ADD CONSTRAINT fk_rfq_item_rfq

FOREIGN KEY(rfq_id)

REFERENCES rfq(id);



ALTER TABLE rfq_item

ADD CONSTRAINT fk_rfq_item_product

FOREIGN KEY(product_id)

REFERENCES standard_product(id);



CREATE INDEX idx_rfq_item_rfq

ON rfq_item(rfq_id);



CREATE INDEX idx_rfq_item_product

ON rfq_item(product_id);



COMMENT ON TABLE rfq_item

IS 'RFQ Item';



/* ============================================================

Table:
rfq_attachment

============================================================ */

CREATE TABLE rfq_attachment
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    rfq_id                  UUID            NOT NULL,
    
    file_object_id          UUID            NOT NULL,
    
    attachment_type         VARCHAR(100),
    
    display_order           INTEGER         DEFAULT 0,
    
    remark                  TEXT,
    
    status                  VARCHAR(50)     DEFAULT 'ACTIVE',
    
    version                 INTEGER         DEFAULT 1,
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    CONSTRAINT pk_rfq_attachment
    
        PRIMARY KEY(id)

);


ALTER TABLE rfq_attachment

ADD CONSTRAINT fk_rfq_attachment_rfq

FOREIGN KEY(rfq_id)

REFERENCES rfq(id);



CREATE INDEX idx_rfq_attachment_rfq

ON rfq_attachment(rfq_id);



COMMENT ON TABLE rfq_attachment

IS 'RFQ Attachment';



/* ============================================================

Table:
rfq_quotation

Canonical Name:
RFQ Quotation

Chinese Name:
供应商报价

============================================================ */

CREATE TABLE rfq_quotation
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    rfq_item_id             UUID            NOT NULL,
    
    offer_id                UUID            NOT NULL,
    
    quotation_no            VARCHAR(120),
    
    unit_price              NUMERIC(18,2),
    
    total_price             NUMERIC(18,2),
    
    currency                VARCHAR(20),
    
    delivery_days           INTEGER,
    
    validity_days           INTEGER,
    
    quotation_status        VARCHAR(50)     DEFAULT 'SUBMITTED',
    
    supplier_remark         TEXT,
    
    quoted_at               TIMESTAMPTZ,
    
    status                  VARCHAR(50)     DEFAULT 'ACTIVE',
    
    version                 INTEGER         DEFAULT 1,
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    created_by              UUID,
    
    updated_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    updated_by              UUID,
    
    CONSTRAINT pk_rfq_quotation
    
        PRIMARY KEY(id)

);


ALTER TABLE rfq_quotation

ADD CONSTRAINT fk_rfq_quotation_item

FOREIGN KEY(rfq_item_id)

REFERENCES rfq_item(id);



ALTER TABLE rfq_quotation

ADD CONSTRAINT fk_rfq_quotation_offer

FOREIGN KEY(offer_id)

REFERENCES offer(id);



CREATE INDEX idx_rfq_quotation_item

ON rfq_quotation(rfq_item_id);



CREATE INDEX idx_rfq_quotation_offer

ON rfq_quotation(offer_id);



COMMENT ON TABLE rfq_quotation

IS 'Supplier Quotation';



/* ============================================================

RFQ Domain Complete

Tables

rfq

rfq_item

rfq_attachment

rfq_quotation


Business Relationship

Demand

    │
    
    ▼

RFQ

    │
    
    ▼

RFQ Item

    │
    
    ▼

Supplier Offer

    │
    
    ▼

Quotation


============================================================ */


/* ============================================================

END BLOCK 11/18

============================================================ */

/* ============================================================

BEGIN BLOCK 12/18

Workflow Domain

============================================================ */


/* ============================================================

Workflow Domain Purpose


Workflow provides unified process engine.


Used for:

- Product Approval
- Knowledge Approval
- Offer Review
- RFQ Process
- Demand Handling
- Platform Operation


Business Modules:

DO NOT

implement independent approval logic.


All workflows use:

workflow_definition

workflow_instance

workflow_task

workflow_history


============================================================ */


/* ============================================================

Table:
workflow_definition


Canonical Name:
Workflow Definition


Chinese Name:
流程定义


============================================================ */


CREATE TABLE workflow_definition
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    workflow_code           VARCHAR(120)    NOT NULL,


    workflow_name           VARCHAR(300)    NOT NULL,


    business_type           VARCHAR(100)    NOT NULL,


    description             TEXT,


    version_no              INTEGER         NOT NULL DEFAULT 1,


    definition_json         JSONB,


    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',


    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    created_by              UUID,


    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),


    updated_by              UUID,


    deleted_at              TIMESTAMPTZ,


    deleted_by              UUID,


    CONSTRAINT pk_workflow_definition
    
        PRIMARY KEY(id),


    CONSTRAINT uq_workflow_definition_code
    
        UNIQUE(workflow_code, version_no)

);



CREATE INDEX idx_workflow_definition_business

ON workflow_definition(business_type);



CREATE INDEX idx_workflow_definition_status

ON workflow_definition(status);



COMMENT ON TABLE workflow_definition

IS 'Workflow Template Definition';



/* ============================================================

Table:
workflow_instance


Canonical Name:
Workflow Instance


Chinese Name:
流程实例


============================================================ */


CREATE TABLE workflow_instance
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    workflow_definition_id  UUID            NOT NULL,


    business_type           VARCHAR(100)    NOT NULL,


    business_id             UUID            NOT NULL,


    instance_no             VARCHAR(120),


    current_state           VARCHAR(100),


    workflow_status         VARCHAR(50)
                            NOT NULL DEFAULT 'RUNNING',


    started_at              TIMESTAMPTZ,


    completed_at            TIMESTAMPTZ,


    started_by              UUID,


    status                  VARCHAR(50)
                            NOT NULL DEFAULT 'ACTIVE',


    version                 INTEGER
                            NOT NULL DEFAULT 1,


    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    updated_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    CONSTRAINT pk_workflow_instance
    
        PRIMARY KEY(id)

);



ALTER TABLE workflow_instance

ADD CONSTRAINT fk_workflow_instance_definition

FOREIGN KEY(workflow_definition_id)

REFERENCES workflow_definition(id);



CREATE INDEX idx_workflow_instance_business

ON workflow_instance(business_type,business_id);



CREATE INDEX idx_workflow_instance_status

ON workflow_instance(workflow_status);



COMMENT ON TABLE workflow_instance

IS 'Running Workflow Instance';



/* ============================================================

Table:
workflow_task


Canonical Name:
Workflow Task


Chinese Name:
流程任务


============================================================ */


CREATE TABLE workflow_task
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    workflow_instance_id    UUID            NOT NULL,


    task_name               VARCHAR(300)    NOT NULL,


    task_type               VARCHAR(100),


    assignee_id             UUID,


    role_id                 UUID,


    task_status             VARCHAR(50)
                            NOT NULL DEFAULT 'PENDING',


    priority                VARCHAR(50),


    due_at                  TIMESTAMPTZ,


    completed_at            TIMESTAMPTZ,


    action_result           VARCHAR(100),


    comment                 TEXT,


    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    updated_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    CONSTRAINT pk_workflow_task
    
        PRIMARY KEY(id)

);



ALTER TABLE workflow_task

ADD CONSTRAINT fk_workflow_task_instance

FOREIGN KEY(workflow_instance_id)

REFERENCES workflow_instance(id);



CREATE INDEX idx_workflow_task_instance

ON workflow_task(workflow_instance_id);



CREATE INDEX idx_workflow_task_assignee

ON workflow_task(assignee_id);



CREATE INDEX idx_workflow_task_status

ON workflow_task(task_status);



COMMENT ON TABLE workflow_task

IS 'Workflow Pending Task';



/* ============================================================

Table:
workflow_history


Canonical Name:
Workflow History


Chinese Name:
流程历史


============================================================ */


CREATE TABLE workflow_history
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    workflow_instance_id    UUID            NOT NULL,


    task_id                 UUID,


    action                  VARCHAR(100)    NOT NULL,


    from_state              VARCHAR(100),


    to_state                VARCHAR(100),


    operator_id             UUID,


    operator_comment        TEXT,


    operated_at             TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    CONSTRAINT pk_workflow_history
    
        PRIMARY KEY(id)

);



ALTER TABLE workflow_history

ADD CONSTRAINT fk_workflow_history_instance

FOREIGN KEY(workflow_instance_id)

REFERENCES workflow_instance(id);



ALTER TABLE workflow_history

ADD CONSTRAINT fk_workflow_history_task

FOREIGN KEY(task_id)

REFERENCES workflow_task(id);



CREATE INDEX idx_workflow_history_instance

ON workflow_history(workflow_instance_id);



CREATE INDEX idx_workflow_history_time

ON workflow_history(operated_at);



COMMENT ON TABLE workflow_history

IS 'Workflow Operation History';



/* ============================================================

Workflow Domain Complete


Tables:

workflow_definition

workflow_instance

workflow_task

workflow_history



Business Relationship:


Workflow Definition

        │
    
        ▼

Workflow Instance

        │
    
        ▼

Workflow Task

        │
    
        ▼

Workflow History



============================================================ */


/* ============================================================

END BLOCK 12/18

============================================================ */

/* ============================================================

BEGIN BLOCK 13/18

Dictionary Domain

============================================================ */


/* ============================================================

Dictionary Domain Purpose


Dictionary provides unified platform basic data.


Used for:

- Country
- Region
- Language
- Currency
- Unit
- Industry
- Material
- Inspection Method
- Standard
- Certificate
- Interface Type
- Protocol
- Product Classification Extension
- Enumeration Values


Business Modules:

DO NOT

maintain independent dictionary tables.


All common selectable values use:

dictionary

dictionary_item


============================================================ */


/* ============================================================

Table:
dictionary


Canonical Name:
Dictionary


Chinese Name:
数据字典


============================================================ */


CREATE TABLE dictionary
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    dictionary_code         VARCHAR(120)    NOT NULL,


    dictionary_name         VARCHAR(300)    NOT NULL,


    description             TEXT,


    value_type              VARCHAR(100),


    multi_language          BOOLEAN
                            NOT NULL DEFAULT FALSE,


    system_defined          BOOLEAN
                            NOT NULL DEFAULT TRUE,


    status                  VARCHAR(50)
                            NOT NULL DEFAULT 'ACTIVE',


    version                 INTEGER
                            NOT NULL DEFAULT 1,


    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    created_by              UUID,


    updated_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    updated_by              UUID,


    deleted_at              TIMESTAMPTZ,


    deleted_by              UUID,


    CONSTRAINT pk_dictionary
    
        PRIMARY KEY(id),


    CONSTRAINT uq_dictionary_code
    
        UNIQUE(dictionary_code)

);



CREATE INDEX idx_dictionary_status

ON dictionary(status);



COMMENT ON TABLE dictionary

IS 'Platform Dictionary Definition';



/* ============================================================

Table:
dictionary_item


Canonical Name:
Dictionary Item


Chinese Name:
字典项


============================================================ */


CREATE TABLE dictionary_item
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    dictionary_id           UUID            NOT NULL,


    item_code               VARCHAR(120)    NOT NULL,


    item_name               VARCHAR(300)    NOT NULL,


    item_name_en            VARCHAR(300),


    item_value              VARCHAR(500),


    parent_item_id          UUID,


    display_order           INTEGER
                            NOT NULL DEFAULT 0,


    language                VARCHAR(50)
                            DEFAULT 'zh-CN',


    extra_data              JSONB,


    status                  VARCHAR(50)
                            NOT NULL DEFAULT 'ACTIVE',


    version                 INTEGER
                            NOT NULL DEFAULT 1,


    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    created_by              UUID,


    updated_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    updated_by              UUID,


    deleted_at              TIMESTAMPTZ,


    deleted_by              UUID,


    CONSTRAINT pk_dictionary_item
    
        PRIMARY KEY(id)

);



ALTER TABLE dictionary_item

ADD CONSTRAINT fk_dictionary_item_dictionary

FOREIGN KEY(dictionary_id)

REFERENCES dictionary(id);



ALTER TABLE dictionary_item

ADD CONSTRAINT fk_dictionary_item_parent

FOREIGN KEY(parent_item_id)

REFERENCES dictionary_item(id);



CREATE INDEX idx_dictionary_item_dictionary

ON dictionary_item(dictionary_id);



CREATE INDEX idx_dictionary_item_code

ON dictionary_item(item_code);



CREATE INDEX idx_dictionary_item_parent

ON dictionary_item(parent_item_id);



COMMENT ON TABLE dictionary_item

IS 'Dictionary Value Item';



/* ============================================================

Dictionary Domain Complete


Tables:

dictionary

dictionary_item



Business Relationship:


Dictionary

        │
    
        ▼

Dictionary Item


Example:


Dictionary:

UNIT


        │


        ├── mm
    
        ├── cm
    
        └── inch



Dictionary:

LANGUAGE


        │


        ├── zh-CN
    
        ├── en-US
    
        └── ja-JP



============================================================ */


/* ============================================================

END BLOCK 13/18

============================================================ */

/* ============================================================

BEGIN BLOCK 14/18

File Domain

============================================================ */


/* ============================================================

File Domain Purpose

File Domain is the unified file resource center
for the entire VISNDT Platform.

Business modules DO NOT save:

- File Path
- OSS URL
- S3 URL
- Local Path

All business entities reference:

file_object.id

============================================================ */


/* ============================================================

Table:
file_object

Canonical Name:
File Object

Chinese Name:
文件对象

============================================================ */

CREATE TABLE file_object
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    file_uuid               UUID            NOT NULL DEFAULT generate_uuid_v7(),
    
    file_name               VARCHAR(500)    NOT NULL,
    
    original_name           VARCHAR(500),
    
    extension               VARCHAR(50),
    
    mime_type               VARCHAR(200),
    
    file_size               BIGINT,
    
    storage_provider        VARCHAR(100),
    
    storage_bucket          VARCHAR(200),
    
    storage_key             TEXT,
    
    checksum_sha256         VARCHAR(128),
    
    is_public               BOOLEAN         NOT NULL DEFAULT FALSE,
    
    current_version         INTEGER         NOT NULL DEFAULT 1,
    
    upload_user_id          UUID,
    
    organization_id         UUID,
    
    status                  VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    
    version                 INTEGER         NOT NULL DEFAULT 1,
    
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    created_by              UUID,
    
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    updated_by              UUID,
    
    deleted_at              TIMESTAMPTZ,
    
    deleted_by              UUID,
    
    CONSTRAINT pk_file_object
        PRIMARY KEY(id),
    
    CONSTRAINT uq_file_uuid
        UNIQUE(file_uuid)

);


CREATE INDEX idx_file_object_name
ON file_object(file_name);

CREATE INDEX idx_file_object_status
ON file_object(status);

CREATE INDEX idx_file_object_storage
ON file_object(storage_provider);

COMMENT ON TABLE file_object
IS 'Unified File Resource';



/* ============================================================

Table:
file_version

============================================================ */

CREATE TABLE file_version
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    file_object_id          UUID            NOT NULL,
    
    version_no              INTEGER         NOT NULL,
    
    storage_key             TEXT            NOT NULL,
    
    file_size               BIGINT,
    
    checksum_sha256         VARCHAR(128),
    
    uploaded_at             TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    uploaded_by             UUID,
    
    is_current              BOOLEAN         NOT NULL DEFAULT FALSE,
    
    remark                  TEXT,
    
    status                  VARCHAR(50)     DEFAULT 'ACTIVE',
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    CONSTRAINT pk_file_version
        PRIMARY KEY(id)

);


ALTER TABLE file_version

ADD CONSTRAINT fk_file_version_file

FOREIGN KEY(file_object_id)

REFERENCES file_object(id);


CREATE INDEX idx_file_version_file

ON file_version(file_object_id);

CREATE INDEX idx_file_version_current

ON file_version(is_current);

COMMENT ON TABLE file_version

IS 'File Version';



/* ============================================================

Table:
file_permission

============================================================ */

CREATE TABLE file_permission
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    file_object_id          UUID            NOT NULL,
    
    permission_scope        VARCHAR(100),
    
    organization_id         UUID,
    
    role_id                 UUID,
    
    user_id                 UUID,
    
    permission_type         VARCHAR(100),
    
    expires_at              TIMESTAMPTZ,
    
    status                  VARCHAR(50)     DEFAULT 'ACTIVE',
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    CONSTRAINT pk_file_permission
        PRIMARY KEY(id)

);


ALTER TABLE file_permission

ADD CONSTRAINT fk_file_permission_file

FOREIGN KEY(file_object_id)

REFERENCES file_object(id);


CREATE INDEX idx_file_permission_file

ON file_permission(file_object_id);

CREATE INDEX idx_file_permission_scope

ON file_permission(permission_scope);

COMMENT ON TABLE file_permission

IS 'File Permission';



/* ============================================================

Table:
file_tag

============================================================ */

CREATE TABLE file_tag
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    file_object_id          UUID            NOT NULL,
    
    tag_name                VARCHAR(200)    NOT NULL,
    
    tag_type                VARCHAR(100),
    
    ai_weight               NUMERIC(8,4),
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    CONSTRAINT pk_file_tag
        PRIMARY KEY(id)

);


ALTER TABLE file_tag

ADD CONSTRAINT fk_file_tag_file

FOREIGN KEY(file_object_id)

REFERENCES file_object(id);


CREATE INDEX idx_file_tag_file

ON file_tag(file_object_id);

CREATE INDEX idx_file_tag_name

ON file_tag(tag_name);

COMMENT ON TABLE file_tag

IS 'File Tag';



/* ============================================================

File Domain Complete


Tables

file_object

file_version

file_permission

file_tag



Business Relationship


Business

      │
    
      ▼

file_object

      │
    
      ├────────────┬────────────┐
    
      ▼            ▼            ▼

Version     Permission      Tag


============================================================ */


/* ============================================================

Business Modules Reference


Product Attachment

Organization Attachment

Offer Attachment

Knowledge Attachment

Demand Attachment

RFQ Attachment

ALL reference:

file_object.id

============================================================ */


/* ============================================================

END BLOCK 14/18

============================================================ */

/* ============================================================

BEGIN BLOCK 15/18

AI Domain

============================================================ */


/* ============================================================

AI Domain Purpose


AI Domain provides unified AI infrastructure.


Used for:

- Semantic Search
- RAG Retrieval
- Product Recommendation
- Knowledge Reasoning
- Similarity Matching
- AI Assistant


Core Principle:


AI DOES NOT COPY BUSINESS DATA.


AI stores:

- Reference
- Metadata
- Vector
- Relationship


Business Data remains in:

Product

Knowledge

Offer

Demand

RFQ


============================================================ */


/* ============================================================

Table:
embedding


Canonical Name:
Embedding


Chinese Name:
向量模型记录


============================================================ */


CREATE TABLE embedding
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    business_type           VARCHAR(100)    NOT NULL,


    business_id             UUID            NOT NULL,


    provider                VARCHAR(100),


    model_name              VARCHAR(200),


    dimension               INTEGER,


    vector_version          VARCHAR(100),


    generated_at            TIMESTAMPTZ,


    status                  VARCHAR(50)
                            NOT NULL DEFAULT 'ACTIVE',


    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    updated_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    CONSTRAINT pk_embedding
    
        PRIMARY KEY(id)

);



CREATE INDEX idx_embedding_business

ON embedding(business_type,business_id);



CREATE INDEX idx_embedding_model

ON embedding(model_name);



COMMENT ON TABLE embedding

IS 'AI Embedding Metadata';



/* ============================================================

Table:
vector_chunk


Canonical Name:
Vector Chunk


Chinese Name:
向量文本分片


============================================================ */


CREATE TABLE vector_chunk
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    embedding_id            UUID            NOT NULL,


    source_type             VARCHAR(100),


    source_id               UUID,


    chunk_index              INTEGER,


    content_text            TEXT,


    token_count             INTEGER,


    vector_data             VECTOR(1536),


    metadata                JSONB,


    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),


    status                  VARCHAR(50)
                            DEFAULT 'ACTIVE',


    CONSTRAINT pk_vector_chunk
    
        PRIMARY KEY(id)

);



ALTER TABLE vector_chunk

ADD CONSTRAINT fk_vector_chunk_embedding

FOREIGN KEY(embedding_id)

REFERENCES embedding(id);



CREATE INDEX idx_vector_chunk_embedding

ON vector_chunk(embedding_id);



CREATE INDEX idx_vector_chunk_source

ON vector_chunk(source_type,source_id);



COMMENT ON TABLE vector_chunk

IS 'AI Vector Search Chunk';



/* ============================================================

Table:
search_index


Canonical Name:
Search Index


Chinese Name:
统一搜索索引


============================================================ */


CREATE TABLE search_index
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    business_type           VARCHAR(100)    NOT NULL,


    business_id             UUID            NOT NULL,


    title                   VARCHAR(500),


    keywords                TEXT,


    searchable_content      TEXT,


    language                VARCHAR(50)
                            DEFAULT 'zh-CN',


    search_weight           NUMERIC(8,4)
                            DEFAULT 1,


    last_indexed_at         TIMESTAMPTZ,


    status                  VARCHAR(50)
                            DEFAULT 'ACTIVE',


    created_at              TIMESTAMPTZ
                            DEFAULT NOW(),


    updated_at              TIMESTAMPTZ
                            DEFAULT NOW(),


    CONSTRAINT pk_search_index
    
        PRIMARY KEY(id)

);



CREATE INDEX idx_search_index_business

ON search_index(business_type,business_id);



CREATE INDEX idx_search_index_status

ON search_index(status);



COMMENT ON TABLE search_index

IS 'Unified Full Text Search Index';



/* ============================================================

Table:
knowledge_graph


Canonical Name:
Knowledge Graph


Chinese Name:
知识图谱


============================================================ */


CREATE TABLE knowledge_graph
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),


    entity_type             VARCHAR(100)    NOT NULL,


    entity_id               UUID,


    entity_name             VARCHAR(500),


    relation_type           VARCHAR(100),


    related_entity_type     VARCHAR(100),


    related_entity_id       UUID,


    relation_weight         NUMERIC(8,4),


    metadata                JSONB,


    status                  VARCHAR(50)
                            DEFAULT 'ACTIVE',


    created_at              TIMESTAMPTZ
                            DEFAULT NOW(),


    updated_at              TIMESTAMPTZ
                            DEFAULT NOW(),


    CONSTRAINT pk_knowledge_graph
    
        PRIMARY KEY(id)

);



CREATE INDEX idx_knowledge_graph_entity

ON knowledge_graph(entity_type,entity_id);



CREATE INDEX idx_knowledge_graph_relation

ON knowledge_graph(relation_type);



COMMENT ON TABLE knowledge_graph

IS 'AI Knowledge Graph Relationship';



/* ============================================================

AI Domain Complete


Tables:


embedding

vector_chunk

search_index

knowledge_graph



Architecture:


Business Entity

        │
    
        ▼

Embedding

        │
    
        ▼

Vector Chunk

        │
    
        ▼

AI Retrieval


Knowledge Relationship:

Entity

   │

   ▼

Knowledge Graph

============================================================ */


/* ============================================================

AI Domain Constraints


1.

AI tables cannot replace business tables.



2.

AI generated data can be regenerated.



3.

AI model upgrade creates new version.



4.

Business entities remain source of truth.



============================================================ */


/* ============================================================

END BLOCK 15/18

============================================================ */

/* ============================================================

BEGIN BLOCK 16/18

User & Permission Domain

============================================================ */


/* ============================================================

User & Permission Domain Purpose

Unified Identity Management

Unified Authentication

Unified Authorization

RBAC

Organization Membership

============================================================ */


/* ============================================================

Table:
user

============================================================ */

CREATE TABLE "user"
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    username                VARCHAR(120)    NOT NULL,
    
    login_email             VARCHAR(300),
    
    login_mobile            VARCHAR(50),
    
    password_hash           TEXT            NOT NULL,
    
    organization_id         UUID,
    
    login_provider          VARCHAR(100),
    
    last_login_at           TIMESTAMPTZ,
    
    login_failed_count      INTEGER         DEFAULT 0,
    
    account_locked          BOOLEAN         DEFAULT FALSE,
    
    account_expired         BOOLEAN         DEFAULT FALSE,
    
    status                  VARCHAR(50)     DEFAULT 'ACTIVE',
    
    version                 INTEGER         DEFAULT 1,
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    created_by              UUID,
    
    updated_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    updated_by              UUID,
    
    deleted_at              TIMESTAMPTZ,
    
    deleted_by              UUID,
    
    CONSTRAINT pk_user
    
        PRIMARY KEY(id),
    
    CONSTRAINT uq_user_username
    
        UNIQUE(username)

);


ALTER TABLE "user"

ADD CONSTRAINT fk_user_organization

FOREIGN KEY(organization_id)

REFERENCES organization(id);


CREATE INDEX idx_user_org

ON "user"(organization_id);

CREATE INDEX idx_user_status

ON "user"(status);

COMMENT ON TABLE "user"

IS 'Platform User';



/* ============================================================

Table:
user_profile

============================================================ */

CREATE TABLE user_profile
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    user_id                 UUID            NOT NULL,
    
    real_name               VARCHAR(300),
    
    avatar                  TEXT,
    
    gender                  VARCHAR(30),
    
    mobile                  VARCHAR(50),
    
    email                   VARCHAR(300),
    
    language                VARCHAR(50),
    
    timezone                VARCHAR(100),
    
    department              VARCHAR(200),
    
    position                VARCHAR(200),
    
    remark                  TEXT,
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    CONSTRAINT pk_user_profile
    
        PRIMARY KEY(id)

);


ALTER TABLE user_profile

ADD CONSTRAINT fk_user_profile_user

FOREIGN KEY(user_id)

REFERENCES "user"(id);


CREATE UNIQUE INDEX idx_user_profile_user

ON user_profile(user_id);

COMMENT ON TABLE user_profile

IS 'User Profile';



/* ============================================================

Table:
role

============================================================ */

CREATE TABLE role
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    role_code               VARCHAR(120)    NOT NULL,
    
    role_name               VARCHAR(300)    NOT NULL,
    
    role_scope              VARCHAR(100),
    
    description             TEXT,
    
    system_role             BOOLEAN         DEFAULT FALSE,
    
    status                  VARCHAR(50)     DEFAULT 'ACTIVE',
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    CONSTRAINT pk_role
    
        PRIMARY KEY(id),
    
    CONSTRAINT uq_role_code
    
        UNIQUE(role_code)

);


CREATE INDEX idx_role_scope

ON role(role_scope);

COMMENT ON TABLE role

IS 'RBAC Role';



/* ============================================================

Table:
permission

============================================================ */

CREATE TABLE permission
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    permission_code         VARCHAR(200)    NOT NULL,
    
    permission_name         VARCHAR(300),
    
    permission_type         VARCHAR(100),
    
    resource_type           VARCHAR(100),
    
    http_method             VARCHAR(20),
    
    api_path                TEXT,
    
    description             TEXT,
    
    status                  VARCHAR(50)     DEFAULT 'ACTIVE',
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    CONSTRAINT pk_permission
    
        PRIMARY KEY(id),
    
    CONSTRAINT uq_permission_code
    
        UNIQUE(permission_code)

);


CREATE INDEX idx_permission_type

ON permission(permission_type);

COMMENT ON TABLE permission

IS 'Permission Definition';



/* ============================================================

Table:
user_role

============================================================ */

CREATE TABLE user_role
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    user_id                 UUID            NOT NULL,
    
    role_id                 UUID            NOT NULL,
    
    assigned_at             TIMESTAMPTZ     DEFAULT NOW(),
    
    assigned_by             UUID,
    
    expires_at              TIMESTAMPTZ,
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    CONSTRAINT pk_user_role
    
        PRIMARY KEY(id)

);


ALTER TABLE user_role

ADD CONSTRAINT fk_user_role_user

FOREIGN KEY(user_id)

REFERENCES "user"(id);


ALTER TABLE user_role

ADD CONSTRAINT fk_user_role_role

FOREIGN KEY(role_id)

REFERENCES role(id);


CREATE UNIQUE INDEX idx_user_role_unique

ON user_role(user_id,role_id);

COMMENT ON TABLE user_role

IS 'User Role Mapping';



/* ============================================================

Table:
role_permission

============================================================ */

CREATE TABLE role_permission
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    role_id                 UUID            NOT NULL,
    
    permission_id           UUID            NOT NULL,
    
    granted                 BOOLEAN         DEFAULT TRUE,
    
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    
    CONSTRAINT pk_role_permission
    
        PRIMARY KEY(id)

);


ALTER TABLE role_permission

ADD CONSTRAINT fk_role_permission_role

FOREIGN KEY(role_id)

REFERENCES role(id);


ALTER TABLE role_permission

ADD CONSTRAINT fk_role_permission_permission

FOREIGN KEY(permission_id)

REFERENCES permission(id);


CREATE UNIQUE INDEX idx_role_permission_unique

ON role_permission(role_id,permission_id);

COMMENT ON TABLE role_permission

IS 'Role Permission Mapping';



/* ============================================================

RBAC Relationship


User

   │

   ▼

User Role

   │

   ▼

Role

   │

   ▼

Role Permission

   │

   ▼

Permission


============================================================ */


/* ============================================================

Platform Default Roles


Platform Admin

Platform Operator

Organization Admin

Organization Manager

Sales

Engineer

Supplier

Viewer

AI Agent


============================================================ */


/* ============================================================

END BLOCK 16/18

============================================================ */

/* ============================================================

BEGIN BLOCK 17/18

System Domain

============================================================ */


/* ============================================================

System Domain Purpose

Provide unified infrastructure services.

Including:

- Audit
- Operation Log
- Notification
- System Configuration
- Number Generator
- Scheduled Job

============================================================ */


/* ============================================================

Table:
audit_log

============================================================ */

CREATE TABLE audit_log
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    business_type           VARCHAR(100),
    
    business_id             UUID,
    
    operation_type          VARCHAR(100),
    
    operator_id             UUID,
    
    organization_id         UUID,
    
    before_data             JSONB,
    
    after_data              JSONB,
    
    ip_address              INET,
    
    user_agent              TEXT,
    
    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pk_audit_log
    
        PRIMARY KEY(id)

);


CREATE INDEX idx_audit_business

ON audit_log(business_type,business_id);

CREATE INDEX idx_audit_operator

ON audit_log(operator_id);

COMMENT ON TABLE audit_log

IS 'Business Audit Log';



/* ============================================================

Table:
operation_log

============================================================ */

CREATE TABLE operation_log
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    user_id                 UUID,
    
    organization_id         UUID,
    
    module_name             VARCHAR(100),
    
    operation_name          VARCHAR(200),
    
    request_uri             TEXT,
    
    request_method          VARCHAR(20),
    
    response_code           INTEGER,
    
    execution_time_ms       INTEGER,
    
    client_ip               INET,
    
    user_agent              TEXT,
    
    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pk_operation_log
    
        PRIMARY KEY(id)

);


CREATE INDEX idx_operation_user

ON operation_log(user_id);

CREATE INDEX idx_operation_module

ON operation_log(module_name);

COMMENT ON TABLE operation_log

IS 'Platform Operation Log';



/* ============================================================

Table:
notification

============================================================ */

CREATE TABLE notification
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    receiver_user_id        UUID,
    
    organization_id         UUID,
    
    notification_type       VARCHAR(100),
    
    title                   VARCHAR(500),
    
    content                 TEXT,
    
    priority                VARCHAR(50),
    
    is_read                 BOOLEAN
                            NOT NULL DEFAULT FALSE,
    
    read_at                 TIMESTAMPTZ,
    
    expires_at              TIMESTAMPTZ,
    
    created_at              TIMESTAMPTZ
                            NOT NULL DEFAULT NOW(),
    
    status                  VARCHAR(50)
                            DEFAULT 'ACTIVE',
    
    CONSTRAINT pk_notification
    
        PRIMARY KEY(id)

);


CREATE INDEX idx_notification_receiver

ON notification(receiver_user_id);

CREATE INDEX idx_notification_status

ON notification(status);

COMMENT ON TABLE notification

IS 'Notification Center';



/* ============================================================

Table:
system_setting

============================================================ */

CREATE TABLE system_setting
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    setting_group           VARCHAR(100),
    
    setting_key             VARCHAR(200)
                            NOT NULL,
    
    setting_value           TEXT,
    
    value_type              VARCHAR(100),
    
    description             TEXT,
    
    editable                BOOLEAN
                            DEFAULT TRUE,
    
    created_at              TIMESTAMPTZ
                            DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ
                            DEFAULT NOW(),
    
    CONSTRAINT pk_system_setting
    
        PRIMARY KEY(id),
    
    CONSTRAINT uq_system_setting
    
        UNIQUE(setting_key)

);


CREATE INDEX idx_system_setting_group

ON system_setting(setting_group);

COMMENT ON TABLE system_setting

IS 'Platform System Setting';



/* ============================================================

Table:
sequence

============================================================ */

CREATE TABLE sequence
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    sequence_code           VARCHAR(100)
                            NOT NULL,
    
    prefix                  VARCHAR(100),
    
    current_value           BIGINT
                            NOT NULL DEFAULT 1,
    
    increment_step          INTEGER
                            NOT NULL DEFAULT 1,
    
    yearly_reset            BOOLEAN
                            DEFAULT TRUE,
    
    format_pattern          VARCHAR(200),
    
    updated_at              TIMESTAMPTZ
                            DEFAULT NOW(),
    
    CONSTRAINT pk_sequence
    
        PRIMARY KEY(id),
    
    CONSTRAINT uq_sequence
    
        UNIQUE(sequence_code)

);


COMMENT ON TABLE sequence

IS 'Business Sequence Generator';



/* ============================================================

Table:
scheduled_job

============================================================ */

CREATE TABLE scheduled_job
(
    id                      UUID            NOT NULL DEFAULT generate_uuid_v7(),

    job_code                VARCHAR(120)
                            NOT NULL,
    
    job_name                VARCHAR(300),
    
    cron_expression         VARCHAR(200),
    
    handler_class           VARCHAR(500),
    
    handler_method          VARCHAR(200),
    
    parameter_json          JSONB,
    
    enabled                 BOOLEAN
                            DEFAULT TRUE,
    
    last_execute_time       TIMESTAMPTZ,
    
    next_execute_time       TIMESTAMPTZ,
    
    status                  VARCHAR(50)
                            DEFAULT 'ACTIVE',
    
    created_at              TIMESTAMPTZ
                            DEFAULT NOW(),
    
    updated_at              TIMESTAMPTZ
                            DEFAULT NOW(),
    
    CONSTRAINT pk_scheduled_job
    
        PRIMARY KEY(id),
    
    CONSTRAINT uq_job_code
    
        UNIQUE(job_code)

);


CREATE INDEX idx_job_enabled

ON scheduled_job(enabled);

COMMENT ON TABLE scheduled_job

IS 'Platform Scheduled Job';



/* ============================================================

System Domain Architecture


Business

      │
    
      ▼

Audit Log

Operation Log

Notification

System Setting

Sequence

Scheduled Job


============================================================ */


/* ============================================================

System Constraints


1.

All business logs

MUST use Audit Log.


2.

API operation logs

MUST use Operation Log.


3.

Business numbering

MUST use Sequence.


Examples:


VIS-PD-202600001

VIS-RFQ-202600001

VIS-DM-202600001


4.

System configuration

MUST NOT be hard coded.


5.

Background tasks

MUST be registered in Scheduled Job.


============================================================ */


/* ============================================================

END BLOCK 17/18

============================================================ */

/* ============================================================

BEGIN BLOCK 18/18

Global DDL Specification

DDL Finalization

Version 2.0

============================================================ */


/* ============================================================

PostgreSQL Required Extensions

============================================================ */

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE EXTENSION IF NOT EXISTS vector;

-- UUID v7 Extension
-- Install according to deployment environment
-- Example:
-- CREATE EXTENSION IF NOT EXISTS pg_uuidv7;


/* ============================================================

Database Encoding

============================================================ */

-- UTF8

-- TimeZone : UTC

-- Collation : C


/* ============================================================

Global Naming Convention

============================================================ */

-- Table:
-- snake_case

-- Column:
-- snake_case

-- Primary Key:
-- id

-- Foreign Key:
-- xxx_id

-- Index:
-- idx_table_column

-- Unique:
-- uq_table_column

-- Primary Key:
-- pk_table

-- Foreign Key:
-- fk_table_reference

-- Check:
-- ck_table_column


/* ============================================================

Global Timestamp Convention

============================================================ */

All business tables should contain:

created_at

updated_at

deleted_at

created_by

updated_by

deleted_by


All timestamps use:

TIMESTAMPTZ

UTC


/* ============================================================

Soft Delete Policy

============================================================ */

Logical Delete Only

deleted_at

deleted_by

Business data

must NOT

be physically deleted.


/* ============================================================

Optimistic Lock

============================================================ */

Business tables should contain:

version INTEGER

Default:

1


/* ============================================================

Status Convention

============================================================ */

Typical Status:

ACTIVE

INACTIVE

DRAFT

PUBLISHED

ARCHIVED

DELETED


Workflow State

is independent

from Status.


/* ============================================================

JSON Convention

============================================================ */

Dynamic metadata

must use

JSONB

instead of TEXT.


Examples:

metadata

parameter_json

extra_config

extension_data


/* ============================================================

Vector Convention

============================================================ */

Embedding

uses

pgvector

VECTOR(1536)

Future model upgrade

may use

VECTOR(3072)

or

VECTOR(4096)

without affecting business schema.


/* ============================================================

Index Strategy

============================================================ */

Primary Key

↓

BTree


Foreign Key

↓

BTree


Status

↓

BTree


Business Code

↓

Unique Index


Search

↓

GIN

(tsvector)


Vector

↓

HNSW

(pgvector)


JSONB

↓

GIN


/* ============================================================

Partition Recommendation

============================================================ */

Recommended Partition Tables:

audit_log

operation_log

notification

embedding

vector_chunk


Partition Method:

RANGE

Monthly


/* ============================================================

Transaction Principle

============================================================ */

Business Transaction

handled by

Application Layer.


DDL

contains only

schema definition.


/* ============================================================

Business Constraints

============================================================ */

Standard Product

is

Single Source Of Truth.


Offer

contains

Commercial Information.


Organization

does NOT own Product.


Knowledge

belongs to Platform.


Workflow

shared by all business.


Attachment

references

file_object.


AI

references

Business Entity only.


/* ============================================================

Database Architecture Summary

============================================================ */

Business Layer

↓

Platform Layer

↓

Infrastructure Layer

↓

AI Layer

↓

Storage Layer


Repository Dependency


399

↓

401

↓

402

↓

403

↓

404

↓

405

↓

406

↓

407


/***************************************************************

Current Statistics

***************************************************************

Core Tables

60+

Business Domains

12

Unified Naming

YES

UUID v7

YES

Logical Delete

YES

Version Control

YES

Workflow

YES

File Center

YES

Dictionary

YES

RBAC

YES

AI Ready

YES

RAG Ready

YES

Vector Ready

YES

Prisma Ready

YES

Enterprise Ready

YES

Cloud Native

YES

***************************************************************/


/* ============================================================

END OF FILE

403_PostgreSQL_DDL.sql

Version:

2.0 Final

Status:

Frozen

============================================================ */

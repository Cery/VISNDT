\pset pager off
\echo '=== FKs referencing user(id) ==='
SELECT conrelid::regclass AS child_table, conname,
       pg_get_constraintdef(oid) AS def
FROM pg_constraint
WHERE contype='f' AND confrelid='user'::regclass
ORDER BY conrelid::regclass::text;

\echo '=== FKs referencing organization(id) ==='
SELECT conrelid::regclass AS child_table, conname,
       pg_get_constraintdef(oid) AS def
FROM pg_constraint
WHERE contype='f' AND confrelid='organization'::regclass
ORDER BY conrelid::regclass::text;
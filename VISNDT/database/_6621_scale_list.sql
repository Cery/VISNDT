SELECT sp."id", sp."brand", sp."series", sp."modelNumber", sp."status", sp."organization_id"
FROM "supplier_product" sp
WHERE sp."description" LIKE '%【662.1 Scale】%'
ORDER BY sp."brand", sp."modelNumber";

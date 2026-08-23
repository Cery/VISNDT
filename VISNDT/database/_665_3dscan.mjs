/* Get 3DSCAN-Pro product param definition IDs to build a matchable demand */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async()=>{
  const prod = await prisma.product.findFirst({
    where: { name:'3DSCAN-Pro 结构光三维扫描仪', status:'ACTIVE' },
    select: { id:true, name:true, categoryId:true },
  });
  console.log('PROD', prod?.id, prod?.name, 'cat='+prod?.categoryId);
  const pvs = await prisma.productParameterValue.findMany({
    where: { productId: prod?.id },
    include: { parameterDefinition: true },
  });
  for (const p of pvs) console.log(`PD.id=${p.parameterDefinitionId} code=${p.parameterDefinition.code} name=${p.parameterDefinition.name} dt=${p.parameterDefinition.dataType} value=${p.value}${p.valueMin?' min='+p.valueMin:''}${p.valueMax?' max='+p.valueMax:''}`);
  await prisma.$disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
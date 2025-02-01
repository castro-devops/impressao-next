import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient().$extends({
     query: {
          session: {
               async create({ args, query }) {
                    if (args.data.label) { args.data.slug = slugify(args.data.label, { lower: true, strict: true }); }
                    return query(args);
               }
          }
     }
});

export default prisma;
import { z } from "zod";

export const zGrid = z.array(z.array(z.number().min(0).max(9)));

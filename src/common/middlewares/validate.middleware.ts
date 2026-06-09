import type { Request, Response, NextFunction } from "express";
import z from "zod";

export const validate = (
  schema: z.ZodObject,
  target: "body" | "params" | "query" = "body",
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validate = await schema.safeParseAsync(req[target]);

      if (!validate.success) {
        const errors = z.treeifyError(validate.error);

        if (target === "params") {
          res.status(400).json({
            status: "fail",
            message: "Resource not found",
          });
          return;
        }

        res.status(400).json({
          status: "fail",
          message: "Bad Request",
          errors,
        });
      } else {
        req[target] = validate.data;
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};

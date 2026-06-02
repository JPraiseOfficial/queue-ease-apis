import type { Request, Response, NextFunction } from "express";
import z from "zod";

export const validate = (schema: z.ZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validate = await schema.safeParseAsync(req.body);

      if (!validate.success) {
        const errors = z.treeifyError(validate.error);
        // const errors = validate.error.format();

        res.status(400).json({
          status: "fail",
          message: "Bad Request",
          errors,
        });
      } else {
        req.body = validate.data;
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};

import { Request, Response, NextFunction } from "express";
import { customerService } from "../services/customer.service";
import { createCustomerSchema, updateCustomerSchema } from "../schemas/customer.schema";

export const customerController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await customerService.list());
    } catch (err) { next(err); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await customerService.getById(Number(req.params.id)));
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createCustomerSchema.parse(req.body);
      // o schema permite phone ausente (undefined), mas o model usa null
      const data = { ...parsed, phone: parsed.phone ?? null };
      res.status(201).json(await customerService.create(data));
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateCustomerSchema.parse(req.body);
      const { phone, ...rest } = parsed;
      const data = phone === undefined ? rest : { ...rest, phone };
      res.json(await customerService.update(Number(req.params.id), data));
    } catch (err) { next(err); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await customerService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  }
};

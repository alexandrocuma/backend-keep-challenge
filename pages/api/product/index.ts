import { NextApiHandler } from "next";
import db from "../../../db/db";
import { Product } from "../../../types/product";

/**
 * GET /api/products
 *
 */
export type GetProductsQuery = {
  /**
   * Current page (1-indexed)
   */
  page?: string;
  /**
   * Number of products to take (limit)
   */
  take?: string;
};

/**
 * GET /api/products
 *
 * Your API must return a response in this format.
 */
export type GetProductsResponse = {
  /**
   * Current page (1-indexed)
   */
  page: number;
  /**
   * Number of taken products (limit)
   */
  take: number;
  /**
   * Number of products in this page
   * (may be less than `take` if there are not enough products)
   */
  count: number;
  /**
   * Total number of products in the database
   */
  totalCount: number;
  /**
   * Total number of pages
   */
  pages: number;
  /**
   * Products in this page
   */
  products: Product[];
};

// TODO: Make this function perform pagination and return the right response
const productsIndex: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  // Query params
  const query = req.query;

  const count = await db.query('SELECT COUNT(*) FROM "product"');
  const result = (await db.query('SELECT * FROM "product" LIMIT $1 OFFSET $2', [
    query.take,
    query.take * (query.page - 1),
  ])) as Product[];

  const response: GetProductsResponse = {
    page: query.page,
    take: result.length,
    count: result.length,
    totalCount: result.length,
    pages: +count[0].count / +query.take,
    products: result,
  };
  res.status(200).json(response);
};

export default productsIndex;

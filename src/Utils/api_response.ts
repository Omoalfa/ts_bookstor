import { Service } from "typedi";
import { Response } from "express"
import { logger } from "@/Logger";

interface Paginated<T> {
  list: T,
  page: number,
  pageTag: string,
  limit: number,
  total: number,
}

export function created<T>(res: Response, data: T, message = "Successful") {
  return res.status(201).json({
    message,
    data,
    success: true,
  })
}

export function successAction(res: Response, message = "Successful") {
  return res.status(200).json({
    message,
    data: null,
    success: true,
  })
}

export function successPaginated<T>(res: Response, data: Paginated<T>, message = "Fetched successfully") {
  return res.status(200).json({
    message,
    data,
    success: true,
  })
}

export function serverError(res: Response, message = "Something went wrong") {
  return res.status(500).json({
    message,
    error: null,
    success: false,
  })
}

export function success<T> (res: Response, data: any, message = "Successful") {
  return res.status(200).json({
    message,
    data,
    success: true,
  })
} 

export function badRequest<T> (res: Response, error: T, message = "Bad request") {
  return res.status(400).json({
    message,
    error,
    success: false,
  })
}

export function unAthorized<T>(res: Response, error: T, message = "Unauthorized request") {
  return res.status(400).json({
    message,
    error,
    success: false,
  })
}

export const asyncWrapper = async (func: Function) => {
  try {
    await func()
  } catch (error) {
    logger.error(error)
    throw new Error("...")
  }
}

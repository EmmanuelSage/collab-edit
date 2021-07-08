import joi from "@hapi/joi";

/**
 * Trimmed strings
 */
export const isString = joi.string();

/**
 * A string that can be empty or null
 */
export const isOptionalString = joi.string().allow("", null).trim();

/**
 * Required string
 */
export const isRequiredString = joi.string().trim().required();

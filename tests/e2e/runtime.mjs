/* global process */
import { pathToFileURL } from "node:url";
const runtime = process.env.RESTOK_PLAYWRIGHT_MODULE;
export const { chromium } = await import(runtime ? pathToFileURL(runtime).href : "playwright");

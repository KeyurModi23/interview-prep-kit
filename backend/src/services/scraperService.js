import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

const isUrlSafe = (urlString) => {
  try {
    const parsed = new URL(urlString);
    const hostname = parsed.hostname.toLowerCase();
    // SSRF Protection: Block internal and localhost IPs
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

const extractText = ($) => {
  $('script, style, nav, footer, header').remove();
  let text = '';
  $('h1, h2, h3, p, li').each((_, el) => {
    const t = $(el).text().trim();
    if (t) text += t + '\n';
  });
  return text;
};

export const scrapeCompanyContext = async (baseUrl) => {
  if (!baseUrl || !isUrlSafe(baseUrl)) return '';
  
  let combinedText = '';
  const pagesScraped = new Set();
  
  try {
    const response = await axios.get(baseUrl, { timeout: 5000 });
    const $ = cheerio.load(response.data);
    combinedText += extractText($) + '\n';
    pagesScraped.add(baseUrl);

    // Advanced Crawler: Hunt for careers/jobs/about pages
    const linksToCrawl = [];
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      const lowerHref = href.toLowerCase();
      if (lowerHref.includes('career') || lowerHref.includes('job') || lowerHref.includes('about') || lowerHref.includes('hiring')) {
        try {
          const absoluteUrl = new URL(href, baseUrl).toString();
          if (!pagesScraped.has(absoluteUrl) && isUrlSafe(absoluteUrl)) {
            linksToCrawl.push(absoluteUrl);
          }
        } catch (e) { /* ignore bad urls */ }
      }
    });

    // Crawl up to 2 newly discovered sub-pages
    for (const link of linksToCrawl.slice(0, 2)) {
      try {
        const subRes = await axios.get(link, { timeout: 4000 });
        const sub$ = cheerio.load(subRes.data);
        combinedText += "\n--- " + link + " ---\n" + extractText(sub$) + '\n';
        pagesScraped.add(link);
      } catch (err) {
        console.warn('Failed to scrape sub-page:', link);
      }
    }

    return combinedText.substring(0, 3000); // Limit context size for LLM
  } catch (err) {
    console.warn('Failed to scrape company URL:', baseUrl, err.message);
    return '';
  }
};

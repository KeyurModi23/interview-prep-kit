import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeCompanyContext = async (url) => {
  if (!url) return '';
  
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Remove scripts, styles, etc.
    $('script, style, nav, footer, header').remove();

    // Extract text from paragraphs and headings
    let text = '';
    $('h1, h2, h3, p, li').each((_, el) => {
      const t = $(el).text().trim();
      if (t) {
        text += t + '\n';
      }
    });

    // Limit to 2000 chars to avoid prompt bloat
    return text.substring(0, 2000);
  } catch (err) {
    console.warn('Failed to scrape company URL:', url, err.message);
    return '';
  }
};

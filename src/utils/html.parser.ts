/**
 * HTML Parser Utility
 * 
 * This utility provides functions for parsing HTML content from web pages.
 * It's used by the scraper service to extract structured data from HTML.
 */

// Simple HTML parser function
export const parseHTML = (html: string) => {
    try {
      // In a real implementation, this would use a proper HTML parsing library
      // like cheerio, jsdom, or parse5. For now, we'll implement a simple parser.
      
      // Extract title
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : '';
      
      // Extract meta description
      const descriptionMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/i);
      const description = descriptionMatch ? descriptionMatch[1] : '';
      
      // Extract links
      const links = [];
      const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"(?:[^>]*?)>([^<]*)<\/a>/gi;
      let linkMatch;
      while ((linkMatch = linkRegex.exec(html)) !== null) {
        links.push({
          href: linkMatch[1],
          text: linkMatch[2].trim()
        });
      }
      
      // Extract images
      const images = [];
      const imageRegex = /<img\s+(?:[^>]*?\s+)?src="([^"]*)"(?:[^>]*?\s+)?(?:alt="([^"]*)")?[^>]*>/gi;
      let imageMatch;
      while ((imageMatch = imageRegex.exec(html)) !== null) {
        images.push({
          src: imageMatch[1],
          alt: imageMatch[2] || ''
        });
      }
      
      // Extract main text content (simplified)
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      let text = '';
      if (bodyMatch) {
        // Remove all HTML tags and decode HTML entities
        text = bodyMatch[1]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
      
      // Removed unused log statement referencing undefined 'selector'
      return {
        title,
        description,
        links,
        images,
        text
      };
    } catch (error) {
      console.error('HTML parsing error:', error);
      return {
        title: '',
        description: '',
        links: [],
        images: [],
        text: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };
  
  export const extractElements = (html: string, selector: string) => {
    if (!html) {
      console.warn('HTML content is empty.');
      return {
        selector,
        elements: [],
        message: 'No HTML content provided.'
      };
    }
    try {
      // In a real implementation, this would use a proper HTML parsing library
      // For now, we'll return a placeholder
      
      return {
        selector,
        elements: [],
        message: 'This is a placeholder. In a real implementation, this would extract elements using the provided CSS selector.'
      };
    } catch (error) {
      console.error('Element extraction error:', error);
      return {
        selector,
        elements: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };
  
  // Extract structured data (JSON-LD, microdata, etc.)
  export const extractStructuredData = (html: string) => {
    try {
      // Extract JSON-LD data
      const jsonLdData = [];
      const jsonLdRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
      let jsonLdMatch;
      while ((jsonLdMatch = jsonLdRegex.exec(html)) !== null) {
        try {
          const data = JSON.parse(jsonLdMatch[1]);
          jsonLdData.push(data);
        } catch (e) {
          console.error('JSON-LD parsing error:', e);
        }
      }
      
      return {
        jsonLd: jsonLdData,
        microdata: [], // Placeholder for microdata extraction
        rdfa: [] // Placeholder for RDFa extraction
      };
    } catch (error) {
      console.error('Structured data extraction error:', error);
      return {
        jsonLd: [],
        microdata: [],
        rdfa: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };
  
  // Clean and normalize text
export const cleanText = (text: string) => {
  if (!text) return '';
  
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .trim(); // Remove leading and trailing spaces
};
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { ContentItem, ContentMeta } from './api';

// Function to read and parse markdown files
export function parseMarkdownFile(filePath: string): ContentItem | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    return {
      title: data.title || '',
      slug: data.slug || path.basename(filePath, '.md'),
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      excerpt: data.excerpt || '',
      coverImage: data.coverImage || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      content
    };
  } catch (error) {
    console.error(`Error parsing markdown file ${filePath}:`, error);
    return null;
  }
}

// Function to get all markdown files from a directory
export function getAllMarkdownFiles(dirPath: string): ContentMeta[] {
  try {
    if (!fs.existsSync(dirPath)) {
      console.error(`Directory ${dirPath} does not exist`);
      return [];
    }
    
    const files = fs.readdirSync(dirPath);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const results = markdownFiles
      .map(file => {
        const filePath = path.join(dirPath, file);
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContent);
          
          return {
            title: data.title || '',
            slug: data.slug || path.basename(file, '.md'),
            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            excerpt: data.excerpt || '',
            coverImage: data.coverImage || undefined,
            tags: Array.isArray(data.tags) ? data.tags : [],
          } as ContentMeta;
        } catch (err) {
          console.error(`Error reading markdown file ${filePath}:`, err);
          return null;
        }
      })
      .filter((item): item is ContentMeta => item !== null);
    
    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error reading markdown files from ${dirPath}:`, error);
    return [];
  }
}

// Function to get a specific markdown file by slug
export function getMarkdownFileBySlug(dirPath: string, slug: string): ContentItem | null {
  try {
    if (!fs.existsSync(dirPath)) {
      console.error(`Directory ${dirPath} does not exist`);
      return null;
    }
    
    // First try exact match with slug.md
    let filePath = path.join(dirPath, `${slug}.md`);
    
    // If file doesn't exist, try to find a file that ends with the slug
    if (!fs.existsSync(filePath)) {
      const files = fs.readdirSync(dirPath);
      const matchingFile = files.find(file => 
        file.endsWith('.md') && 
        (file === `${slug}.md` || path.basename(file, '.md') === slug)
      );
      
      if (!matchingFile) {
        console.error(`No markdown file found for slug ${slug} in ${dirPath}`);
        return null;
      }
      
      filePath = path.join(dirPath, matchingFile);
    }
    
    return parseMarkdownFile(filePath);
  } catch (error) {
    console.error(`Error getting markdown file for slug ${slug}:`, error);
    return null;
  }
}

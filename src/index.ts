import puppeteer, { Browser, Page } from 'puppeteer';
import { NUM_YEARS, URL } from './constants';
import supabase from './supabase';
import { term } from './types';
import setSearchOptions from './setSearchOptions';

async function main() {
  const coursesResult = await supabase.from('availableCourses').select('subject').order('subject', { ascending: true });
  if (coursesResult.error) {
    console.error('Error: Something went wrong when fetching list of available courses');
    console.log(coursesResult.error);
  }
  const courses = coursesResult?.data?.map((course) => course.subject) as string[];

  const termsResult = await supabase.from('availableTerms').select('term,value').order('term', { ascending: true });
  if (termsResult.error) {
    console.error('Error: Something went wrong when fetching list of available terms');
    console.log(termsResult.error);
  }
  const terms = termsResult.data as term[];

  const browser: Browser = await puppeteer.launch({ headless: false });
  const page: Page = await browser.newPage();

  for (let i = 0; i < terms.length; i++) {
    for (let j = 0; j < courses.length; j++) {
      for (let k = 1; k <= NUM_YEARS; k++) {
        await page.goto(URL, { waitUntil: 'networkidle2' });
        setSearchOptions(page, courses[j], k, terms[i]);
      }
    }
  }
}

main();

import { test, expect } from '@playwright/test';
import { getDistrictBySlug, getAllDistricts } from '@/lib/districts';
import { getDistrictById } from '@/data/districts';
import path from 'path';

test.describe('Data Loading', () => {
    test('should load Angul district data', () => {
        const data = getDistrictBySlug('angul');
        expect(data).not.toBeNull();
        expect(data?.title).toBe('Angul');
        expect(data?.slug).toBe('angul');
        console.log('Loaded Angul:', data?.title);
    });

    test('should load all districts', () => {
        const districts = getAllDistricts();
        expect(districts.length).toBeGreaterThan(0);
        console.log('Total districts:', districts.length);
        const angul = districts.find(d => d.slug === 'angul');
        expect(angul).toBeDefined();
    });

    test('check content directory path', () => {
        console.log('CWD:', process.cwd());
        console.log('Content Dir:', path.join(process.cwd(), 'content', 'districts'));
    });

    test('should load Angul ID data', () => {
        const data = getDistrictById('angul');
        expect(data).toBeDefined();
        expect(data?.id).toBe('angul');
        console.log('Loaded ID Data:', data?.name_en);
    });
});

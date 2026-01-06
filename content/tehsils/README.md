# Tehsil Content Generation Guide

Follow this text-based workflow to add a new Tehsil to Odiapedia.

## 1. Directory Structure
Navigate to `content/tehsils/` and look for the parent district folder. If it doesn't exist, create it (lowercase).
```bash
mkdir -p content/tehsils/ganjam
```

## 2. File Creation
Create a new `.mdx` file using the tehsil name (lowercase, hyphens for spaces).
Example: `content/tehsils/ganjam/chatrapur.mdx`

## 3. Frontmatter Template
Copy and paste this template at the top of the file:

```yaml
---
title: "Chatrapur"
description: "Brief 1-sentence description of the tehsil."
population: "00,000"
villages_count: "00"
famous_for: "Landmark 1, Landmark 2"
image: "/images/tehsils/chatrapur.jpg"
---
```

## 4. Content Sections
Write the following standard sections:

### At a Glance
A brief 2-3 sentence overview of the tehsil's administrative significance.

### The Heritage Diary
History, origin of the name, and any myths.

### Local Landmarks
Bulleted list of temples, tourist spots, or markets.

### Taste of the Land
Unique foods or crops grown in this specific tehsil.

### Local Heroes
Famous people born here.

## 5. Verification
Run the dev server and check:
1. The URL: `http://localhost:3000/district/ganjam/chatrapur`
2. The District Page: Check if it appears in the list at `http://localhost:3000/district/ganjam`

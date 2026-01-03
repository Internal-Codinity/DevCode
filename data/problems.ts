export const problemsData = [
  {
    id: "web-scraper-amazon",
    title: "Amazon Product Scraper",
    description: `<p>Design a web scraper that extracts product information from Amazon with proper rate limiting and proxy rotation.</p>
    <p>Your scraper should be able to extract the following information for each product:</p>
    <ul>
      <li>Product title</li>
      <li>Price</li>
      <li>Rating</li>
      <li>Number of reviews</li>
      <li>Product description</li>
      <li>Product images (URLs)</li>
    </ul>`,
    difficulty: "Medium",
    category: "Web Scraping",
    tags: ["Python", "Web Scraping", "Data Extraction"],
    requirements: [
      "Implement rate limiting to avoid being blocked",
      "Rotate between multiple proxies to distribute requests",
      "Handle errors and retries gracefully",
      "Extract all required product information",
      "Save the results in a structured JSON format",
    ],
    exampleInput: `["B08N5KWB9H", "B07QDYSSF5"]`,
    exampleOutput: `[
  {
    "product_id": "B08N5KWB9H",
    "title": "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones",
    "price": "$348.00",
    "rating": "4.7/5",
    "reviews_count": "34,251 reviews",
    "description": "Industry-leading noise cancellation...",
    "image_urls": ["https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg", "..."]
  },
  {
    "product_id": "B07QDYSSF5",
    "title": "Apple AirPods Pro",
    "price": "$249.00",
    "rating": "4.8/5",
    "reviews_count": "87,125 reviews",
    "description": "Active Noise Cancellation...",
    "image_urls": ["https://m.media-amazon.com/images/I/71zny7BTRlL._AC_SL1500_.jpg", "..."]
  }
]`,
    constraints: [
      "You must respect Amazon's robots.txt and terms of service",
      "Implement a delay of at least 1 second between requests",
      "Your scraper should be able to handle at least 100 product IDs",
      "Memory usage should not exceed 100MB",
    ],
    stats: {
      acceptanceRate: "68%",
      submissions: 1245,
      difficultyRating: 7.2,
      avgTimeToSolve: "45 minutes",
    },
    testCases: [
      { type: "Functionality", passes: true },
      { type: "Rate Limiting", passes: true },
      { type: "Error Handling", passes: false },
      { type: "Proxy Rotation", passes: true },
    ],
    realWorldConstraints: [
      {
        title: "Rate Limiting",
        description:
          "Amazon implements strict rate limiting. Your scraper must handle 429 responses and back off accordingly.",
      },
      {
        title: "Anti-Scraping Measures",
        description: "Amazon may block IPs that make too many requests. Implement proxy rotation to avoid detection.",
      },
    ],
    evaluationCriteria: [
      {
        type: "functional",
        title: "Correctness",
        description: "Extracts all required information accurately",
        weight: 40,
      },
      {
        type: "performance",
        title: "Efficiency",
        description: "Minimizes request count and handles rate limiting",
        weight: 30,
      },
      {
        type: "security",
        title: "Robustness",
        description: "Handles errors, timeouts, and edge cases",
        weight: 20,
      },
      {
        type: "style",
        title: "Code Quality",
        description: "Well-structured, documented, and maintainable code",
        weight: 10,
      },
    ],
  },
  {
    id: "github-actions-ci",
    title: "GitHub Actions CI Pipeline",
    description: `<p>Create a GitHub Actions workflow for testing, building, and deploying a Node.js application.</p>
    <p>Your CI/CD pipeline should include the following stages:</p>
    <ul>
      <li>Testing: Run unit and integration tests</li>
      <li>Building: Build the application for production</li>
      <li>Deployment: Deploy the application to a production environment</li>
    </ul>`,
    difficulty: "Medium",
    category: "DevOps",
    tags: ["GitHub Actions", "CI/CD", "DevOps"],
    requirements: [
      "Create a complete GitHub Actions workflow file",
      "Implement proper job dependencies",
      "Cache dependencies to speed up builds",
      "Only deploy on the main branch",
      "Implement proper error handling and notifications",
    ],
    exampleInput: "A Node.js application repository",
    exampleOutput: `name: Node.js CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: build/

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: build/
      - name: Deploy to production
        run: |
          # Deployment commands here`,
    constraints: [
      "The workflow must be compatible with GitHub Actions",
      "The pipeline should fail if any tests fail",
      "The deployment should only happen on the main branch",
      "The workflow should be optimized for speed",
    ],
    stats: {
      acceptanceRate: "72%",
      submissions: 876,
      difficultyRating: 6.8,
      avgTimeToSolve: "35 minutes",
    },
    testCases: [
      { type: "Syntax", passes: true },
      { type: "Job Dependencies", passes: true },
      { type: "Branch Protection", passes: true },
      { type: "Caching", passes: false },
    ],
  },
  {
    id: "dynamic-form-builder",
    title: "Dynamic Form Builder",
    description: `<p>Design a form builder with validation, conditional fields, and data persistence.</p>
    <p>Your form builder should support:</p>
    <ul>
      <li>Multiple input types (text, email, select, checkbox, etc.)</li>
      <li>Field validation rules</li>
      <li>Conditional fields that appear based on other field values</li>
      <li>Form submission and data persistence</li>
    </ul>`,
    difficulty: "Hard",
    category: "Frontend",
    tags: ["React", "Forms", "Validation"],
    requirements: [
      "Create a reusable form builder component",
      "Implement client-side validation",
      "Support conditional field visibility",
      "Handle form submission and data persistence",
      "Ensure the form is accessible",
    ],
    exampleInput: `{
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "placeholder": "Enter your full name"
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "validation": {
        "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        "message": "Please enter a valid email address"
      }
    },
    {
      "id": "country",
      "type": "select",
      "label": "Country",
      "required": true,
      "options": [
        { "value": "us", "label": "United States" },
        { "value": "ca", "label": "Canada" },
        { "value": "uk", "label": "United Kingdom" },
        { "value": "au", "label": "Australia" }
      ]
    },
    {
      "id": "state",
      "type": "select",
      "label": "State/Province",
      "required": true,
      "conditional": {
        "dependsOn": "country",
        "condition": "equals",
        "value": "us"
      },
      "options": [
        { "value": "ny", "label": "New York" },
        { "value": "ca", "label": "California" },
        { "value": "tx", "label": "Texas" }
      ]
    }
  ]
}`,
    exampleOutput:
      "A dynamic form that renders based on the schema, validates user input, shows/hides conditional fields, and submits data.",
    constraints: [
      "The form builder should be reusable across different form schemas",
      "All form fields should be properly validated",
      "Conditional fields should only appear when their conditions are met",
      "The form should be accessible according to WCAG 2.1 AA standards",
    ],
    stats: {
      acceptanceRate: "54%",
      submissions: 687,
      difficultyRating: 8.5,
      avgTimeToSolve: "90 minutes",
    },
    testCases: [
      { type: "Rendering", passes: true },
      { type: "Validation", passes: true },
      { type: "Conditional Fields", passes: true },
      { type: "Accessibility", passes: false },
    ],
  },
]

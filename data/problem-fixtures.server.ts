export interface ProblemFixtureSeed {
  ordinal: number
  name: string
  input: string
  expectedOutput: string
  visibility: "sample" | "hidden"
}

export const problemFixtures: Record<string, ProblemFixtureSeed[]> = {
  "product-catalog-parser": [
    { ordinal: 0, name: "Two valid product identifiers", input: `["B08N5KWB9H", "B07QDYSSF5"]`, expectedOutput: `[{"product_id":"B08N5KWB9H"},{"product_id":"B07QDYSSF5"}]`, visibility: "sample" },
    { ordinal: 1, name: "Malformed product identifier", input: `["INVALID_ID"]`, expectedOutput: `[]`, visibility: "sample" },
    { ordinal: 2, name: "Mixed records", input: `["B000000000",null,"b08n5kwb9h","B123456789",42]`, expectedOutput: `[{"product_id":"B000000000"},{"product_id":"B123456789"}]`, visibility: "hidden" },
    { ordinal: 3, name: "Duplicate identifiers", input: `["B08N5KWB9H","B08N5KWB9H"]`, expectedOutput: `[{"product_id":"B08N5KWB9H"},{"product_id":"B08N5KWB9H"}]`, visibility: "hidden" },
    { ordinal: 4, name: "Invalid document", input: `not json`, expectedOutput: `[]`, visibility: "hidden" },
  ],
  "ci-workflow-manifest": [
    { ordinal: 0, name: "Workflow structure", input: "Generate a test and build workflow.", expectedOutput: `{"jobs":{"test":{},"build":{"needs":["test"]}}}`, visibility: "sample" },
    { ordinal: 1, name: "Main branch rule", input: "Include deployment.", expectedOutput: `{"jobs":{"test":{},"build":{"needs":["test"]},"deploy":{"needs":["build"],"branch":"main"}}}`, visibility: "sample" },
    { ordinal: 2, name: "Case-insensitive deployment request", input: "Generate TEST, BUILD, and DEPLOYMENT stages.", expectedOutput: `{"jobs":{"test":{},"build":{"needs":["test"]},"deploy":{"needs":["build"],"branch":"main"}}}`, visibility: "hidden" },
    { ordinal: 3, name: "No deployment", input: "Generate test and build stages only.", expectedOutput: `{"jobs":{"test":{},"build":{"needs":["test"]}}}`, visibility: "hidden" },
    { ordinal: 4, name: "Empty request", input: "", expectedOutput: `{"jobs":{"test":{},"build":{"needs":["test"]}}}`, visibility: "hidden" },
  ],
  "dynamic-form-schema": [
    { ordinal: 0, name: "Required field", input: `{"name":"","email":"user@example.com"}`, expectedOutput: `{"errors":{"name":"Required"},"visible":["name","email","country"]}`, visibility: "sample" },
    { ordinal: 1, name: "Conditional field", input: `{"country":"us","state":"ca"}`, expectedOutput: `{"errors":{"name":"Required","email":"Required"},"visible":["name","email","country","state"]}`, visibility: "sample" },
    { ordinal: 2, name: "Non-US country", input: `{"name":"Ada","email":"ada@example.com","country":"fr","state":"idf"}`, expectedOutput: `{"errors":{},"visible":["name","email","country"]}`, visibility: "hidden" },
    { ordinal: 3, name: "All fields valid", input: `{"name":"Ada","email":"ada@example.com","country":"us","state":"ny"}`, expectedOutput: `{"errors":{},"visible":["name","email","country","state"]}`, visibility: "hidden" },
    { ordinal: 4, name: "Malformed JSON", input: `{`, expectedOutput: `{"errors":{"name":"Required","email":"Required"},"visible":["name","email","country"]}`, visibility: "hidden" },
  ],
  "demo-sum-two-numbers": [
    { ordinal: 0, name: "Simple sum", input: "1 2", expectedOutput: "3", visibility: "sample" },
    { ordinal: 1, name: "Negative numbers", input: "-5 10", expectedOutput: "5", visibility: "sample" },
  ],
}

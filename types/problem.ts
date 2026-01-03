export interface Problem {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  tags: string[]
  requirements?: string[]
  exampleInput?: string
  exampleOutput?: string
  constraints?: string[]
  stats?: {
    acceptanceRate: string
    submissions: number
    difficultyRating: number
    avgTimeToSolve: string
  }
  testCases?: {
    type: string
    passes: boolean
  }[]
}

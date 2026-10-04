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
  sampleTests?: {
    name: string
    input: string
    expected: string
  }[]
  stats?: {
    acceptanceRate: string
    submissions: number
    difficultyRating: number
    avgTimeToSolve: string
  }
}

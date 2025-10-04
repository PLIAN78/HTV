export const mockSummary = {
  gamesAnalyzed: 24,
  mistakesFound: 187,
  accuracy: 0.92,
  lastUpload: 'Oct 3, 2025',
}

export const mockRecent = [
  { game: 'Sharks vs. Kings', date: '2025-10-01', mistakes: 12, top: 'Late backcheck' },
  { game: 'Leafs vs. Bruins', date: '2025-09-27', mistakes: 8, top: 'D-zone turnover' },
  { game: 'Rangers vs. Devils', date: '2025-09-25', mistakes: 6, top: 'Missed assignment' },
]

export type Mistake = {
  id: string
  time: number
  player: string
  type: string
  severity: 'low' | 'medium' | 'high'
  fix: string
}

export const mockMistakes: Mistake[] = [
  { id: 'm1', time: 5, player: 'C. McDavid', type: 'Missed backcheck', severity: 'high', fix: 'Shorter shifts, track inside shoulder' },
  { id: 'm2', time: 14, player: 'A. Matthews', type: 'Neutral zone turnover', severity: 'medium', fix: 'Chip deep with pressure' },
  { id: 'm3', time: 23, player: 'S. Crosby', type: 'Lost coverage', severity: 'high', fix: 'Stick in lane, shoulder checks' },
]

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/table'

const mockSummary = {
  gamesAnalyzed: 12,
  mistakesFound: 87,
  accuracy: 92,
  lastUpload: '2025-10-01 14:20',
}

const recent = [
  { game: 'Sharks vs. Kings', date: '2025-09-29', mistakes: 8, topIssue: 'Defensive zone coverage' },
  { game: 'Penguins vs. Flyers', date: '2025-09-28', mistakes: 5, topIssue: 'Neutral zone turnovers' },
  { game: 'Leafs vs. Bruins', date: '2025-09-25', mistakes: 11, topIssue: 'Forecheck pressure' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Games Analyzed</CardTitle>
            <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{mockSummary.gamesAnalyzed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Mistakes Found</CardTitle>
            <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{mockSummary.mistakesFound}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Accuracy</CardTitle>
            <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{mockSummary.accuracy}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Last Upload</CardTitle>
            <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className="text-lg">{mockSummary.lastUpload}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Game</TH>
                <TH>Date</TH>
                <TH># Mistakes</TH>
                <TH>Top Issue</TH>
              </TR>
            </THead>
            <TBody>
              {recent.map((r) => (
                <TR key={r.game}>
                  <TD>{r.game}</TD>
                  <TD>{r.date}</TD>
                  <TD>{r.mistakes}</TD>
                  <TD className="text-neutral-300">{r.topIssue}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

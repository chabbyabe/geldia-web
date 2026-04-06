import { Box, Button, Card, CardContent, CardMedia, Container, CssBaseline, Grid, Stack, ThemeProvider, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { defaultTheme } from '@interface/ui/components/common/theme/app-theme.styles'
import { PAGES } from '@interface/presenters/constants'
import HeroFinance from '@interface/media/landing/hero-finance.svg'
import DashboardShot from '@interface/media/landing/dashboard-shot.svg'
import TransactionsShot from '@interface/media/landing/transactions-shot.svg'
import ReportsShot from '@interface/media/landing/reports-shot.svg'

const SYSTEM_SHOTS = [
  {
    title: 'Dashboard Overview',
    description: 'Track balances, totals, and trendlines from one place.',
    image: DashboardShot,
  },
  {
    title: 'Transaction Flow',
    description: 'Capture income and expenses with clear status grouping.',
    image: TransactionsShot,
  },
  {
    title: 'Report Insights',
    description: 'Compare categories and understand daily, monthly and yearly performance.',
    image: ReportsShot,
  },
]

const LandingView: React.FC = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #EAF4FF 0%, #F6FCFF 44%, #FFFFFF 100%)',
          py: { xs: 5, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2.5}>
                <Typography
                  variant="overline"
                  sx={{
                    color: '#0053A3',
                    letterSpacing: 1.4,
                    fontWeight: 700,
                    fontFamily: 'Poppins, Segoe UI, sans-serif',
                  }}
                >
                  Geldia Finance System
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: '#102A43',
                    fontFamily: 'Montserrat, Segoe UI, sans-serif',
                    fontSize: { xs: '2.2rem', md: '3.2rem' },
                  }}
                >
                  Run Your Finances With Better Clarity
                </Typography>
                <Typography variant="h6" sx={{ color: '#486581', maxWidth: 560, fontWeight: 400 }}>
                  One place for accounts, categories, logs, and reports with a clean workflow for daily money decisions.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button
                    component={RouterLink}
                    to={PAGES.LOGIN.path}
                    variant="contained"
                    size="large"
                    sx={{ px: 3.6, py: 1.25, fontWeight: 700 }}
                  >
                    Log In
                  </Button>
                  <Button
                    component={RouterLink}
                    to={PAGES.SIGNUP.path}
                    variant="outlined"
                    size="large"
                    sx={{ px: 3.6, py: 1.25, borderWidth: 2, fontWeight: 700 }}
                  >
                    Create Account
                  </Button>
                </Stack>

                <Stack direction="row" spacing={3} sx={{ pt: 1 }}>
                  <Box>
                    <Typography variant="h4" fontWeight={800} color="#102A43">6+</Typography>
                    <Typography variant="body2" color="#486581">Core Modules</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={800} color="#102A43">24/7</Typography>
                    <Typography variant="body2" color="#486581">Operational Visibility</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={800} color="#102A43">100%</Typography>
                    <Typography variant="body2" color="#486581">Category Control</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: { xs: 1.5, md: 2.5 },
                  borderRadius: 5,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CDE4F7',
                  boxShadow: '0 24px 48px rgba(16, 42, 67, 0.12)',
                }}
              >
                <Box component="img" src={HeroFinance} alt="Geldia platform overview" sx={{ width: '100%', display: 'block', borderRadius: 3 }} />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: { xs: 6, md: 9 } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#102A43',
                textAlign: 'center',
                mb: 4,
                fontFamily: 'Montserrat, Segoe UI, sans-serif',
              }}
            >
              System Features
            </Typography>

            <Grid container spacing={3}>
              {SYSTEM_SHOTS.map((shot) => (
                <Grid key={shot.title} size={{ xs: 12, md: 4 }}>
                  <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid #E1EDF7', boxShadow: '0 12px 24px rgba(16, 42, 67, 0.08)' }}>
                    <CardMedia component="img" image={shot.image} alt={shot.title} sx={{ height: 220, objectFit: 'cover' }} />
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#102A43' }}>{shot.title}</Typography>
                      <Typography variant="body2" sx={{ color: '#486581', mt: 0.6 }}>{shot.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default LandingView

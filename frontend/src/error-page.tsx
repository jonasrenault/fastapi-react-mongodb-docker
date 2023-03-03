import { Typography, Grid, Button, Card, CardContent, CardActions } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

interface Error {
  status: number
  statusText: string
  data: string
  message: string
}

export default function ErrorPage() {
  const error = useRouteError() as Error
  console.error(error)
  if (isRouteErrorResponse(error)) {
    return (
      <Grid
        container
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        }}
        spacing={0}
        direction='column'
        alignItems='center'
        justifyContent='center'
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={3}>
          <Card sx={{ minWidth: 275, margin: 'auto' }}>
            <CardContent>
              <Typography variant='h1' component='div'>
                {error.status}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                {error.statusText || error.message}
              </Typography>
              <Typography variant='body2'>Sorry, an unexpected error has occured.</Typography>
            </CardContent>
            <CardActions>
              <Button component={RouterLink} to='/'>
                Back Home
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return <div>Oops</div>
  }
}

import { Grid, Container, Paper } from '@mui/material'
import LoginForm from '../components/LoginForm'

export default function Login() {
  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2} justifyContent='center'>
        <Grid item xs={12} md={7} lg={5}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <LoginForm></LoginForm>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

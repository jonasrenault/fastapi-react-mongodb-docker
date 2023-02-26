import { useLoaderData } from 'react-router-dom';
import { Container, Grid, Paper } from '@mui/material';
import userService from '../services/user.service';

export async function loader() {
  const userProfile = await userService.getProfile();
  return { userProfile };
}

export function Profile() {
  const { userProfile } = useLoaderData();
  console.log(userProfile);
  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            Some text
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            Some other text
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            Some other other text
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

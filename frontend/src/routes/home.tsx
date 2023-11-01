import { GitHub } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material'
import { useLoaderData } from 'react-router-dom'

type Feature = {
  img: string
  alt: string
  title: string
  desc: string
  github: string
  stars: number | null
}

type FeaturesCache = {
  date: string
  features: Feature[]
}

const FEATURES: Array<Feature> = [
  {
    img: 'react-router-mark.svg',
    alt: 'react-router',
    title: 'React-Router',
    desc: "React Router provides clean routing between the app's views",
    github: 'remix-run/react-router',
    stars: null,
  },
  {
    img: 'mui.svg',
    alt: 'material-ui',
    title: 'Material UI',
    desc: 'Material UI offers intuitive React UI components that follow the material design guidelines and will help you build your app faster.',
    github: 'mui/material-ui',
    stars: null,
  },
  {
    img: 'vite.svg',
    alt: 'vite',
    title: 'Vite',
    desc: 'Vite is the new generation frontend management tool to build, test and bundle your application with ease.',
    github: 'vitejs/vite',
    stars: null,
  },
  {
    img: 'hook-forms.svg',
    alt: 'react-hook-form',
    title: 'React Hook Form',
    desc: 'React Hook Form provides intuitive & flexible form support with React.',
    github: 'react-hook-form/react-hook-form',
    stars: null,
  },
  {
    img: 'fastapi-mark.svg',
    alt: 'fast-api',
    title: 'Fast-API',
    desc: 'FastAPI takes care of your backend to build fast, production ready APIs with minimum code duplication.',
    github: 'tiangolo/fastapi',
    stars: null,
  },
  {
    img: 'beanie.svg',
    alt: 'beanie',
    title: 'Beanie',
    desc: 'Beanie is an asynchronous Python object-document mapper (ODM) for MongoDB which saves time by removing boilerplate code when interacting with a MongoDB collection.',
    github: 'roman-right/beanie',
    stars: null,
  },
]

/**
 * Get stars count for github repositories and save values in cache in
 * localStorage.
 *
 * @returns {features: Feature[]}
 */
export async function loader() {
  const today = new Date().toDateString()
  const cacheValue = localStorage.getItem('farmd-features')
  if (cacheValue !== null) {
    const cache = JSON.parse(cacheValue) as FeaturesCache
    if ('date' in cache && cache.date === today) return { features: cache.features }
  }

  const data = await Promise.all(
    FEATURES.map((feature) => fetch(`https://api.github.com/repos/${feature.github}`)),
  )
  const results = await Promise.all(data.map((res) => res.json()))
  const features = FEATURES.map((feature, idx) => ({
    ...feature,
    stars: results[idx].stargazers_count,
  }))
  localStorage.setItem('farmd-features', JSON.stringify({ date: today, features }))

  return { features }
}

export default function Home() {
  const { features } = useLoaderData() as { features: Feature[] }
  const formatter = Intl.NumberFormat('en', { notation: 'compact', maximumSignificantDigits: 3 })

  return (
    <main>
      <Box
        sx={{
          pt: 8,
          pb: 2,
        }}
      >
        <Container maxWidth='sm'>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href='https://fastapi.tiangolo.com/'>
              <Box
                component='img'
                sx={{
                  width: 250,
                }}
                alt='FastAPI'
                src='fastapi.png'
              />
            </Link>

            <Typography variant='h3' sx={{ mr: 2 }} color='text.secondary'>
              +
            </Typography>

            <Link href='https://reactjs.org/' underline='none'>
              <Box sx={{ display: 'flex' }}>
                <Box
                  component='img'
                  sx={{
                    width: 40,
                    mr: 1,
                  }}
                  alt='ReactIcon'
                  src='react.svg'
                />
                <Typography variant='h3' align='center' color='rgb(97, 218, 251)'>
                  React
                </Typography>
              </Box>
            </Link>

            <Typography variant='h3' sx={{ mx: 2 }} color='text.secondary'>
              +
            </Typography>

            <Link href='https://www.mongodb.com/'>
              <Box
                component='img'
                sx={{
                  // height: 233,
                  width: 250,
                }}
                alt='MongoDB'
                src='mongodb.png'
              />
            </Link>

            <Typography variant='h3' sx={{ mr: 2, ml: 1 }} color='text.secondary'>
              +
            </Typography>

            <Link href='https://www.docker.com/'>
              <Box
                component='img'
                sx={{
                  // height: 233,
                  width: 250,
                }}
                alt='Docker'
                src='docker.png'
              />
            </Link>
          </Box>
          <Typography variant='h3' align='center' color='text.secondary' sx={{ mt: 5 }}>
            = FARMD
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth='md'>
        <Box sx={{ mb: 4 }}>
          <Typography variant='body1'>
            FARMD is a minimalist starter template for a FARM application stack ready to run with
            docker. It offers basic user management, with options for OAuth2 support via Google, so
            that you can get started straight away. It is built with a clean design & minimal
            dependencies in mind, keeping only the essentials.
          </Typography>
          <Typography variant='h6' gutterBottom sx={{ mt: 4 }}>
            Features
          </Typography>
          <Divider />
        </Box>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item key={feature.title} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component='img'
                  sx={{
                    width: 250,
                    height: 140,
                    padding: 5,
                    objectFit: 'contain',
                  }}
                  image={feature.img}
                  title={feature.alt}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant='h6' component='div'>
                    {feature.title}
                  </Typography>
                  <Typography color='text.secondary'>{feature.desc}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant='outlined'
                    startIcon={<GitHub />}
                    component={Link}
                    href={`https://github.com/${feature.github}`}
                    target='_blank'
                  >
                    {feature.stars ? formatter.format(feature.stars) : ''}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  )
}

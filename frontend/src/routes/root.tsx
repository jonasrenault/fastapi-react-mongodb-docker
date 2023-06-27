import * as React from 'react'
import { Outlet } from 'react-router-dom'
import TopMenuBar from '../components/TopMenuBar'
import { Box, Toolbar } from '@mui/material'

export default function Root() {
  return (
    <Box sx={{ display: 'flex' }}>
      <TopMenuBar />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          paddingBottom: 5,
        }}
      >
        <Toolbar></Toolbar>
        <Outlet />
      </Box>
    </Box>
  )
}

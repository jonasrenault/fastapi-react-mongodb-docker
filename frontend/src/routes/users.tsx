import { useState } from 'react'
import { useLoaderData, redirect } from 'react-router-dom'
import {
  Grid,
  Container,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSnackBar } from '../contexts/snackbar'
import UserProfile from '../components/UserProfile'
import userService from '../services/user.service'
import { useAuth } from '../contexts/auth'
import { User } from '../models/user'

export async function loader() {
  try {
    const users = await userService.getUsers()
    return { users }
  } catch {
    return redirect('/')
  }
}

export default function Users() {
  const { users: initialUsers } = useLoaderData() as { users: User[] }
  const { user: currentUser } = useAuth()
  const { showSnackBar } = useSnackBar()
  const [users, setUsers] = useState<Array<User>>(initialUsers)
  const [selectedUser, setSelectedUser] = useState<User>()
  const [toDeleteUser, setToDeleteUser] = useState<User>()
  const [open, setOpen] = useState(false)

  const handleSelect = (user: User) => () => {
    setSelectedUser(user)
  }

  const handleUserUpdate = (update: User) => {
    setUsers(users.map((user) => (user.uuid == update.uuid ? update : user)))
  }

  const handleUserDelete = (user: User) => () => {
    setToDeleteUser(user)
    setOpen(true)
  }

  const handleCancel = () => setOpen(false)

  const handleConfirm = async () => {
    if (toDeleteUser) {
      setOpen(false)
      await userService.deleteUser(toDeleteUser.uuid)
      showSnackBar('User deleted successfully.', 'success')
      setUsers(users.filter((user) => user.uuid !== toDeleteUser.uuid))
      if (selectedUser && selectedUser.uuid === toDeleteUser.uuid) {
        setSelectedUser(undefined)
      }
    }
    setToDeleteUser(undefined)
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2} justifyContent='center'>
        <Grid item xs={12} md={5}>
          <Paper>
            <List
              sx={{ maxHeight: 450, overflow: 'auto', '::-webkit-scrollbar': { display: 'none' } }}
            >
              {users.map((user) => {
                return (
                  <ListItem
                    key={user.uuid}
                    secondaryAction={
                      currentUser?.uuid !== user.uuid && (
                        <IconButton edge='end' aria-label='delete' onClick={handleUserDelete(user)}>
                          <DeleteIcon />
                        </IconButton>
                      )
                    }
                    disablePadding
                  >
                    <ListItemButton
                      onClick={handleSelect(user)}
                      selected={selectedUser?.uuid == user.uuid}
                      data-testid={user.uuid}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={user.first_name + ' ' + user.last_name}
                          src={user.picture && user.picture}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.email}
                        secondary={
                          (user.first_name || user.last_name) &&
                          user.first_name + ' ' + user.last_name
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7} lg={5}>
          {selectedUser && (
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <UserProfile
                userProfile={selectedUser}
                onUserUpdated={handleUserUpdate}
                allowDelete={false}
              ></UserProfile>
            </Paper>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this user ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} autoFocus>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant='contained' color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

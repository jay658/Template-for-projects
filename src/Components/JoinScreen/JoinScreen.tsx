import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";

import AvatarSelect from './AvatarSelect';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import JoinScreenErrors from "./ErrorMessage";
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import socket from "../Websocket/socket";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'

export type ErrorStateT = {
  roomNotFound: string,
  roomNameTaken: string
}

type JoinScreenPropsT = {
  setUsername: (username: string) => void,
  username: string
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '40vw',
  height: '40vh',
  border: '1px solid black',
  top: '50%',
  left: '50%',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
}));

const InLineContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const JoinScreen = ({setUsername}: JoinScreenPropsT): ReactElement => {
  const [name, setName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [error, setError] = useState<ErrorStateT>({
    roomNotFound: '',
    roomNameTaken: ''
  })
  const errorRef = useRef(error)
  const [openError, setOpenError] = useState(errorRef.current.roomNotFound? true: false)
  const navigate = useNavigate()

  useEffect(() => {
    socket.on("room_not_found", (data) => {
        setOpenError(true)
        setError(prevError => {
          const newError = { ...prevError, roomNotFound: data }
          errorRef.current = newError
          return newError
        });
    });

    socket.on("room_name_taken", (data) => {
      setOpenError(true)
      setError(prevError => {
        const newError = {...prevError, roomNameTaken: data}
        errorRef.current = newError
        return newError
      })
    })

    // Cleanup by removing the event listener when the component unmounts
    return () => {
        socket.off("room_not_found");
        socket.off("room_name_taken")
    };
}, []);
  
  const handleCreateRoom = () => {
    socket.emit('update_username', name)
    socket.emit("create_room", roomName)
    socket.username = name
    if(!errorRef.current.roomNameTaken) console.log(`${name} created room ${roomName}`)
  }

  const handleJoinRoom = () => {
    socket.emit('update_username', name)
    socket.emit("join_room", roomName)
    socket.username = name
    if(!errorRef.current.roomNotFound) console.log(`${name} joined room ${roomName}`)
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleRoomChange = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedError = {...error, roomNameTaken: '', roomNotFound: ''}
    setError(updatedError)
    errorRef.current = updatedError
    setRoomName(e.target.value)
  }

  const handleGoToRoomList = () => {
    socket.username = name
    setUsername(name)
    navigate('/rooms')
  }
  
  return(
    <Grid container spacing={2}>
      <Grid>
        <Item>
          <h1>APP'S NAME</h1>
          <InLineContainer>
            <TextField
              required
              label="Username"
              defaultValue=""
              onChange={handleNameChange}
              inputProps={{ maxLength: 15 }}
            />
            <AvatarSelect/>
          </InLineContainer>
          <TextField
            required
            label="Room name"
            defaultValue={name}
            onChange={handleRoomChange}
            inputProps={{ maxLength: 15 }}
          />
          <InLineContainer>
            <Button onClick={handleCreateRoom} disabled={!roomName || !name}>CREATE ROOM</Button>
            <Button onClick={handleJoinRoom} disabled={!roomName || !name}>JOIN ROOM</Button>
          </InLineContainer>
          <InLineContainer>
            <Button onClick={handleGoToRoomList} disabled={!name}>
              Join an existing room (Pick a username first!)
            </Button>
          </InLineContainer>
        </Item>
        <JoinScreenErrors error={errorRef.current} openError={openError} setOpenError={setOpenError}/>
      </Grid>
    </Grid>
  )
}

export default JoinScreen
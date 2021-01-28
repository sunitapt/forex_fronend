import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from "axios"
import setTokenHeader from "services/api.js"
import {API_URL} from "constants.js"
import Dashboard from '../Dashboard/Dashboard';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/nikhilbghodke">
        Nikhil Ghodke
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide(props) {
  const classes = useStyles();
  const [email,setEmail]=useState("")
  const [password,setPassword] =useState("")
  const [error,setError]=useState(null)
  
  const userSignedIn= ()=>{
    let token=localStorage.getItem("jwtToken")
    if(token){
      console.log(token)
      setTokenHeader(token)
      props.history.push("/admin/dashboard")
    }
    

  }
  userSignedIn()

  const onSubmit=async (e)=>{
    e.preventDefault();
    var res;
    try{
      res= await axios.post(`${API_URL}/login`,{email,password})
     //console.log(res.data)
      localStorage.setItem('user', JSON.stringify(res.data));
      setTokenHeader(res.data.token)
      props.history.push("/admin/dashboard")
    }
    catch(e){
      //console.log(e.response.data.error.message)
      setError(e.response.data.error.message)
    }
    
    
  }

  const getSnackBars=()=>{
    let ans="";
    if(error){
        return (

      <Snackbar open={true} autoHideDuration={6000} onClose={()=>{setError(null)}}>
        <Alert onClose={()=>{setError(null)}} severity="error">
          {error}
        </Alert>
      </Snackbar>)
    }
    
    
  }



  return (
    <Grid container component="main" className={classes.root}>
      {getSnackBars()}
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} >
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e)=>{setEmail(e.currentTarget.value)}}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              autoComplete="current-password"
              onChange={(e)=>{setPassword(e.currentTarget.value)}}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container style={{display:"flex", justifyContent:"flex-end"}}>
              
              <Grid item>
                <Link href="/#/signUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
        </Grid>
      </Grid>
    
  );
}
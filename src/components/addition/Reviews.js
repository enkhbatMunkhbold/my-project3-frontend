import React, { Fragment, useState, useContext, useEffect } from 'react'
import { MoviesContext } from '../context/movies'
import { Container, FormControl, Grid, List, ListItem, TextField } from '@material-ui/core';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
// import EditIcon from '@mui/icons-material/Edit';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  formControl: {
    margin: theme.spacing(3),
    width: '100%'
  },
  textField: {
    margin: 10
  },
  listStyle: {
    height: '30rem',
    overflow: 'auto'
  },
  containerStyle: {
    height: '14rem'
  }, 
  reveiwField: {
    height: '32rem'
  },
  buttonStyle: {
    size: 'large',    
    margin: theme.spacing(5)
  }
}));

const Reviews = ({ movie }) => { 
  
  const { movies, setMovies } = useContext(MoviesContext)
  let { id, reviews } = movie
  const [showBtn, setShowBtn] = useState(false)
  const [fields, setFields] = useState([])
  const [thisMovieReviews, setThisMovieReviews] = useState([])
  const [userReview, setUserReview] = useState({
    name: '',
    comment: ''
  })
  
  const classes = useStyles();

  useEffect(() => {
    fetch(`http://localhost:9292/movies/${id}/reviews`)
    .then(res => res.json())
    .then(data => {
      const reviewData = data.filter(m => m.movie_id === id)
      setThisMovieReviews(reviewData)
    })
  }, [setThisMovieReviews])

  const handleClick = (e) => {
    console.log(e.target)
  }

  const listMovieReviews = thisMovieReviews.map((user, index) =>     
    <ListItem key={index}>
      <Grid container onMouseEnter={() => setShowBtn(true)} onMouseLeave={() => setShowBtn(false)}>       
        <Grid item md={12}>
          <Typography sx={{fontWeight: 'bold'}}>
            {user.name}
          </Typography>
        </Grid>
        <Grid item md={11}>
          {user.comment}         
        </Grid> 
        {
          showBtn ? <div>
            {/* <Grid item md={1}>
              <EditIcon/>
            </Grid>  */}
            <Grid item md={1}>
              <ClearIcon onClick={handleClick}/>
            </Grid> 
          </div> : null              
        }
           
      </Grid>      
    </ListItem>
  )

  const handleChange = (e) => {
    setUserReview({...userReview, [e.target.name]: e.target.value})    
    setFields([...fields, e.target])
  }

  const handleSubmit = (e) => {   
    e.preventDefault()  
    console.log('User review:', userReview)

    fetch( `http://localhost:9292/movies/${id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(userReview)
    }).then(res => res.json())
      .then(data => {
        console.log("Posted review:", data)
        reviews = [...reviews, data]
        setThisMovieReviews(data)
        movies.map(m => m.id === id ? movie : m)
        setMovies(movies)
      })
    fields.forEach(f => f.value = '')
  }
  return (
    <Fragment>
      <Grid container direction={'column'} spacing={6}>
        <Grid className={classes.reveiwField} item>
          <List className={classes.listStyle}>
            {listMovieReviews}
          </List>
        </Grid>
        <Container className={classes.containerStyle}>
          <Grid container >
            <FormControl className={classes.formControl} onSubmit={handleSubmit}>
              <TextField className={classes.textField}
                label='User'
                placeholder='Insert user name...'
                variant='standard'
                onChange={handleChange}
                name='name'
              />
              <TextField className={classes.textField}
                label='Review'
                placeholder='Type your comment...'
                variant='outlined'
                onChange={handleChange}
                name='comment'
              />  
              <Grid>
                <Button fullWidth 
                  type='submit'
                  variant='contained' 
                  label='Send'
                  endIcon={<SendIcon/>}
                  className={classes.buttonStyle}
                  onClick={handleSubmit}
                >
                  Send
                </Button>
              </Grid>      
            </FormControl>
          </Grid>          
        </Container>
      </Grid>
    </Fragment>
  )
}

export default Reviews
import React,{useState, useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import avatar from "assets/img/faces/marc.jpg";
import axios from 'axios';
const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

function ReviewCard({review}) {
  return (
    <Box component="fieldset" mb={1} borderColor="transparent">
      <Box>{review.username}</Box>
      <Rating name="read-only" value={review.stars} readOnly />
      <Box>{review.comments}</Box>
    </Box>
  )
}


export default function UserProfile(props) {
  console.log(props)
  const classes = useStyles();
  var { user } = JSON.parse(localStorage.getItem('user'));
  console.log(user.about)
  var [reviews, setReviews] = useState([])
  const getReviews = async ()=>{
   var res = await axios.get(`http://localhost:8081/allratings/${user.title}`)
   console.log(res.data)
   setReviews(res.data)
  }
  useEffect(()=>{
    getReviews()
  },[])


  return (
    <div>
      <GridContainer>
        <GridItem xs={14} sm={15} md={6} width="40%">
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h2 className={classes.cardCategory}>{user.title}</h2>
              <p className={classes.description}>
                {user.about}
              </p>
              <Box component="fieldset" mb={1} borderColor="transparent">
                <Typography component="legend">Average Rating</Typography>
                <Rating name="read-only" value={user.stars} readOnly />
              </Box>
              <Typography component="legend">Reviews</Typography>
              {reviews.map((review, index) => {
                return(<ReviewCard review={review}/>)
              })}

              <Button color="primary" round>
                {user.contact}
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

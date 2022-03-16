import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material/";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Rating from "@mui/material/Rating";
import CardActionArea from "@mui/material/CardActionArea";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";

import { motion } from "framer-motion";
import { AnimateSharedLayout } from "framer-motion";

import useStyles from "./styles";

import API from "../axios";
import axios from "axios";
import Popup from "./Popup";

import { UserContext } from "../context/UserContext";
import { green, lightGreen } from "@mui/material/colors";

import CommentBox from "./CommentBox";
import { DialogContentText } from "@mui/material";

const LikeButton = (props) => {
  const [liked, setLiked] = useState(props.isLiked);
  const [likes, setLikes] = useState(props.likes);

  const [open, setOpen] = useState(false);

  const { loggedIn, isLiked, setIsLiked } = useContext(UserContext);

  const handleErrorLike = () => {
    setOpen(true);
  };

  function handleLikePressed() {
    if (liked) {
      API.get(`recipes/${props.id}/`).then((recipe) => {
        setIsLiked(recipe.data.title);
      });
      API.delete("recipes/" + props.id + "/like/").then(
        (message) => console.log(message.data),
        setLiked(false),
        setLikes(likes - 1)
      );
    } else {
      API.post("recipes/" + props.id + "/like/").then(
        (message) => console.log(message),
        setLiked(true),
        setLikes(likes + 1)
      );
    }
  }

  useEffect(() => {}, [liked, likes]);

  if (loggedIn) {
    return (
      <>
        <Button
          size="small"
          color={liked ? "primary" : "secondary"}
          onClick={handleLikePressed}
        >
          <ThumbUpAltIcon fontSize="small" /> {" " + likes}
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Popup
          open={open}
          setOpen={setOpen}
          type="error"
          message="Not Logged In"
        />
        <Button size="small" onClick={handleErrorLike}>
          <ThumbUpAltIcon fontSize="small" /> {" " + likes}
        </Button>
      </>
    );
  }
};

const RatingComponent = () => {
  const { loggedIn } = useContext(UserContext);

  if (loggedIn) {
    return (
      <Rating
        name="simple-controlled"
        value={1}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    );
  } else {
    return <Rating name="simple-controlled" value={2} disabled />;
  }
};

/*const DeleteButton = (props) => {
  const { loggedIn } = useContext(UserContext);
  const [deleted, setDeleted] = useState(false);
  function handleDeletePressed() {
    API.delete("recipes/" + props.id).then(
      (message) => console.log(message),
      setDeleted(true)
    );
  }

  if (loggedIn) {
    return (
      <Button
        size="small"
        color="primary"
        disabled={deleted ? true : false}
        onClick={handleDeletePressed}
      >
        <DeleteIcon fontSize="small" /> Delete
      </Button>
    );
  } else {
    return <div></div>;
  }
}; */

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TestCard = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    console.log("handle click open clicked");
    setOpen(true);
  };

  const handleClose = () => {
    console.log("handle close clicked");
    setOpen(false);
  };

  //TODO Drill props til parent

  return (
    <AnimateSharedLayout>
      <motion.div layout>
        <Dialog
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <img
            style={{ maxWidth: "100%", height: "auto" }}
            src={props.image}
            alt="image"
          />
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{props.author}</DialogContentText>
            <DialogContentText>{props.summary}</DialogContentText>
            <Rating
              /* key={props.id} er denne nødvendig? id={props.id} */
              value={props.avgRating}
              readOnly
            />
          </DialogContent>
          <CommentBox />
        </Dialog>
        <Card className={classes.card}>
          <CardActionArea onClick={handleClickOpen}>
            <CardMedia
              className={classes.media}
              image={props.image}
              title={props.title}
              alt="image"
            />
            <div className={classes.overlay}>
              <Typography variant="h6">
                {props.author ? props.author : "Author"}
              </Typography>
              <Typography variant="body2">{props.created}</Typography>
            </div>
            <div className={classes.overlay2}>
              <Button
                disabled={true}
                style={{ color: "white" }}
                size="small"
                onClick={() => console.log("clicked")}
              >
                <MoreHorizIcon fontSize="medium" />
              </Button>
            </div>
            <div className={classes.details}>
              <Typography variant="body2" color="textSecondary" component="h2">
                {props.tags.map((s) => "#" + s).join(", ")}
                {/* prepend all elements with a # and display nicely */}
              </Typography>
            </div>
            <Typography
              className={classes.title}
              gutterBottom
              variant="h5"
              component="h2"
            >
              {props.title}
            </Typography>
            <CardContent>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                style={{ whiteSpace: "pre-line" }}
                align="justify"
              >
                {props.summary}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions className={classes.cardActions}>
            <LikeButton
              /* key={props.key} er denne nødvendig?*/
              id={props.id}
              likes={props.likes}
              isLiked={props.isLiked}
            />
            <Rating
              /* key={props.id} er denne nødvendig? id={props.id} */
              value={props.avgRating}
              readOnly
            />
          </CardActions>
        </Card>
      </motion.div>
    </AnimateSharedLayout>
  );
};

export default TestCard;

import "../App.css";
import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import queries from "../queries";
import DeleteModal from './DeleteModal';

import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    makeStyles,
    Button
} from '@material-ui/core';




function Home(props) {
    const [pageNum, setPageNum] = useState(1);
    const [deleteImage, setDeleteImage] = useState(null);
    const [imageDeleteModal, setImageDeleteModal] = useState(false);
    const type = props.type;
    let imageData = null;

    const {loading: unsplashLoading, error: unsplashError, data: unsplashData} = useQuery(
        queries.unsplash,
        {
            variables: { pageNum },
            fetchPolicy: 'cache-first'
        }
    );
    const {loading: mybinLoading, error: mybinError, data: mybinData} = useQuery(
        queries.mybin,
        {
            fetchPolicy: 'cache-first'
        }
    );
    const {loading: mypostLoading, error: mypostError, data: mypostData} = useQuery(
        queries.mypost,
        {
            fetchPolicy: 'cache-first'
        }
    );

    const [updateImage] = useMutation(queries.userUpdateImage);
    const updateData = (image) => {
        updateImage({
            variables: {
                id: image.id,
                url: image.url,
                posterName: image.posterName,
                description: image.description,
                userPosted: image.userPosted,
                binned: !image.binned,
            },
        });
        console.log(image);
    };
    

    const [changeBin] = useMutation(queries.userUpdateImage, {
        update(cache, {data: {changeBin}}) {
          const { binnedImages } = cache.readQuery({
            query: queries.mybin,
            
          });
          //console.log(cache.readQuery);
          cache.writeQuery({
            query: queries.mybin,
            data: {
                binnedImages: binnedImages.filter((e) => e.binned === true)
            },
          });
          //console.log(cache.writeQuery);
        },
      });
/*
    const deleteImage = async (image) => {
        try {
          removeImage({
            variables: {
              id: image.id,
            },
          });
        } catch (error) {
          throw Error(error.message);
        }
    };
*/
    const [removeImage] = useMutation(queries.userDeletePost, {
        update(cache, {data: {removeImage}}) {
          const { userPostedImages } = cache.readQuery({
            query: queries.mypost,
          });
          cache.writeQuery({
            query: queries.mypost,
            data: {
                userPostedImages: userPostedImages.filter((e) => e.id === mypostData.userPostedImages.id)
            },
          });
        },
      });
    
    //const handleCloseDeleteModals = () => {
        //setImageDeleteModal(false);
    //};
    
      //const handleOpenDeleteModal = (image) => {
        //setImageDeleteModal(true);
        //setDeleteImage(image);
    //};
    const buildCard = (image) => {
        return (
            <div className="App-image" key={image.id}>
                <ul>
                    <div className='image-body'>
                        <p>
                            Description:{image.description}
                        </p>
                        <p>
                            Author: {image.posterName}
                        </p>
                        <img src={image.url} alt="unsplash" className="image" />
                    </div>
                    <div>
                        {image.binned === false && (
                            <button className="button" onClick={(e) => {e.preventDefault();
                                //updateData(image);
                                changeBin({
                                    variables: {
                                        id: image.id,
                                        url: image.url,
                                        posterName: image.posterName,
                                        description: image.description,
                                        userPosted: image.userPosted,
                                        binned: !image.binned,
                                    },
                                });
                                //alert('Image bin');
                                }}>
                                Add to Bin
                            </button>

                        )}
                        {image.binned === true && (
                            <button className="button" onClick={(e) =>{e.preventDefault();
                                //updateData(image);
                                changeBin({
                                    variables: {
                                        id: image.id,
                                        url: image.url,
                                        posterName: image.posterName,
                                        description: image.description,
                                        userPosted: image.userPosted,
                                        binned: !image.binned,
                                    },
                                });
                                //alert('Image unbin');
                                }}>
                                Remove from Bin
                            </button>
                        )}
                        {type === "my-posts" &&(
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeImage({
                                        variables:{
                                            id:image.id
                                        } 
                                    });
                                    alert('Image deleted');
                                    //handleOpenDeleteModal(image);
                                }}>
                                Delete Post
                            </Button>      
                        )}
                    </div>
                </ul>
            </div>
        )
    };

    if (type === "main") {
        imageData = unsplashData && unsplashData.unsplashImages.map((image) => {
            return buildCard(image);
        });
    }
    //my bin page need to refresh the page to show the newest data
    else if(type === "my-bin") {
        imageData = mybinData && mybinData.binnedImages.map((image) => {
            return buildCard(image);
        });
    }
    //my post page need to refresh the page after the delete
    else if( type === "my-posts") {
        imageData = mypostData && mypostData.userPostedImages.map((image) => {
            return buildCard(image);
        });
    }
    const MorePage = () => {
        setPageNum(1 + pageNum);
    };
    if ((type === "main" && unsplashLoading) || (type === "my-bin" && mybinLoading) || (type === "my-posts" &&  mypostLoading)) {
        return <div>Loading...</div>;
    }
    else if((type === "main" && unsplashData) || (type === "my-bin" && mybinData) || (type === "my-posts" &&  mypostData)){
        return(
            <div>
                {type === "my-posts" && (
                    <div>
                        <Button
                            color="primary"
                            variant="contained"
                            className='button'
                        >
                        <a href="/new-post">New Post</a>
                        </Button>
                    </div>                        
                )}
                    {/*my bin page need to refresh the page to show the newest data*/}
                {type === "my-bin" && mybinData && mybinData.binnedImages.length === 0 &&(
                    <p>No bin image</p>       
                )}
                {/*my post page need to refresh the page after the delete*/}
                {type === "my-posts" && mypostData && mypostData.userPostedImages.length === 0 &&(
                    <p>No posts image</p>       
                )}
                <div className="image">
                    {imageData}
                </div>
                {type === "main" && (
                    <div>
                        <Button
                            color="primary"
                            variant="contained"
                            className='morebutton'
                            onClick={() => MorePage()}
                        >
                            More images
                        </Button>
                    </div>                        
                )}
                {/*
                    {imageDeleteModal && (
                        <DeleteModal
                            //isOpen={imageDeleteModal}
                            //handleClose={handleCloseDeleteModals}
                            //deleteImage={deleteImage}
                        />
                    )}
                    */}
            </div>
        );
    }
    else{
        return(
            <div>
                {type === "main" && unsplashError && (
                    <div>
                        <h2>{unsplashError.message}</h2>
                    </div>
                )}
                {type === "my-bin" && mybinError && (
                    <div>
                        <h2>{mybinError.message}</h2>
                    </div>
                )}
                {type === "my-posts" && mypostError && (
                    <div>
                        <h2>{mypostError.message}</h2>
                    </div>
                )}
            </div>
        )
    }
}

export default Home;
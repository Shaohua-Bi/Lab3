import React, {useState} from 'react';

import '../App.css';
import ReactModal from 'react-modal';
import {useQuery, useMutation} from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';

//For react-modal
ReactModal.setAppElement('#root');
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        border: '1px solid #28547a',
        borderRadius: '4px',
    },
};

function NewPost(props) {
    //const [addNewPost, setAddNewPost] = useState(queries.userUploadPost);
    const [addNewPost] = useMutation(queries.userUploadPost);
    let body = null;
    let description;
    let url;
    let posterName;
    body = (
        <form  className='form' id='add-employee'
            onSubmit={(e) => {
                e.preventDefault();
                addNewPost({
                    variables: {
                        description: description.value,
                        url: url.value,
                        posterName: posterName.value,
                    },
                });
                description.value = '';
                url.value = '';
                posterName.value = '';
                alert('Image Added');
            }}
        >
            <div className='form-group'>
                <label>
                    Descript: 
                    <br />
                    <input ref = {(node) =>{
                            description = node;
                        }}
                        required
                        autoFocus={true}
                    />
                </label>
            </div>
            <br />
            <div className='form-group'>
                <label>
                    Image URL: 
                    <br />
                    <input ref = {(node) =>{
                            url = node;
                        }}
                        required
                    />
                </label>
            </div>
            <br />
            <div className='form-group'>
                <label>
                    Author Name: 
                    <br />
                    <input ref = {(node) =>{
                            posterName = node;
                        }}
                        required
                    />
                </label>
            </div>
            <br />
            <br />
            <button className='button' type='submit'>
                Add Image
            </button>
        </form>
    );
    return (
        <div>
            {body}
        </div>
    );
}
  
export default NewPost;
  
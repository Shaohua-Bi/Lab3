import React, {useState} from 'react';
import '../App.css';
import {useMutation} from '@apollo/client';
import ReactModal from 'react-modal';

//Import the file where my query constants are defined
import queries from '../queries';

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
        borderRadius: '4px'
    }
};

function DeleteModal(props) {
    const [imageDeleteModal, setImageDeleteModal] = useState(props.isOpen);
    const [userImage, setUserImage] = useState(props.deleteImage);
  
    const [removeImage] = useMutation(queries.userDeletePost, {
      update(cache, {data: {removeImage}}) {
        const {userPostedImages} = cache.readQuery({
            query: queries.mypost
        });
        cache.writeQuery({
            query: queries.mypost,
            data: {
            userPostedImages: userPostedImages.filter((e) => e._id !== userImage._id)
            }
        });
      }
    });
  
    const handleCloseDeleteModal = () => {
        setImageDeleteModal(false);
        setUserImage(null);
        props.handleClose();
    };
  
    return (
        <div>
            {/*Delete Employee Modal */}
            <ReactModal
                name='deleteModal'
                isOpen={imageDeleteModal}
                contentLabel='Delete User Image'
                style={customStyles}
            >
            {/*Here we set up the mutation, since I want the data on the page to update
                after I have added someone, I need to update the cache. If not then
                I need to refresh the page to see the data updated 
  
                See: https://www.apollographql.com/docs/react/essentials/mutations for more
                information on Mutations
            */}
            <div>
                <p>
                    Are you sure you want to delete this Image?
                </p>
  
                <form className='form' id='delete-employee' onSubmit={(e) => {
                    e.preventDefault();
                    removeImage({
                    variables: {
                        id: userImage._id
                    }
                    });
                    setImageDeleteModal(false);
  
                    alert('User Image Deleted');
                    props.handleClose();
                }}
                >
                <br />
                <br />
                <button className='button' type='submit'>
                    Delete Image
                </button>
            </form>
            </div>
  
            <br />
            <br />
            <button className='button' onClick={handleCloseDeleteModal}>
                Cancel
            </button>
        </ReactModal>
      </div>
    );
}
  
export default DeleteModal;
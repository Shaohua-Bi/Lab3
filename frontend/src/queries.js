import { gql } from '@apollo/client';

const unsplash = gql`
    query unsplashImages($pageNum: Int) {
        unsplashImages(pageNum: $pageNum) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const mybin = gql`
    query binnedImages{
        binnedImages{
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const mypost = gql`
    query userPostedImages{
        userPostedImages{
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const userUploadPost = gql`
    mutation UserUploadPost(
        $url: String!
        $description: String
        $posterName: String
        ){
        userUploadPost(
            url: $url
            description: $description
            posterName: $posterName
            ){
                id
                url
                posterName
                description
                userPosted
                binned
        }
    }
`;

const userUpdateImage = gql`
    mutation UserUpdateImage(
        $id: ID!
        $url: String
        $posterName: String
        $description: String
        $userPosted: Boolean
        $binned: Boolean
        ){
        userUpdateImage(
            id: $id
            url: $url
            posterName: $posterName
            description: $description
            userPosted: $userPosted
            binned: $binned
        ){
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const userDeletePost = gql`
    mutation UserDeleteImage(
        $id: ID!
    ){
        userDeletePost(id: $id){
            id
        }
}
`;

let exported = {
    unsplash,
    mybin,
    mypost,
    userUploadPost,
    userUpdateImage,
    userDeletePost
  };
  
  export default exported;

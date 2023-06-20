const { ApolloServer, gql } = require("apollo-server");
const uuid = require("uuid");
const redis = require("redis");
const { createClient } = require('redis');
const client = createClient();
//const client = redis.createClient();
const axios = require('axios');
client.connect().then(() => {});
const flat = require("flat");
const unflatten = flat.unflatten;

//Create the type definitions for the query and our data
const typeDefs = gql`
  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }
  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }

  type Mutation {
    userUploadPost(
        url: String!,
        description: String,
        posterName: String
        ): ImagePost,
    userUpdateImage(
        id: ID!,
        url: String,
        posterName: String,
        description: String,
        userPosted: Boolean,
        binned: Boolean
    ): ImagePost,
    userDeletePost(id: ID!): ImagePost
}
`;


const resolvers = {
    Query: {
        unsplashImages: async (_, args) => {
            //try{
            const { data } = await axios.get("https://api.unsplash.com/photos/?client_id=YFgvwNozJtWAxHYmMh1gdUMLWOhXEbF4jXXEcaU_h1o&page="+ args.pageNum);
            //const theBinnedImages = (await client.LRANGE('userPostedImages', 0, -1)).map(JSON.parse);
            const binnedImages = await client.HGETALL("userPostedImages");
            const test = Object.values(binnedImages).map(ele => JSON.parse(ele)).filter(ele => ele.binned === true);
            const theList = [];
            data.forEach(element => {
                    
                    let checkBin = false;
                    for(let i = 0; i < test.length;i++){
                        if (test[i].id === element.id) {
                            checkBin = true;
                        }
                    }
                    
                let image = {
                    id: element.id,
                    url: element.urls.small,
                    posterName: element.user.name,
                    description: element.description,
                    userPosted: false,
                    //binned: false,
                    binned: checkBin,
                }
                theList.push(image);
            });
            return theList;
            
            //}catch(error){
                //res.status(404).json(error);
                //throw Error(error.message);
            //}
            
        },

        binnedImages: async () => {
    
                //const binnedImages = await client.HGETAll('userPostedImages').map(JSON.parse).filter(element=>{element.binned == true});
            //const binnedImages = await client.HGETALL("binnedImages");
            const binnedImages = await client.HGETALL("userPostedImages");
            //const test = Object.values(binnedImages).map(element => {JSON.parse(element)}).filter(element => {element.binned === true});
            const test = Object.values(binnedImages).map(ele => JSON.parse(ele)).filter(ele => ele.binned === true);
                //const test = Object.values(binnedImages).map(JSON.parse).filter(element=>{element.binned == true});
            return test;
            

            
        },

        userPostedImages: async () => {
            //try{
            const userPostedImages = await client.HGETALL("userPostedImages");
            //const test = Object.values(userPostedImages).map(element => {JSON.parse(element)}).filter(element => {element.userPosted === true});
            const test = Object.values(userPostedImages).map(ele => JSON.parse(ele)).filter(ele => ele.userPosted === true);
                //const userPostedImages = (await client.LRANGE('userPostedImages', 0, -1)).map(JSON.parse).filter((value) => value.userPosted === true);
            return test
            
            //}catch (error) {
                //res.status(404).json(error);
                //throw Error(error.message);
            //}
            
        },
    },

    Mutation: {
        userUploadPost: async (_, args) =>{
            const newImage = {
                id: uuid.v4(),
                url: args.url,
                posterName: args.posterName,
                description: args.description,
                binned: false,
                userPosted: true,
            };
            await client.HSET("userPostedImages", newImage.id, JSON.stringify(newImage));
            //await client.SET(newImage.id, JSON.stringify(newImage));
            //await client.LPUSH("userPostedImages", JSON.stringify(newImage));
            return newImage
        },

        userUpdateImage: async (_, args) => {
            const updateTheImage = {
                id: args.id,
                url: args.url,
                posterName: args.posterName,
                description: args.description,
                userPosted: args.userPosted,
                binned: args.binned,
            };
            const theDataInCache = JSON.parse(await client.HGET("userPostedImages",args.id));
            if (args.binned === true) {
                //await client.LREM("userPostedImages", JSON.stringify(theDataInCache));
                //await client.HSET("binnedImages", updateTheImage.id, JSON.stringify(updateTheImage));
                await client.HSET("userPostedImages", updateTheImage.id, JSON.stringify(updateTheImage));
                //await client.LPUSH("userPostedImages", JSON.stringify(updateTheImage));
            }
            else{
                await client.HDEL("userPostedImages", args.id);
                //await client.HDEL("binnedImages", args.id);
                //await client.LREM("userPostedImages", JSON.stringify(updateTheImage));
                //await client.DEL(args.id);
                
            }
            return updateTheImage
        },
        userDeletePost: async (_, args) => {
            //const theDataInCache = JSON.parse(await client.GET(args.id));
            //await client.LREM("userPostedImages", JSON.stringify(theDataInCache));
            //const theBinnedImages = (await client.LRANGE('userPostedImages', 0, -1)).map(JSON.parse);
            //for(let i = 0; i < theBinnedImages.length;i++){
                //if (theBinnedImages[i].id === args.id) {
                    //await client.LREM("userPostedImages", JSON.stringify(theDataInCache));
                //}
            //}
            //await client.DEL(args.id);
            //await client.HDEL("binnedImages", args.id);
            await client.HDEL("userPostedImages", args.id);
            return args;
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});

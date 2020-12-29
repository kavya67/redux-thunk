import baseapi from "../api/baseapi";
import _ from "lodash"; //solution #1

//get posts deatails
export const fetchPost = () => async (dispatch) => {
  //function invoked with arguements as dispatch and getstate
  const response = await baseapi.get("/posts"); // will wait for the response
  dispatch({ type: "FETCH_POST", payload: response.data }); //manually dispatch of new action with the response as payload which is nothing but a object
};

//an action can return an object or a function , if function then
//the redux thunk will invoke it with dispatch and getstate arguements
//and will wait for the request to finish inside the function
//once request complete , dispatch manually
// new action creator is formed and will return an object,
// that is dispatched and passed to the reducer

// fuction (dispatch, getstate) {
//   const response = await baseapi.get("/posts");
//   dispatch({ type: "FETCH_POST", payload: response })
// }

//Using redux-thunk can wait for the response to complete and also can dispatch any point of time in future

//get single user

export const fetchUser = (id) => async (dispatch) => {
  const response = await baseapi.get(`/users/${id}`);
  dispatch({ type: "FETCH_USER", payload: response.data });
};
//this action creator is making multiple api calls for the same id,

// one of the solution is to use memoize fuction (lodash library)
//solution #1 Memoize One Time
// export const fetchUser = id => dispatch => _fetchUser(id, dispatch);
// const _fetchUser = _.memoize(async (id, dispatch) => {
//   const response = await baseapi.get(`/users/${id}`);
//   dispatch({ type: "FETCH_USER", payload: response.data });
// })

//solution #2 Alternate overfetching solution
//action creators inside action creator
//#1 call 'fetchPosts'
//#2 get list of posts ('getState' is used to access the fetchPosts data)
//#3 find the unique id's from list of posts
//#4 iterate over unique id's
//#5 call 'fetchUser' for each unique userid's
export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  await dispatch(fetchPost());
  // const userIds = _.uniq(_.map(getState().posts, "userId"));
  // console.log(userIds);
  // userIds.forEach((id) => dispatch(fetchUser(id)));

  //refractor using chain
  _.chain(getState().posts) //data of posts are passed as first arguement to map method
    .map("userId") //first argument is getState data and second arguement is key value
    .uniq() // above map data is passed to uniq to find uniq value
    .forEach((id) => dispatch(fetchUser(id))) //data of uniq is iterated to call fetchUser
    .value(); //invoke this method will execute the above methods
};
